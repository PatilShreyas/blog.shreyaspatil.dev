---
title: 'Exploring "select" expression of Kotlin coroutines'
pubDatetime: 2022-09-27T14:29:44.314Z
description: "Learn how to use the 'select' expression in Kotlin Coroutines to await multiple suspending functions and select the first one that completes."
tags:
  - asynchronous
  - multithreading
  - android
  - kotlin
  - coroutines
coverImage: "../../assets/images/cover-exploring-select-expression-of-kotlin-coroutines.png"
---

Hey Kotliners 😁,

Kotlin Coroutines is a very powerful library that comes along with a lot of APIs which provide out-of-box functionalities. In this article, we will look at one of the APIs i.e. **_`select` expression_**.

---

## What is a `select` expression? 🤨

While application development, you may have several suspended functions and you want to have a single business logic that operates on the results of the suspended functions as they complete. The coroutines library provides this capability through the select function. The select function acts as a type-safe builder, where extension functions are provided that can register callbacks on the suspendable functions.

In Kotlin coroutines, the "select" expression makes it possible to await multiple suspending functions simultaneously and selects the first result that becomes available. It's a suspending function that is suspended until one of the clauses is either selected or fails.

The select expression can be used in some of the use cases while application development. _For example_:

- There's a scenario in which you want to process **"X"** thing when anyone from data **"A"** or **"B"** becomes available first.
- You are running a few operations concurrently and whichever finishes (_or returns result_) first, proceed with the result of the winner operation i.e. data race.

...And a lot of use cases like this.

Let us explore it more by looking at examples.

---

## Using it ✨

As we discussed some use cases, the very simple example of using `select` could be like this👇🏻:

```kotlin
fun main() = runBlocking<Unit> {
    val winner = select<String> {
        data1().onAwait { it }
        data2().onAwait { it }
    }

    println("The winner = $winner") // prints "The winner = Hello"
}

fun data1() = GlobalScope.async {
    delay(1000)
    "Hello"
}

fun data2() = GlobalScope.async {
    delay(2000)
    "World"
}
```

In this example:

- `data1()` and `data2()` are function that return `Deferred<String>` in which `data1` takes 1000ms to load data and `data2` takes 2000ms.
- In the "select" builder, `onAwait()` clause is used to wait for the result.
- As `data1()` returns the result, its value (_"Hello"_) is selected since it's completed first. Thus it's a winner.

Let's take another example in which you want to perform a certain operation after a user performs some interaction on UI among the multiple choices. The select expression can be used like this 👇🏻:

```kotlin
suspend fun awaitCloseDialog() {
    select<Unit> {
        async { dialog.closeButton.awaitClick() }.onAwait { }
        async { dialog.okButton.awaitClick() }.onAwait { }
    }
    dialog.dismiss()
}
```

In this example, a `dialog` will be get dismissed when either the **"Close"** button is clicked or the **"OK"** button is clicked.

You can also select results from the values produced by the Channel APIs like the following 👇🏻:

```kotlin
fun main() = runBlocking<Unit> {
    repeat(5) {
        val number = select<Int> {
            evenChannel.onReceive { it }
            oddChannel.onReceive { it }
        }
        println(number) // prints "0 1 3 2 5"
    }
}

val evenChannel = GlobalScope.produce<Int> {
    repeat(10) {
        delay(1000)
        if (it % 2 == 0) {
            send(it)
        }
    }
}

val oddChannel = GlobalScope.produce<Int> {
    repeat(10) {
        delay(500)
        if (it % 2 != 0) {
            send(it)
        }
    }
}
```

In this example, the `evenChannel` produce even numbers after 1000ms and `oddChannel` produces numbers after 500ms. Thus you can see that odd numbers are selected more often than even numbers.

These were some basic examples of select expression.

---

> **Note:** When multiple clauses can be selected at the same time, the first one which was executed of them gets selected on the priority i.e. the select function is biased toward the first clause. Use [**_`selectUnbiased`_**](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.selects/select-unbiased.html) for an unbiased selection among the clauses which simply shuffles/randomizes the selection.

### List of supported select methods

These are APIs from coroutines that are supported for select expression clauses:

| **Receiver**                                                                                                                                    | **Suspending function**                                                                                                                                     | **Select clause**                                                                                                                                                |
| :---------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Job](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html)                                 | [join](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html)                                             | [onJoin](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/on-join.html)                                             |
| [Deferred](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/index.html)                       | [await](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html)                                      | [onAwait](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/on-await.html)                                      |
| [SendChannel](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/index.html)       | [send](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/send.html)                           | [onSend](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/on-send.html)                           |
| [ReceiveChannel](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/index.html) | [receive](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html)                  | [onReceive](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/on-receive.html)                  |
| [ReceiveChannel](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/index.html) | [receiveCatching](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive-catching.html) | [onReceiveCatching](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/on-receive-catching.html) |
| —                                                                                                                                               | [delay](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html)                                                | [onTimeout](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.selects/-select-builder/on-timeout.html)                    |

**_You can [visit official documentation](https://kotlinlang.org/docs/select-expression.html) for exploring more available APIs around the `select` expression._**

---

## Final thoughts 🧐

The `select` expression can be used in many use cases while developing applications in Kotlin. But remember that _currently this API is experimental which means that the design of the corresponding declarations has open issues which may (or may not) lead to their changes in the future_.

I hope you liked this article. Please share this article if you found this helpful.

> Sharing is caring! 🫶🏻

Thank you! 😃

---

## References 📚

- [Select expression](https://kotlinlang.org/docs/select-expression.html)
- [`select` API](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.selects/select.html)
