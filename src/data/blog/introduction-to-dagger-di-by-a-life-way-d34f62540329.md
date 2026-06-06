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

```java
public class WithoutDI {
    public static void main(String[] args) {
        Education education = new Education();

        Job job = new Job(education);

        Money money = new Money(job);

        Food food = new Food(money);
        Clothes clothes = new Clothes(money);
        Shelter shelter = new Shelter(money);

        Needs needs = new Needs(food, clothes, shelter);

        Life life = new Life(needs);

        life.enjoy();
    }
}
```

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

```java
package life;

import javax.inject.Inject;

public class Education {

    @Inject
    public Education() {
        System.out.println("I'm Well Educated!");
    }
}
```

Here we’ve injected constructor. It means we are telling dagger that to create its instance.

- Now **Job** is dependent on **Education**:

```java
public class Job {

    public Education mEducation;

    @Inject
    public Job(Education education) {
        this.mEducation = education;

        if (mEducation != null) {
            System.out.println("I've Job!");
        } else {
            System.out.println("I'm not well educated!");
        }
    }
}
```

- **Money** is dependent on **Job**:

```java
@Singleton
public class Money {

    public Job mJob;

    @Inject
    public Money(Job job) {
        this.mJob = job;

        if (mJob != null) {
            System.out.println("I've Money!");
        } else {
            System.out.println("I'm not working yet!");
        }
    }
}
```

Remember, we’ve annotated this class as `@Singleton` to ensure the single instance of **Money** throughout Life program.

- Now **Food, Clothes,** and **Shelter** are dependent on Money:

```java
public class Clothes {

    public Money mMoney;

    @Inject
    public Clothes(Money money) {
        this.mMoney = money;

        if (mMoney != null) {
            System.out.println("I've Clothes to wear!");
        } else {
            System.out.println("I don't have enough clothes to wear!");
        }
    }
}
```

- Then **Needs** are **Food, Clothes** & **Shelter**:

```java
public class Needs {

    public Food mFood;
    public Clothes mClothes;
    public Shelter mShelter;

    @Inject
    public Needs(Food food, Clothes clothes, Shelter shelter) {
        this.mFood = food;
        this.mClothes = clothes;
        this.mShelter = shelter;
    }

    public boolean fulfilled() {
        return mFood != null && mClothes != null && mShelter != null && mFood.mMoney != null;
    }
}
```

- Finally, **Life** has **Needs**:

```java
package life;

import javax.inject.Inject;

public class Life {

    public Needs mNeeds;

    @Inject
    public Life(Needs needs) {
        this.mNeeds = needs;
    }

    public void enjoy() {
        if (mNeeds.fulfilled()) {
            System.out.println("I'm enjoying my life! :)");
        } else {
            System.out.println("I can't enjoy my life :(");
        }
    }
}
```

You can see, we have annotated constructor by `@Inject`. Dagger will take care to create an instance of these dependencies.

---

### Make _Life_ Component

Create an interface with a method `getLife()` which will return `Life` instance.

```java
@Singleton
@Component
public interface LifeComponent {
    Life getLife();
}
```

Now Dagger will take care of making **Life** and its _dependencies_. 😃

Just Build ⚙️ your project so that the dagger will generate classes.

Now you’ll surprise after seeing the simplified code after using _Dependency Injection_. Here’s code after using Dagger DI framework 👉:

```java
public class Main {
    public static void main(String[] args) {
        Life life = DaggerLifeComponent.create().getLife();
        life.enjoy();
    }
}
```

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
