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

<script src="https://gist.github.com/PatilShreyas/bca85234aee7c67c19ab92fe2b3cab1e.js"></script>

Next, let’s create our model class. Create a new file and name it `Post.kt`.

<script src="https://gist.github.com/PatilShreyas/1e5479b62fd73e43253bd5802ad077c1.js"></script>

In this application, we’ll need to manage the state of operations in our UI. For example handling the _Loading, Success_ or _Failure_ states. For that, we’ll create a `State.kt` class.

<script src="https://gist.github.com/PatilShreyas/e058a01b400e38fd874eb1dbb61d2c6f.js"></script>

Now let’s design a **Repository** for this application. _It’ll be a single source of the data throughout the application_. 🚀

<script src="https://gist.github.com/PatilShreyas/73e889f9cf60697f9a083717c714a3fa.js"></script>

This is how our repository will look like. We’ll declare these two functions here:

- **`getAllPosts()`** — this will return a `Flow<State>`.
- **`addPost()`** — this will add a post into the Cloud Firestore collection and will return `Flow<State>`.

Let’s implement `getAllPosts()`:

<script src="https://gist.github.com/PatilShreyas/ab2f55d46b123e10e048daf07e15e431.js"></script>

As you can see, we are returning a flow with the `flow {}` builder.

- First of all, we are emitting the **Loading** state which will inform the UI that our data is now in loading state.
- Then we’re collecting posts with `await()` which will block this thread until it’s retrieved.
- Then we’re emitting the **Success** state along with the posts.
- If any `Exception` is thrown, a `catch` operator will handle the exception for the upstream ⬆️ flow. Then it’ll be executed and we’ll be emitting the **Failed** state along with a message.

> No need to write code within the `try { } catch { }` block when using Flow: if any `Exception` is thrown on the upstream ⬆️ _flow_, it will be handled by the downstream `catch` operator.

Now we’ll implement the same for `addPost()`:

<script src="https://gist.github.com/PatilShreyas/cface010611ce7711bc62350e27b85db.js"></script>

This should look familiar to you by now :-)

---

## Now, let’s implement the Android Part 😃

After having implemented our repository (which will handle all data reads/writes to/from Cloud Firestore), we can create a `ViewModel` which will be useful to interact with Android `Activities`. The `ViewModel` will be the bridge between `PostsRepository` and `MainActivity`.

<script src="https://gist.github.com/PatilShreyas/a218ce3c5a77fb6acbdd1219225562d9.js"></script>

Finally, it’s time to retrieve posts on the UI (`MainActivity`).

We’ll need to perform _flow_ operations on the **coroutine context** because the _flow_ is asynchronous and for this, we’ll need to create a `suspend` function to handle repository operations from _ViewModel_. The `suspend` function can be paused and resumed at a later point in time.

<script src="https://gist.github.com/PatilShreyas/7b299785b63c53c7ee939f2fc4fcc255.js"></script>

And the same for adding posts:

<script src="https://gist.github.com/PatilShreyas/28848bbb3c681022583c3a47a4d7a872.js"></script>

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
