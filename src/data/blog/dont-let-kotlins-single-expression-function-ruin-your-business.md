---
title: "Don't let Kotlin's single-expression function ruin your business😲"
pubDatetime: 2021-05-24T14:42:29.559Z
description: "Understand why relying on Kotlin's automatic type inference in single-expression functions can lead to subtle bugs and business logic failures."
tags:
  - android
  - kotlin
  - kotlin-beginner
  - programming-tips
coverImage: "../../assets/images/cover-dont-let-kotlins-single-expression-function-ruin-your-business.png"
---

Hello developers 👋,

This is a mini-blog where we'll see how a small mistake can lead to a confusing and serious issue.

Kotlin provides us with a way where we can define single-expression functions for one-shot operations. For e.g. we do something like this 👇:

```kotlin
fun getItemById(id: String) = repository.findItemById(id)
```

The return type of the above function will be the return type of the result of `findItemById()`, right? In the single-expression function, we don’t have a need to specify return type since it’s automatically inferred by Kotlin’s compiler.

---

## The real problem 😬

One day I was playing with Kotlin and while doing it I came across an issue that was actually produced by my own mistake. This issue looks small but it took me some time to came to know about it.

Now let’s understand how can our mistake lead to the issues. So refer to the below code:

```kotlin
fun greetGoodMorning() {
    // Some code
    println("Good Morning")
}

fun greetGoodAfternoon() = {
    // Some code
    println("Good Afternoon")
}

fun main() {
    greetGoodMorning()
    greetGoodAfternoon()
}

// Output:
// Good Morning
```

What 😕? Just _Good Morning_? Why _Good Afternoon_ isn’t printed?

> [!TIP]
> [You can execute this code by clicking here](https://pl.kotl.in/rSEBxWiru)

---

## How? 🤔

Did you notice `= {}` in `greetGoodAfternoon()` function? So this is where the problem comes from. Let’s understand the issue.

So any developer won’t be intentionally writing such code. It may be just like we introduce typo mistakes! As we know, in a single-expression function, the returning type of a function is automatically inferred by the compiler (if not specified explicitly). When we write `= {}`, its return type is inferred internally as this 👇:

```kotlin
fun greetGoodAfternoon(): () -> Unit = {
    // Some code
    println("Good Afternoon")
}
```

Yes, it’s inferred as a lambda block 😅. So when we called `greetGoodAfternoon()` it returned a lambda!

If we call `greetGoodAfternoon().invoke()` or `greetGoodAfternoon()()` then it’ll be get executed (Because you now know what happened 😄).

> **Note:** IntelliJ IDEA or Android Studio warns you if you do such mistakes. But even after that if you ignored it, no one can help you.

---

## Solution 💡

We are humans! 😯 We always will do mistakes but that’s fine. The mistake which we did above (`= {}`) can’t be solved using any manual way. But there are some learnings by which we can avoid other related issues.

In my opinion, good practice to avoid mistakes will be a **habit of mentioning return types explicitly**! Yes, if we mention it explicitly (even if using a simple-expression function) then it’ll avoid mistakes and we’ll be sure about such things at compile time itself.

```kotlin
fun getItemById(id: String): Item = repository.findItemById(id)
```

By this, we can be sure that this function is returning `Item`. If not, then the compiler will be there to help you out. It makes code more readable and also we can be sure about it just by reading it (like what exactly function is returning). It can help the reviewer while reviewing code on GitHub as well 😎.

For a simple, one-liner call that _doesn’t return anything_, then this is fine 👇:

```kotlin
fun printSomething(something: Any) = println("$something")
```

There’s no doubt that Kotlin has made developer’s life simple and easy. But anyone can do such mistakes.

So the final conclusion is 👇:

> **Mention return type of a function explicitly and make it a habit!**

---

If you liked this article then share it with everyone! Maybe it’ll help someone who needs it.

Thank you 😃

---

> [!TIP]
> Many thanks to [Siddhesh Patil](http://siddroid.com/) and [Niharika Arora](https://thedroidlady.com) for helping me to make this better! 😃
