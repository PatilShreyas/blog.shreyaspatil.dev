---
title: "Leveraging the Snapshot Mutation Policies of Jetpack Compose"
pubDatetime: 2023-01-30T13:30:39.144Z
description: "Understand Snapshot Mutation Policies in Jetpack Compose. Learn how to control when and how your UI recomposes based on state changes."
tags:
  - android-app-development
  - android
  - kotlin
  - state-management
  - jetpack-compose
coverImage: "../../assets/images/cover-leveraging-the-snapshot-mutation-policies-of-jetpack-compose.jpeg"
---

Hey Composers 👋🏻, The heart 💚 of Jetpack Compose is a **State** that tells compose when to recompose UI. In the state management with compose, we can specify policies by which we can tell compose when exactly to recompose and it's a **_Snapshot Mutation Policy_** in compose. Let's see it in detail.

---

## 🕵🏻 Preface

While developing apps with Jetpack Compose, we often have used the function [mutableStateOf](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#mutableStateOf(kotlin.Any,androidx.compose.runtime.SnapshotMutationPolicy)>) as follows:

```kotlin
fun Something() {
    var value by remember { mutableStateOf("Initial Value") }
}
```

Let's take a look at the signature of the function [`mutableStateOf`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#mutableStateOf(kotlin.Any,androidx.compose.runtime.SnapshotMutationPolicy)>):

```kotlin
fun <T : Any?> mutableStateOf(
    value: T,
    policy: SnapshotMutationPolicy<T> = structuralEqualityPolicy()
): MutableState<T>
```

Did you observe **that second parameter**? 🤔. Yes, of type `SnapshotMutationPolicy`. We are going to explore that only.

---

## 🤷🏻‍♂️ What is `SnapshotMutationPolicy`?

According to the docs:

> **_SnapshotMutationPolicy_** is a policy to control how the result of [`mutableStateOf`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#mutableStateOf(kotlin.Any,androidx.compose.runtime.SnapshotMutationPolicy)>) report and merge changes to the state object.

In short, with this policy, we can tell compose when to consider a state as changed which then results in the recomposition. This policy can be passed as a parameter to `mutableStateOf` and `compositionLocalOf`.

A custom mutation policy can be created by implementing this interface. Here's the interface definition 👇🏻:

```kotlin
interface SnapshotMutationPolicy<T> {
    /**
     * Determine if setting a state value's are equivalent and should be
     * treated as equal. If [equivalent] returns `true` the new value is not
     * considered a change.
     */
    fun equivalent(a: T, b: T): Boolean

    /**
     * Merge conflicting changes in snapshots. This is only called if
     * [current] and [applied] are not [equivalent]. If a valid merged value
     * can be calculated then it should be returned.
     */
    fun merge(previous: T, current: T, applied: T): T? = null
}
```

Also, did you observe that by default `structuralEqualityPolicy()` is specified as a policy whenever we use **_mutableStateOf()_**. What is it? Let's see.

---

## 📦 Pre-defined policies in Standard Compose library

Compose standard library comes with pre-defined snapshot mutation policies:

### 1. [`structuralEqualityPolicy`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#structuralEqualityPolicy()>)

This policy treats values of a `State` as equivalent if they are structurally (`==`) equal.

Setting [`MutableState.value`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/MutableState#value()>) to its current structurally (`==`) equal value is not considered a change. That is a reason why Google recommends using **data class** whenever a state model is created because **data class** implements method `equals()` under the hood which then ultimately helps this mutation policy to work well.

This is how `StructuralEqualityPolicy` is implemented:

```kotlin
private object StructuralEqualityPolicy : SnapshotMutationPolicy<Any?> {
    override fun equivalent(a: Any?, b: Any?) = a == b
}
```

### 2. [`referentialEqualityPolicy`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#referentialEqualityPolicy()>)

This policy treats the values of a `State` as equivalent, if they are referentially (`===`) equal.

Setting [`MutableState.value`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/MutableState#value()>) to its current referentially (`===`) equal value is not considered a change. So whenever we need to handle state recomposition in compose based on **_referential equality_** then use this policy.

This is how `ReferentialEqualityPolicy` is implemented:

```kotlin
private object ReferentialEqualityPolicy : SnapshotMutationPolicy<Any?> {
    override fun equivalent(a: Any?, b: Any?) = a === b
}
```

### 3. [`neverEqualPolicy`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#neverEqualPolicy()>)

This policy never treats the values of a `State` as equivalent. If this policy is used, then every time `MutableState.value` is updated, it's considered as a change.

This is how `NeverEqualPolicy` is implemented:

```kotlin
private object NeverEqualPolicy : SnapshotMutationPolicy<Any?> {
    override fun equivalent(a: Any?, b: Any?) = false
}
```

---

## 🪄 Example

Let's understand it with a very basic example.

_This example is not based on something real practical use case but it's just for understanding._

Have a look at the composable function 👇🏻:

```kotlin
data class MyState(val state: String, val fieldToSkip: String)

@Composable
fun MyDemo() {
    var myState by remember {
        mutableStateOf(
            value = MyState(
                state = "Initial value",
                fieldToSkip = "Some value"
            )
        )
    }
    println("MyState = $myState")

    LaunchedEffect(Unit) {
        myState = myState.copy(state = "New Value")
        delay(100)
        myState = myState.copy(fieldToSkip = "Value 2")
    }
}
```

In this, we have a state model: `MyState` which has two state properties i.e. `state` and `fieldToSkip`. In composition, whenever the fields are updated, the recomposition will occur.

▶️ **So if we run the above code, the output will be like this:**

```kotlin
MyState = MyState(state=Initial value, fieldToSkip=Some value)
MyState = MyState(state=New Value, fieldToSkip=Some value)
MyState = MyState(state=New Value, fieldToSkip=Value 2)
```

If we want to avoid recomposition whenever `fieldToSkip` is changed then we'll have to define our own policy for this use case. So let's create it:

```kotlin
object MyStatePolicy : SnapshotMutationPolicy<MyState> {
    override fun equivalent(a: MyState, b: MyState): Boolean {
        return a.state == b.state
    }
}
```

As you can see, in the policy, we are only calculating equality based on the `state` parameter and not considering `fieldToSkip` in it. So let's change the compose's implementation to respect our policy:

```diff
 var myState by remember {
     mutableStateOf(
         value = MyState(
             state = "Initial value",
             fieldToSkip = "Some value"
-        )
+        ),
+        policy = MyStatePolicy
     )
 }
```

After this change, if we ▶️ run the same code again, the output would be different:

```txt
MyState = MyState(state=Initial value, fieldToSkip=Some value)
MyState = MyState(state=New Value, fieldToSkip=Some value)
```

Now you can see that whenever `fieldToSkip` is updated, recomposition is not occurring and thus we controlled unnecessary recompositions for our use case.

---

Thus, `SnapshotMutationPolicy` can be helpful if used properly for the need of use cases and solving the conflicts which can occur while mutating values from snapshots. This can be useful to avoid unnecessary recompositions caused due to unused fields' value updates and can help improve the performance a bit.

Hope you find this blog helpful 😀.

**_"Sharing is Caring"_**

Thank you! 😄

---

## 📚 References

[https://developer.android.com/reference/kotlin/androidx/compose/runtime/SnapshotMutationPolicy](https://developer.android.com/reference/kotlin/androidx/compose/runtime/SnapshotMutationPolicy)
