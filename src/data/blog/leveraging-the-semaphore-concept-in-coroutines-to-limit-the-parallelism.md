---
title: "Leveraging the Semaphore concept in Coroutines to limit the parallelism 🔀"
pubDatetime: 2022-04-01T12:57:35.603Z
description: "Explore the concept of Semaphores in Kotlin Coroutines. Learn how to limit parallelism and manage resource access in concurrent programming."
tags:
  - java
  - multithreading
  - android
  - kotlin
  - coroutines
coverImage: "../../assets/images/cover-leveraging-the-semaphore-concept-in-coroutines-to-limit-the-parallelism.png"
---

Hey Kotliners 👋, in this blog, we'll learn to use the concept of Semaphore with Kotlin coroutines to limit parallelism. You might have learned about the semaphores let's understand it one more time.

---

## What is Semaphore? 🤷

Semaphore is a technique by which concurrent processes or operations are managed using an integer value. It takes care of concurrent operations made to the common resources across multiple threads to achieve process synchronization.

Semaphore keeps track of how many permits are available to access a particular resource in according to avoid race conditions. These permits are acquired before accessing and become free when the operation is completed. If a permit can't be acquired (_i.e. no permits available_), it waits until the permit to access the resource is available. Semaphore serves requests on the basis of FIFO (First in, First out).

### There are two types of semaphore

#### 1. Binary semaphore

Semaphores that are restricted to the values 0 and 1 (locked/unlocked) are called binary semaphores and are used to implement locks. At a time, only one process is allowed to access a particular resource which simply acts as a Mutex (_A lock is designed to enforce a mutual exclusion concurrency control policy, and with a variety of possible methods there exist multiple unique implementations for different applications_. See [Mutual Exclusion](https://en.wikipedia.org/wiki/Mutual_exclusion)).

#### 2. Counting semaphore

Semaphores that allow an arbitrary resource count are called counting semaphores. It can allow a certain number of processes to access particular resources concurrently.

Refer to the below GIF for understanding the counting semaphore visually:

![Semaphore](https://i.imgur.com/rwi2CtI.gif)

Here, Semaphore **S** has **_maximum 4 permits initially_**. It means only four processes will be able to access particular resources concurrently.

- Here **P1, P2, P3, P4, P5, P6** trying to acquire the permit from the Semaphore.
- As per the FIFO, **P1, P2, P3, P4** acquire the permits and Semaphore does not have permits available (i.e. 0).
- Thus **P5** and **P6** wait till the permit is available.
- As **P4** and **P2** complete and release the lock from Semaphore (_ **P1** and **P3** still running_). 2 permits become available in the semaphore, and thus **P5** and **P6** acquire a permit to execute.
- By the time, **P1** and **P3** also complete and release semaphore permit.
- After completion of **P5** and **P6**, they release the semaphore lock, and the Semaphore now has all permits retained (i.e. back to 4).

That's all the basic things to know about the Semaphores.

---

## Let’s understand and solve the real problem statement 🤔

As the title says, let's come to the main topic. Let's say we are creating a function that concurrently iterates items from a list and transform each item into another just like a `map{}` function of Kotlin collections but with the ability to execute in parallel (_Just like Java's `parallelStream()`_). Let's say, initially we create the function like 👇🏻:

```kotlin
fun <T, R> Iterable<T>.map(
    dispatcher: CoroutineDispatcher,
    transform: (T) -> R
): List<R> = runBlocking {
    map { item -> async(dispatcher) { transform(item) } }.awaitAll()
}

fun doSomething(users: List<User>) {
    users.map(Dispatchers.Default) { user -> user.toSomething() /* `toSomething()` is heavy method */ }
}
```

In this function, we require `dispatcher` which is then used inside `async` coroutine builder. It means it will use all threads from a thread pool by which the dispatcher will be created. As we are aware that computational operations should be performed on `Dispatchers.Default` so we used it.

So what's wrong here 🤔? It'll use all threads from the default coroutine dispatcher and thus if the list is really huge, all threads of the default dispatcher will be busy in parallelly mapping the list and it may be unavailable to perform other important tasks in our application or it may also cause latency in performing other business tasks (which also use `Dispatchers.Default`).

What if we provide our own dispatcher for this function? We know that we can create a customized dispatcher with a fixed thread pool just like this:

```diff
+ val dispatcher = Executors.newFixedThreadPool(12).asCoroutineDispatcher()

fun <T, R> Iterable<T>.map(
-   dispatcher: CoroutineDispatcher,
    transform: (T) -> R
): List<R>
```

Here, the fixed thread pool of 12 threads will be created and all these 12 threads will be active forever. Thus threads can be wasted. Also, there is no freedom for us to specify parallelism or concurrency if we want to control it for mapping some lists based on the use case.

Let's say there are two lists **A** and **B**. We know that mapping list **A** is not that heavy so we want to map with 2 items concurrently (max 2 threads) but we are aware that list **B** is heavier to map so we want to map 10 items concurrently (max 10 threads). So what can we do? Will we create custom dispatchers for every different need? Big No 🤯, that's not gonna help because this way we'll end up using a lot of system resources and wasting threads ❌.

This is the situation where semaphore is the solution 😀.

### Solution 💡

Kotlin coroutine library has provided API for [Semaphore](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.sync/-semaphore/index.html) where we can easily control access to the resources with semaphore. We can create a semaphore with permits and perform operations with it as below 👇:

```kotlin
// This is example to explain the API for semaphore

fun main() {
  // Creates semaphore with 10 permits
  val semaphore = Semaphore(permits = 10)

  // Acquires a permit from this semaphore, suspending until one is available.
  // All suspending acquirers are processed in first-in-first-out (FIFO) order
  semaphore.acquire()

  // Releases a permit, returning it into this semaphore.
  // Resumes the first suspending acquirer if there is one at the point of invocation
  semaphore.release()
}
```

Cool, let's rework our recently discussed use case of mapping list concurrently. Now, what we'll do is we'll introduce the parameter `concurrency` of type integer in that function and we'll create the semaphore with a permit that is specified as `concurrency`. Let's see the updated code 🧑‍💻:

```kotlin
fun <T, R> Iterable<T>.map(
    concurrency: Int,
    transform: (T) -> R
): List<R> = runBlocking {
    // Create semaphore with permit specified as `concurrency`
    val semaphore = Semaphore(concurrency)

    map { item ->
        // Before processing each item, acquire the semaphore permit
        // This will be suspended until permit is available.
        semaphore.acquire()

        async(Dispatchers.Default) {
            try {
                transform(item)
            } finally {
                // After processing (or failure), release a semaphore permit
                semaphore.release()
            }
        }
    }.awaitAll()
}

fun doSomething(users: List<User>) {
    // Concurrently 5 users will be processed
    users.map(concurrency = 5) { user -> user.toSomething() /* `toSomething()` is heavy method */ }
}
```

Now as you can see, before mapping each item, we are acquiring a semaphore permit and releasing it after processing it. Thus, it's also taken care that the maximum parallelism of this function would be the value specified for the parameter `concurrency` thus we won't run out of threads 🧵.

### More example ✨

Refer to [ChannelFlowMerge<T> class](https://github.com/Kotlin/kotlinx.coroutines/blob/1.6.0/kotlinx-coroutines-core/common/src/flow/internal/Merge.kt#L56-L71) for usage of Semaphore which uses Semaphore to concurrently merge `Flow`s. This class is been used for flattening the flow and collecting flows concurrently.

## Advantage of this approach 🦸🏻‍♂️

- **Saving wastage of threads:** Obviously if we provide higher value, threads would be still wasted, but it's in the control of the developer to handle it. So as compared to the previous approaches, this approach saves resources.
- **Proper handling of parallelism:** On any dispatcher, parallelism can be controlled with the help of semaphores. The developer has the freedom to specify concurrency based on the use case.

## Take care while using Semaphore 🤨

If the semaphore is not handled properly, it may block the execution of the use case of the application let's say the semaphore permit is not released. So make sure that whenever you're using Semaphore, you're handling it properly. The acquired permit should be always released once its purpose is done.

Also, parallelism will only work if it has the number of threads available in the particular dispatcher. Let's say my machine has 12 cores so `Dispatchers.Default` can have maximum parallelism as 12 and a minimum of 1. If we try to specify greater than 12 then it would be anyways limited to 12.

That's all about it! 🤩

---

## Note 📝

[Kotlin Coroutines 1.6.0 has introduced a function `limitedParallelism()`](https://blog.jetbrains.com/kotlin/2021/12/introducing-kotlinx-coroutines-1-6-0/#dispatcher-views-api) that allows us to create a view of the current dispatcher that limits the parallelism to the given value.

> The resulting view uses the original dispatcher for execution, but with the guarantee that no more than parallelism coroutines are executed at the same time. This method does not impose restrictions on the number of views or the total sum of parallelism values, each view controls its own parallelism independently with the guarantee that the effective parallelism of all views cannot exceed the actual parallelism of the original dispatcher.
>
> Ref: [Docs](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/limited-parallelism.html)

Example usage:

```kotlin
// At most 2 threads will be processing with this dispatcher
val dispatcher = Dispatchers.Default.limitedParallelism(parallelism = 2)
```

So this function can be also useful wherever needed.

---

That's all, I hope you found this helpful.

"Sharing is caring"

Thank you! 😀

---

## 📚 References

- [Semaphore](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.sync/-semaphore/index.html)
- [limitedParallelism](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/limited-parallelism.html)
