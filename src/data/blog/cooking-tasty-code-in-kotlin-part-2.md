---
title: "👨‍🍳 Cooking Tasty code in Kotlin 🍴 — Part 2"
pubDatetime: 2021-01-01T09:23:42.000Z
description: "Part 2 of 'Cooking Tasty Code'. Dive deeper into Kotlin features like delegation, operator overloading, and more to enhance your coding style."
tags:
  - coding
  - kotlin
  - programming-languages
  - kotlin-beginner
  - programming-tips
coverImage: "../../assets/images/cover-cooking-tasty-code-in-kotlin-part-2.png"
---

Hey developers 👋, welcome back to the second part of the series. In this article, I’ll walk you through some more or advanced recipes to cook your code tasty 😋 in Kotlin.

Missed first of the series? Okay, here’s that if you want to take a look 👇:

[**Cooking Tasty code in Kotlin 🍴 — Part 1**](https://blog.shreyaspatil.dev/cooking-tasty-code-in-kotlin-part-1)

To be honest, you can find some concepts here which might be not easy to understand if you’re a beginner or new to the Kotlin. Still, I’ll try my best to explain it with some examples.

---

## ⭐️ String templates

- Kotlin provides string templates for performing a variety of operations with string.
- Using it, we can simplify our code and make it even more readable and easy to trace.
- For example, see this 👇:

```diff
fun main() {
     doGreet("John Doe")
 }

 fun doGreet(name: String) {
-   val greetMessage = "Good Morning " + name + " 🌅"
+   val greetMessage = "Good Morning $name 🌅"

    println(greetMessage) // prints "Good Morning John Doe 🌅"
 }
```

Here you can see we didn’t need `+` to concatenate to strings. Instead, we can directly include types using `$` which replace the value of that variable. See this now 👇:

```diff
fun main() {
-    val json = "{\"name\": \"John Doe\", \"age\": 200}"
+    val json = """{"name": "John Doe", "age": 200}"""
     println(json) // prints: {"name": "John Doe", "age": 200}
}
```

We had to include double-quotes in a string. For example, `"name": "John Doe"`. If you see removed code (🔴) here, we need to use `\"` to include double quotes in a string and then it becomes hard to read or trace to someone else.

Remember how we concatenated multiple or multiline strings in Java? That’s really not easy to trace the code then. Take a look on this snippet 👇:

```diff
fun main() {
     displayInfo("John Doe", 10)
 }

 fun displayInfo(name: String, age: Int) {
-    val info = "Hi there!👋 My name is \"" + name + "\".\nI'm " + age + " years old."
+    val info = """
+        |Hi there!👋 My name is "$name".
+        |I'm $age years old.
+    """.trimMargin()

     println(info)
     // prints
     // "Hi there!👋 My name is John Doe.
     // I'm 10 years old."
 }
```

Did you notice simplicity 😃? In Kotlin, we easily handled a multi-line string using `"""`. We don’t even need to append `\n`.

String literals (let's say special characters like `\n`) aren’t processed in templates because you actually won’t need this thing. It’s completely considered as a **Raw string**.

There’s more a lot we can do with strings in Kotlin.

---

## ⭐️ Destructuring Declarations

Kotlin allows us to destructure an object into a number of variables. For example, see this 👇:

```diff
data class User(val id: Int, val name: String)

 fun main() {
-   val user = getUser()
-   val userId = user.id
-   val userName = user.name
+   val (userId, userName) = getUser()
 }

 fun getUser() = User(1, "John Doe")
```

It’s useful when we just want to access members of an instance directly. But wait, it’ll be dangerous ⚠️ if you change the order of members. Let’s say if you write code as 👇:

```kotlin
val (userName, userId) = getUsers()
```

Then you can see, a user ID will be assigned to `userName` and name will be assigned to `userId`. So handle it with care or just use it when you’re sure that the class **structure won’t change again**.

For example, Kotlin provides a class called [`Pair<A,B>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) which is a part of the standard library function. `Pair` has only two members i.e. `first` and `second`. So here we are sure that its structure won’t change then we can surely use destructing declarations there 👇:

```kotlin
fun main() {
    val (user, interests) = getUserInterest()
}

fun getUserInterest(): Pair<User, List<Interest>> {
    // Get user and interests
    return Pair(user, interests)
}
```

If you don't need any variable, you can achieve it like this 👇:

```kotlin
val (_, interests) = getUserInterest()
```

---

## ⭐️ Sealed Class

- As its name suggests, sealed classes represent restricted class hierarchies.
- In simple words, sealed classes are extended enums.
- A sealed class can have subclasses, but all of them must be declared in the same file as the sealed class itself.
- For example, see this 👇:

```kotlin
class Success(val result: Any)
class Failure(val message: String)

fun main() {
    val result = getResult()

    val something = when (result) {
        is Success -> {}
        is Failure -> {}
        else -> { /* Unnecessary part */ }
    }
}

fun getResult() = listOf(Success(""), Failure("Failed")).random()
```

Okay, In the first snippet we have two classes for `Result` i.e. `Success` and `Failure`. We are sure that `getResult()` will only return an instance of these two classes. Still, if you see `when {}` expression, we need to add `else {}` block unnecessarily because code is not sure about instance type of `val result`.

Now look at the second snippet, we declared these classes under `sealed class Result {}` and it simplified a lot. That’s very clear that Result can have only two types of instances i.e. `Success` or `Failure`.

We can also read members of instances, see this 👇:

```kotlin
sealed class ViewState {
    object Loading: ViewState()
    class Success(val someData: String): ViewState()
    class Failure(val message: String): ViewState()
}

fun main() {
    val message = when (getViewState()) {
        is ViewState.Loading -> "Data is loading"
        is ViewState.Success -> "Got data: ${state.someData}"
        is ViewState.Failure -> "It failed! ${state.message}"
    }

    println(message)
}

fun getViewState(): ViewState = listOf(ViewState.Loading, ViewState.Success("MyData"), ViewState.Failure("Error")).random()
```

As you can see above, we can actually access `someData` of `Success` and `message` of `Failure`. So this is how it works 😃. It’s a really perfect thing to replace with enums.

---

## ⭐️ Inner Class

How to access the value of outer class in nested classes? Let's say you want to access **this** scope of a class from nested class. Don’t worry, **inner class** in Kotlin is here to help you 😃.

- See this first 👇:

```kotlin
class Outer {
    val value = 10

    class Inner1 {
        fun accessOuter() = println("Outer value = $value") // ❌ Can't access value of Outer class.
    }

    inner class Inner2 {
        fun accessOuter() = println("Outer value = $value") // ✅ Can access value of Outer class.
    }
}

fun main() {
    Outer.Inner1().accessOuter()    // #1
    Outer().Inner2().accessOuter()  // #2
}
```

There’s an **Outer** class and it has two nested classes under it i.e. `Inner1` and `Inner2`. As you can see, `Inner1` can’t access ❌ the `value` of an outer class and `Inner2` which is declared using keyword `inner` can access it ✅.

> **Observe carefully:** In `main()`:
>
> 1. If you see **#1**, we can directly create instance of `Inner1` and access its member.
> 2. Now see **#2**, we can only create instance of `Inner2` using instance of `Outer` as it carries the reference to an object of an `Outer` class.

---

## ⭐️ Functional (SAM) Interface

- The functional interface should only have one abstract method i.e. _SAM (Single Abstract Method)._
- A functional interface can have **more than one non-abstract members** but they must have **exactly one abstract method**.
- Using functional interfaces, we can leverage SAM conversions that help make our code more concise and readable by using _lambda expressions_. See the example below, it’s self-explanatory 👇:

```kotlin
interface Predicate {
    fun isTrue(): Boolean
}

fun main() {
    val predicate = object: Predicate {
        override fun isTrue() = 10 == (5*2)
    }

    println(predicate.isTrue()) // prints "true"
}
```

As you can see, If we don’t use a SAM conversion, we need to write code using `object` expressions. By just adding `fun` keyword for the interface, we literally made code even more readable 😃. Isn’t it _sweet_? 🍫

---

## ⭐️ Lambda Expressions

- This is the spiciest feature of a Kotlin 🌶️.
- These are like anonymous functions and we can treat them as values.
- You can use lambda expressions if you want to create a function which doesn’t need to be an Interface (as we saw SAM conversions). For example, see this 👇. Here you don’t actually need to declare a `fun interface`.

```kotlin
fun main() {
    val add: (Int, Int) -> Int = {a, b -> a + b}

    val result = add(10, 20)
    println(result) // prints "30"
}
```

So here you can see, by using lambda we indirectly created functionality for addition. Now let’s take a look at HOFs in Kotlin which is another ♨️ hot topic.

---

## ⭐️ Higher-Order Functions

- A lambda is an anonymous function. It becomes a Higher-order function when that takes functions as parameters or returns a function.
- For instance, see this example 👇:

```kotlin
fun Button.onClick(action: () -> Unit) {
    action()
}

fun initUI() {
    button.onClick {
        // Do something
    }
}
```

Here, `onClick()` takes a function as a parameter which is executed when the button is clicked.

Do you remember scope functions from the previous part? Yep! `let {}`, `apply {}`, etc scope functions are HOFs of the standard library of Kotlin.

Now see this example 👇:

```kotlin
fun TextBuilder(builder: StringBuilder.() -> Unit): String {
    return StringBuilder().apply(builder).toString()
}

fun main() {
    val string = TextBuilder {
        append("Welcome To Kotlin World")
        append("\nEnjoy")
    }
    println(string)
}
```

Here we have created a HOF `TextBuilder` which has a parameter _builder_ which gives the reference of a `StringBuilder` in the lambda. That’s why we can call the properties of `StringBuilder` by using **this** scope.

The more you explore Lambas and HOFs, the more you’ll fall in Love ❤️ with the Kotlin.

---

## ⭐️ Delegates

- This beautiful language provides a way to use Delegated pattern in code 😍.
- Kotlin provides it natively requiring zero boilerplate.
- Take a look at this example:

```kotlin
interface Vehicle {
    fun drive()
}

class Bike(val speed: Double): Vehicle {
    override fun drive() = println("Driving Bike at $speed KMPH")
}

class Car(val speed: Double): Vehicle {
    override fun drive() = println("Driving Car at $speed KMPH")
}
```

Here the **by** clause in the supertype list for `SportsBike` and `SportsCar` indicates that `bike` and `car` will be stored internally in objects of these classes and the compiler will generate all the methods of `Vehicle` that forward to the delegated objects.

You can explore more about it [here](https://kotlinlang.org/docs/reference/delegation.html). Let’s see property delegations.

---

## ⭐️ Property Delegation

- We can apply delegations for properties or members.
- We don’t need to implement the same thing, again and again, using this.
- For example, Kotlin standard library has some property delegates like `lazy`, `observables`, etc. See this 👇:

```kotlin
val value by lazy {
    println("Assigning a value")
    10
}

fun main() {
    println(value) // prints "Assigning a value 10"
    println(value) // prints "10"
}
```

Here we have used `lazy` delegate where the value gets computed only upon first access. As you can see, when we accessed `value` in `println()` for the first time the message is displayed and next time it’s not.

Let’s see how to create our own delegations. See this example first 👇:

```diff
class OrderDetails {
-    var fullName: String = ""
-        set(value) {
-            field = value.split(" ").joinToString(" ") { it.capitalize() }
-        }
+    var fullName by CapitalizeDelegate()

-    var city: String = ""
-        set(value) {
-            field = value.split(" ").joinToString(" ") { it.capitalize() }
-        }
+    var city by CapitalizeDelegate()

-    var coupon: String = "NO COUPON"
-        set(value) {
-            field = value.toUpperCase()
-        }
+    var coupon by UppercaseDelegate()
}
```

In the first snippet, as you can see, we wrote a repetitive code for formatting fields but it simplified a lot after adding delegates. We override `setValue()` and `getValue()` operator functions of `ReadWriteProperty`. To learn more about delegates in Kotlin, refer [this](https://kotlinlang.org/docs/reference/delegated-properties.html).

---

## ⭐️ Ranges

- In Kotlin, we can easily compute range related tasks with much more readability.
- The operator `..` is used in the form of range. See examples below 👇:

```kotlin
fun main() {
    for (i in 0..10) { print(i) } // 012345678910

    for (i in 1 until 10) { print(i) } // 123456789 (10 is excluded)

    for (i in 9 downTo 0) { print(i) } // 9876543210

    for (i in 2..20 step 2) { print("$i ") } // 2 4 6 8 10 12 14 16 18 20

    if (50 in 0..100) println(true) else println(false) // true

    val list = listOf(1, 2, 3, 4, 5)
    if (3 in list) println("3 PRESENT") else println("3 ABSENT") // 3 PRESENT
    if (10 !in list) println("10 NOT PRESENT") else println("10 PRESENT") // 10 NOT PRESENT
}
```

As you can see, code is self-explanatory and it doesn’t need an explicit explanation. We can also add support for ranges for custom class types by overriding `rangeTo()` function.

---

## ⭐️ Collection Extensions

- The Kotlin standard library has a 💎 treasure of extension function for Collections 😍.
- With the help of these functions, can solve complex problems with simple solutions. It also makes code easy to trace, concise and readable. For example, see this code 👇:

[**Collection Models Extension - GitHub Gist**](https://gist.github.com/PatilShreyas/7c99a4b6e0e2ad8c7415de6b8a25e30e)

As you can see above, the code is self-explanatory using these cool extension functions. Can you just imagine how much code you’ll need to write for the same use case in any other programming language let say _Java_?

There’s many more we can do with these extensions. The more you explore it, you’ll find it interesting 👓.

---

## ⭐️ Coroutines

- The most and most **HOT** 🔥 topic in Kotlin is Coroutine 😍.
- It allows us to write asynchronous and non-blocking logic in a clean manner. It provides structured concurrency 🔀.

```kotlin
fun main() = runBlocking {
    launch {
        delay(100)
        println("Hello with delay 100")
    }
    launch {
        delay(10)
        println("Hello with delay 10")
    }
    launch {
        delay(1)
        println("Hello with delay 1")
    }

    println("Hello World!")
}
/* OUTPUT:
Hello World!
Hello with delay 1
Hello with delay 10
Hello with delay 100
*/
```

See this 👆, we launched three different jobs using `launch` with different delay and you can see its output.

We can also avoid traditional callbacks using Coroutines. Kotlin provides `suspend fun` for writing blocking calls.

```kotlin
fun main() {
    userRepository.findById(1, object: UserCallback {
        override fun onUserFound(user: User) {
            // Do something with `user`.
        }
    })
}

interface UserRepository {
    fun findById(id: Int, callback: UserCallback)
}
```

In the above example, you can see how code is simplified with the use of Coroutines.

Want to see again beauty of Coroutines? Let’s say you have to do two things concurrently, how to do that? Here `async` comes to help. See this 👇:

```kotlin
fun main() = runBlocking {
    val one = async { taskOne() }
    val two = async { taskTwo() }

    val result = one.await() + two.await() // 10 + 20
}

suspend fun taskOne(): Int {
    delay(100L)
    return 10
}

suspend fun taskTwo(): Int {
    delay(400L)
    return 20
}
```

Here you can see that two coroutines execute concurrently. `async` returns a `Deferred` i.e. a light-weight non-blocking future that represents a promise to provide a result later.

Coroutine library contains other APIs like `Flow` for implementing a reactive approach, `Channel` for communication and many others. Coroutines are one of the **HUGE** 🔶 topics in Kotlin. The more you explore it, the more you’ll find it interesting 😍. See [this reference](https://kotlinlang.org/docs/reference/coroutines/basics.html) for more information.

---

Yeah! 😍. By including all these ingredients together, that’s how we cooked tasty code with Kotlin 😋. I hope you liked this article.

If you liked this article, share it with everyone! 😄

**_"Sharing is caring!"_**

Thank you! 😃

---

> [!TIP]
> Many thanks to [Shalom Halbert](https://twitter.com/shalomhalbert) and [Rishit Dagli](https://www.rishit.tech/) for helping me to make this better :)
