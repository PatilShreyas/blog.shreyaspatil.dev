---
title: "🔥Firebase-ing with Kotlin Coroutines + Flow 🌊"
pubDatetime: 2020-04-30T07:35:30.250Z
description: "Learn how to integrate Firebase with Kotlin Coroutines and Flow for reactive data streams in your Android applications."
tags:
  - others
coverImage: "../../assets/images/cover-firebase-ing-with-kotlin-coroutines-flow-dab1bc364816.jpeg"
---

🔥 Firebase-ing with Kotlin Coroutines + Flow 🌊

In this article, we’ll demonstrate using Kotlin Coroutines and 🌊 _Flow_ with 🔥 Firebase _Cloud Firestore_ in Android.

Firebase APIs are asynchronous i.e. you’ll need to register a _listener_ if you want to **read data** or want the **result of written data**. As you might know, Kotlin coroutines are developed for _asynchronous/non-blocking_ programming. Firebase developers have developed a separate library to use with Kotlin which is backed by Kotlin superpower! Thus, we’ll get to know how to implement firebase Cloud Firestore with Coroutines and Flow.

---

### It’s Okay, but **what is** Flow? 🤷‍♂️

_Here’s a quick introduction._ Kotlin Flow is an implementation of reactive streams made on top of coroutines and channels for Kotlin.

_You might have used_ RxJava/RxKotlin. `Observable` and `Flowable` types in `RxJava` are an example of a structure that represents a cold stream of items. Then Kotlin Coroutines Flow 🌊 is the alternative for it. Flow API in Kotlin is a better way to handle the stream of data asynchronously that executes sequentially.

_Flow API is cold in nature ❄️ (It means it’ll only emit values whenever there is a receiver to collect it. Otherwise, the hot producer represents a host stream which emits values though there’s no receiver. For e.g. [Channels](https://kotlinlang.org/docs/reference/coroutines/channels.html) in Kotlin is a hot ♨️ stream)_. `flow{}` builder is used for creating flow which can contain asynchronous and heavy operations. and value is not emitted until the terminal function `collect` is called.

---

## ⚡️ Getting Started

Let’s write some code!

Open _Android Studio_ and create a new project. Alternatively, you can simply clone [this repository](https://github.com/PatilShreyas/FirebaseFlowExample). This is a very simple app for demonstrating the use of Kotlin Coroutine’s Flow API to show a list of posts.

### Gradle Setup

In the app module of `build.gradle`, include following dependencies:

```gradle
dependencies {

    // Kotlin
    implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk7:$kotlin_version"

    // Kotlin Coroutines
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.3.5"
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.3.5"
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-play-services:1.3.5'

    // Android
    implementation 'androidx.appcompat:appcompat:1.1.0'
    implementation 'androidx.core:core-ktx:1.2.0'
    implementation 'androidx.constraintlayout:constraintlayout:1.1.3'

    // ViewModel
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.2.0'

    // Firebase Cloud Firestore (Kotlin)
    implementation 'com.google.firebase:firebase-firestore-ktx:21.4.2'
}
```

Next, let’s create our model class. Create a new file and name it `Post.kt`.

```kotlin
data class Post(
    val postContent: String? = null,
    val postAuthor: String? = null
)
```

In this application, we’ll need to manage the state of operations in our UI. For example handling the _Loading, Success_ or _Failure_ states. For that, we’ll create a `State.kt` class.

```kotlin
sealed class State<T> {
    class Loading<T> : State<T>()
    data class Success<T>(val data: T) : State<T>()
    data class Failed<T>(val message: String) : State<T>()

    companion object {
        fun <T> loading() = Loading<T>()
        fun <T> success(data: T) = Success(data)
        fun <T> failed(message: String) = Failed<T>(message)
    }
}
```

Now let’s design a **Repository** for this application. _It’ll be a single source of the data throughout the application_. 🚀

```kotlin
class PostsRepository {
  private val mPostsCollection = FirebaseFirestore.getInstance().collection(Constants.COLLECTION_POST)

  fun getAllPosts() { // TODO Implement }
  fun addPost(post: Post) { // TODO Implement }
  ...
}
```

This is how our repository will look like. We’ll declare these two functions here:

- **`getAllPosts()`** — this will return a `Flow<State>`.
- **`addPost()`** — this will add a post into the Cloud Firestore collection and will return `Flow<State>`.

Let’s implement `getAllPosts()`:

```kotlin
fun getAllPosts() = flow<State<List<Post>>> {

    // Emit loading state
    emit(State.loading())

    val snapshot = mPostsCollection.get().await()
    val posts = snapshot.toObjects(Post::class.java)

    // Emit success state with data
    emit(State.success(posts))

}.catch {
    // If exception is thrown, emit failed state along with message.
    emit(State.failed(it.message.toString()))
}.flowOn(Dispatchers.IO)
```

As you can see, we are returning a flow with the `flow {}` builder.

- First of all, we are emitting the **Loading** state which will inform the UI that our data is now in loading state.
- Then we’re collecting posts with `await()` which will block this thread until it’s retrieved.
- Then we’re emitting the **Success** state along with the posts.
- If any `Exception` is thrown, a `catch` operator will handle the exception for the upstream ⬆️ flow. Then it’ll be executed and we’ll be emitting the **Failed** state along with a message.

> No need to write code within the `try { } catch { }` block when using Flow: if any `Exception` is thrown on the upstream ⬆️ _flow_, it will be handled by the downstream `catch` operator.

Now we’ll implement the same for `addPost()`:

```kotlin
fun addPost(post: Post) = flow<State<DocumentReference>> {

    // Emit loading state
    emit(State.loading())

    val postRef = mPostsCollection.add(post).await()

    // Emit success state with post reference
    emit(State.success(postRef))

}.catch {
    // If exception is thrown, emit failed state along with message.
    emit(State.failed(it.message.toString()))
}.flowOn(Dispatchers.IO)
```

This should look familiar to you by now :-)

---

## Now, let’s implement the Android Part 😃

After having implemented our repository (which will handle all data reads/writes to/from Cloud Firestore), we can create a `ViewModel` which will be useful to interact with Android `Activities`. The `ViewModel` will be the bridge between `PostsRepository` and `MainActivity`.

```kotlin
class MainViewModel(private val repository: PostsRepository) : ViewModel() {

    fun getAllPosts() = repository.getAllPosts()

    fun addPost(post: Post) = repository.addPost(post)
}
```

Finally, it’s time to retrieve posts on the UI (`MainActivity`).

We’ll need to perform _flow_ operations on the **coroutine context** because the _flow_ is asynchronous and for this, we’ll need to create a `suspend` function to handle repository operations from _ViewModel_. The `suspend` function can be paused and resumed at a later point in time.

```kotlin
private suspend fun loadPosts() {
    viewModel.getAllPosts().collect { state ->
        when (state) {
            is State.Loading -> {
                showToast("Loading")
            }

            is State.Success -> {
                val postText = state.data.joinToString("\n") {
                    "${it.postContent} ~ ${it.postAuthor}"
                }

                binding.textPostContent.text = postText
            }

            is State.Failed -> showToast("Failed! ${state.message}")
        } // END when
    } // END collect
}
```

And the same for adding posts:

```kotlin
private suspend fun addPost(post: Post) {
    viewModel.addPost(post).collect { state ->
        when (state) {
            is State.Loading -> {
                showToast("Loading")
                binding.buttonAdd.isEnabled = false
            }

            is State.Success -> {
                showToast("Posted")
                binding.fieldPostContent.setText("")
                binding.buttonAdd.isEnabled = true
            }

            is State.Failed -> {
                showToast("Failed! ${state.message}")
                binding.buttonAdd.isEnabled = true
            }
        }
    }
}
```

Now let’s discuss what’s happening:

_Once we call the terminal operator `collect{}` on flow, this flow will be executed._ Whenever we’re emitting a `State` it will be collected here and any UI updates will be executed based on this. This is how we handled the UI state using 🌊 Flow.

This is how posts will be loaded in the application. 🚀

![](../../assets/images/content/firebase-ing-with-kotlin-coroutines-flow-dab1bc364816/img-dd33533a.gif)

### What have we achieved? 🚀

- The synchronous flow of Data using a `ViewModel` and a **Repository**.
- We can handle state easily in our UI, since there’s always a defined state for each operation, such as _Loading, Success, Failure_.
- We haven’t used any listener with Cloud Firestore 😄.

The following state chart outlines the `getAllPosts()` operation:

![Statechart for getting posts from Cloud Firestore.](../../assets/images/content/firebase-ing-with-kotlin-coroutines-flow-dab1bc364816/img-a5b59634.png)

We have successfully implemented Cloud Firestore using Kotlin Coroutines and Flow.

The source code for this article is available in [this GitHub repo](https://github.com/PatilShreyas/FirebaseFlowExample/).

---

## Resources

- [https://github.com/PatilShreyas/FirebaseFlowExample/](https://github.com/PatilShreyas/FirebaseFlowExample/)
- [Kotlin Flow Documentation](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/index.html)
