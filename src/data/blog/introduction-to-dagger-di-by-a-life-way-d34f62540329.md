---
title: "🔪 Introduction to Dagger DI 💉 by a Life way!"
pubDatetime: 2020-03-15T07:54:11.457Z
description: "Demystifying Dependency Injection with Dagger. Learn DI concepts through real-life analogies and simplify your Android app architecture."
tags:
  - others
coverImage: "../../assets/images/cover-introduction-to-dagger-di-by-a-life-way-d34f62540329.png"
---

In this article, I’ll explain the basic concept of popular 💉 _Dependency Injection_ framework — Dagger 🔪 by using a simple example.

You might hear the terms — _Dagger_ or _Dependency Injection._ What’s it actually? Why it’s used? Why developers use it? Okay! we’ll see it.

---

## What is Dagger?

Dagger is a fully static, compile-time [dependency injection](http://en.wikipedia.org/wiki/Dependency_injection) framework for both Java and Android.

## Okay, then what is Dependency Injection? 😕

**Dependency Injection** (DI) is a design pattern that allows the creation of dependent objects outside of a class and provides those objects to a class in different ways. Using DI, we move the creation and binding of the dependent objects outside of the class that depends on them.

## Still not getting it? 😕 Don’t worry

When you are developing a program, you may have classes that depend on other classes for their creation. Sometimes, it becomes complex to create such dependencies. At such times, dagger comes to rescue. Let’s see how 😃.

---

## 💭 Imagine your Life —

You’ve your **Life**. It has Basic **Needs**. Needs include **Food, Clothes,** and **Shelter**. These basic needs are possible in your life only if you have **Money**. Money can be there if you have a good **Job**. Also, it depends if you have **Education**.

As above, **Life** is dependent on many factors. If anyone of dependency is missing, the whole _life will become shit!_ 😢 Else _it’ll be enjoyable_ 😃. Right? Now, how it’s related to DI? Let’s convert your imagination into the code. See code below 👇:

<script src="https://gist.github.com/PatilShreyas/42a4281f433103ef2d2803b270fc6edd.js"></script>

We required to manually create each and every object and passed it to the constructor.

In such situations, _Dependency Injection_ comes to the rescue. Let’s start the code 👉

---

## 💻 Getting Started

Import below dependencies in your project:

```groovy
dependencies {
    implementation 'com.google.dagger:dagger:2.15'
    annotationProcessor 'com.google.dagger:dagger-compiler:2.15'
}
```

In your code, use `@Inject` to annotate the constructor that Dagger should use to create instances of a class. When a new instance is requested, Dagger will obtain the required parameter values and invoke this constructor. Let’s make **Life** classes one by one…

- The base of our **Life** is **Education**:

<script src="https://gist.github.com/PatilShreyas/91b985f4d95af5d95cccfb076d87e81f.js"></script>

Here we’ve injected constructor. It means we are telling dagger that to create its instance.

- Now **Job** is dependent on **Education**:

<script src="https://gist.github.com/PatilShreyas/4a280b4ffd0e4c5574fd4ab1de70df33.js"></script>

- **Money** is dependent on **Job**:

<script src="https://gist.github.com/PatilShreyas/f12879f021a8175229b0ea380ef4fb84.js"></script>

Remember, we’ve annotated this class as `@Singleton` to ensure the single instance of **Money** throughout Life program.

- Now **Food, Clothes,** and **Shelter** are dependent on Money:

<script src="https://gist.github.com/PatilShreyas/8c3e8375c9483ac2363b3acc4b1ecfba.js"></script>

- Then **Needs** are **Food, Clothes** & **Shelter**:

<script src="https://gist.github.com/PatilShreyas/084fae8381aa146f223480ca5feea51c.js"></script>

- Finally, **Life** has **Needs**:

<script src="https://gist.github.com/PatilShreyas/355c9117bed0c6e4005513dae7dae0c1.js"></script>

You can see, we have annotated constructor by `@Inject`. Dagger will take care to create an instance of these dependencies.

---

### Make _Life_ Component

Create an interface with a method `getLife()` which will return `Life` instance.

<script src="https://gist.github.com/PatilShreyas/ed90c36ae4c9722341b042698815055b.js"></script>

Now Dagger will take care of making **Life** and its _dependencies_. 😃

Just Build ⚙️ your project so that the dagger will generate classes.

Now you’ll surprise after seeing the simplified code after using _Dependency Injection_. Here’s code after using Dagger DI framework 👉:

<script src="https://gist.github.com/PatilShreyas/dc30ec931d09b0836d3f6172f4721bad.js"></script>

Dagger internally created **Life** along with all dependencies. Finally, if you run this code, you’ll see output:

```txt
I'm Well Educated!
I've Job!
I've Money!
I can eat delicious dishes!
I've Clothes to wear!
I've my own house to live!
I'm enjoying my life! :)
```

There are no chances that it would fail. In manual DI, it may fail if we by mistake pass any dependency as `null`.

> **Yeah 😍!** It’s working as expected. Hope you liked that. If you find it helpful please share this article. Maybe it’ll help someone needy!

> Sharing is Caring!

---

## Resources

Here is a repository that contains the code used in this article.

- [**PatilShreyas/BasicsOfDagger-Java**](https://github.com/PatilShreyas/BasicsOfDagger-Java)

**Thank you 😄!**

If you want to contact me, feel free to reach me…
[https://patilshreyas.github.io](https://patilshreyas.github.io).
