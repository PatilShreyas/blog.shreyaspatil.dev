---
title: "Let your delegates auto-nullify references☠️"
pubDatetime: 2021-03-12T13:39:24.000Z
description: "Learn how to use Kotlin property delegates to automatically nullify references in Android, preventing memory leaks in Fragments and Activities."
tags:
  - android-app-development
  - android
  - mobile-development
  - kotlin
  - kotlin-beginner
coverImage: "../../assets/images/cover-let-your-delegates-auto-nullify-references.png"
---

Hello Android developers 👋, In this article, we'll explore Kotlin's Delegated property feature to solve a common problem in Android which will help us to reduce memory leaks.

_Memory management_ is an important thing to take into consideration while developing a good and performant application. While developing any application, a **memory leak** is a common problem while developing an application if we didn't handle resources properly as per the _lifecycle_ events.

Let me give you examples. Imagine if you have a **Fragment** and it has references to some properties. We need to clear the references to these fields by assigning `null` in `onDestroyView()` lifecycle method so that Fragment won't hold references to them.

---

## 🎬 Example 1

You may have seen this snippet of code on [official Android's docs for ViewBinding](https://developer.android.com/topic/libraries/view-binding#fragments) 👇:

<script src="https://gist.github.com/PatilShreyas/3513835e881095b98f7e8d2b057b9252.js"></script>

Here, you can see that we need to create two fields `_binding` which is a _nullable_ backing field for _non-null_ field `binding`. What’s the reason for this? Read this 👇:

> **Note:** As this is mentioned in the official docs. Fragments outlive their views. Make sure you clean up any references to the binding class instance in the fragment’s [`onDestroyView()`](https://developer.android.com/reference/kotlin/androidx/fragment/app/Fragment#ondestroyview) method.

In this example, we need to declare these things twice. If we forgot to clear reference in `onDestroyView()` then it might lead to issues. We’ll see how to solve this after some time. Till then let’s take a look at another example.

---

## 🎬 Example 2

When you have worked with _RecyclerView,_ sometime you might have experienced a memory leak issue due to _RecyclerView.Adapter_ even in configuration changes like a rotating screen. So for such cases, again we need to clean adapter reference in `onDestroyView()` lifecycle method as following 👇:

<script src="https://gist.github.com/PatilShreyas/700491abfef1e6877800dc4917cb2c45.js"></script>

Here you can see that we finally setting _RecyclerView’s_ _Adapter_ as `null`. Alternatively, as mentioned in **OR** (2️⃣) comments, we can also declare `mAdapter` as nullable. But if we do so then we'll need to use `?` with adapter instance every time we try to access it 😫.

Here again, if we forget to set adapter as `null` in `onDestroyView()` then it might be a problem if there’s any process that tries to access the adapter.

In both examples, we used backing fields for references like `_ref` for every `ref` and **nullified** it in `onDestroyView()`. So how to avoid this _repetition_, make it _more readable_ or _reduce boilerplate_ for every Fragment/Activity or Android’s component?

---

## 💡 Solution

The [_Jetpack library for Lifecycle_](https://developer.android.com/topic/libraries/architecture/lifecycle) is a very powerful library by which we can develop Android _lifecycle-aware_ components which allow us to observe the lifecycle of components and thus we can handle things accordingly. Also, Kotlin has a variety of features and the [Delegated property](https://kotlinlang.org/docs/delegated-properties.html) is one of the great features. So let’s see it in action.

I read the source code of [AutoClearedValue](https://github.com/android/architecture-components-samples/blob/08416a0aced0e4946e0765751a3b20f9a6222708/GithubBrowserSample/app/src/main/java/com/android/example/github/util/AutoClearedValue.kt#L31) from official samples and [Gabor Varadi](https://medium.com/u/7a8d96da8cb6?source=post_page-----3ad6d8875497--------------------------------)’s [article](https://medium.com/@Zhuinden/an-update-to-the-fragmentviewbindingdelegate-the-bug-weve-inherited-from-autoclearedvalue-7fc0a89fcae1) where he mentioned a bug in this implementation. So this solution is inspired by the learnings of these two references.

First of all, add these Jetpack Lifecycle Component libraries:

```groovy
implementation 'androidx.lifecycle:lifecycle-common-java8:2.3.0'
implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.3.0'
```

Create a class `AutoCleanedValue.kt` where we’ll wrap our logic for auto-nullifying references 👇:

<script src="https://gist.github.com/PatilShreyas/066edc8bf96804dcdd1cb7d930fb0410.js"></script>

Let’s understand it:

- **`AutoCleanedValue`** is implementing a `ReadWriteProperty` which is a base interface from the standard library that can be used for implementing property delegates of read-write properties.
- It has two parameters in the constructor i.e. `fragment` (_since we are making it for Fragment as of now_) and `initializer` lambda (_Optional_) which provides the initial value which might be helpful for immutable types.
- There’s a field `_value` which will act as a backing field for references.
- On initialization, we are observing the **View** lifecycle of a fragment and _nullifying it_ **when the view lifecycle is destroyed**.
- In short, anybody can’t access the reference once Fragment’s `onDestoryView()` lifecycle method is called.
- If the value is retrieved and if the current value is `null` due to Fragment's lifecycle then its value will be re-initialized with the help of `initializer` (_if it's provided_).

Okay! This is good. Now to make it easy to access from **Fragments**, let’s make an extension function:

<script src="https://gist.github.com/PatilShreyas/624a4217d40b0e4552e3a3ee222eda73.js"></script>

Cool! How we are going to use it? Looks like everything is settled. Let’s see in action how our Fragment will look like after using this delegate? Let’s summarize both the examples we saw in this article in a single snippet 👇:

<script src="https://gist.github.com/PatilShreyas/059ac5610cb4559ca884b5b54c091967.js"></script>

That’s it. Looking cool 😍, isn’t it?

### What we achieved?

- We don't need to have an **extra nullable backing field** means we don't need to have two fields for the same reference which will reduce the repetition of fields.
- No need to nullify it **manually** in `onDestroyView()` since the delegate will take care of it and thus we now can reuse this for every Fragment in a project.
- Thus it's now more readable with a reduced boilerplate 😎.

Now, this was just for Fragment. If we need we can extend it up to Activity, Service, etc.

I hope you liked this article. Share this if you find it helpful so that it can help someone who needs it. _Sharing is caring!_

Thank you. Have fun! 😄

---

## 📚 References

- [AutoClearedValue source code](https://github.com/android/architecture-components-samples/blob/8f536f2b7012c3c4d7bf80fec0de62893d53edbc/GithubBrowserSample/app/src/main/java/com/android/example/github/util/AutoClearedValue.kt)
- [An update to the FragmentViewBindingDelegate: the bug we’ve inherited from AutoClearedValue](https://itnext.io/an-update-to-the-fragmentviewbindingdelegate-the-bug-weve-inherited-from-autoclearedvalue-7fc0a89fcae1)
