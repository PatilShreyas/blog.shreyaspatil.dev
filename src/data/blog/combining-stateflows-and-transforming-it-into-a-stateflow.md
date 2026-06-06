---
title: "Combining StateFlows and transforming it into a StateFlow"
pubDatetime: 2022-06-24T12:30:00.989Z
description: "Master the art of combining multiple StateFlows into a single transformed StateFlow. Explore utilities and best practices for managing complex states in Kotlin."
tags:
  - multithreading
  - android
  - kotlin
  - coroutines
  - stateflow
coverImage: "../../assets/images/cover-combining-stateflows-and-transforming-it-into-a-stateflow.png"
---

Hey Kotliners👋,

In this blog, we are gonna do the experiment with the very 🔥hot [`StateFlow`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/) as the title of this blog suggests, we have to build a utility which can help us combining multiple `StateFlow`s into another transformed StateFlow. Before diving into it, let's understand why we need it.

## How it's used currently? 🤷

Coroutine's `StateFlow` is really a useful API for handling stateful business in any application (_let's say in Android_) which is a pretty simple yet powerful stream. Let's discuss some common usage.

### Example 1 - UI State management

When the state of UI is represented as a single model class having immutable state members by inspired from very popular state management library i.e. Redux, this is how we achieve it with StateFlow currently 👇.

```kotlin
// A state model for Login screen
data class LoginState(
  val isLoading: Boolean = false,
  val loggedInUser: User? = null
  val error: String? = null
)

class LoginViewModel(...) : ViewModel() {
  // Individual state flows
  private val isLoading = MutableStateFlow(false)
  private val loggedInUser = MutableStateFlow<User?>(null)
  private val error = MutableStateFlow<String?>(null)

  // Combining these states to form a LoginState
  val state: StateFlow<LoginState> = combine(isLoading, loggedInUser, error) { loading, user, errorMessage ->
    LoginState(loading, user, errorMessage)
  }.stateIn(viewModelScope, WhileObserved(), initialValue = LoginState())
}
```

Here, `LoginState` is a state model for the Login screen which has all immutable fields. In the ViewModel, three individual **mutable states** are created and they're combined to form an **immutable `LoginState`**. At the end, that stream is converted to `StateFlow<LoginState>` with using `stateIn()`. That's how we do it, right?

### Example 2 - Deriving Flow from multiple StateFlows

So assume we're building a library and exposing some API class that returns a `StateFlow` which is gonna look like this 👇.

```kotlin
data class PreferenceState(...)

data class MultiplePreferenceState(val preferences: List<PreferenceState>)

class Preferences {
    fun getPreferenceState(key: String): StateFlow<PreferenceState>  { ... }

    // Note: Return type becomes Flow<> and not StateFlow<>
    fun getMultiplePreferenceState(keys: List<String>): Flow<MultiplePreferenceState> {
        val prefStateFlows = keys.map { getPreferenceState(it) }.toTypedArray()

        return combine(*prefStateFlows) { prefStates: Array<PreferenceState> ->
            MultiplePreferenceState(prefStates.toList())
        }
    }
}
```

Here, `getPreferenceState()` returns StateFlow of `PreferenceState` and just notice the second function `getMultiplePreferenceState()` which is just deriving a flow from multiple StateFlows, we'll discuss about it later.

---

## What's the problem? 🤔

Let's understand problems/flaws in the above two examples

### Problem in Example 1

In Example 1, three flows were combined and all of these flows were of type `StateFlow`. Still, transformed flow becomes of type `Flow` because `combine()` returns `Flow<LoginState>` there. So `stateIn()` is used to again make it of type `StateFlow<LoginState>`. Also, the initial size is calculated twice in the example. First time when declaring individual mutable states and a second time while providing the initial state to `stateIn()` method.

### Problem in Example 2

In the Example 2, the method `getPreferenceState()` is fine which is returning `StateFlow<PreferenceState>`. But the second method `getMultiplePreferenceState()` is not returning StateFlow, instead it's returning `Flow`. Now, if we try to convert it into StateFlow, this is what the change will look like 👇

```diff
// To be able to convert Flow into StateFlow using `stateIn()`, we need CoroutineScope
- fun getMultiplePreferenceState(keys: List<String>): Flow<MultiplePreferenceState> {
+ fun getMultiplePreferenceState(scope: CoroutineScope, keys: List<String>): StateFlow<MultiplePreferenceState> {
     val prefStateFlows = keys.map { getPreferenceState(it) }.toTypedArray()
+    val initialValue = MultiplePreferenceState(prefStateFlows.map { it.value })

     return combine(*prefStateFlows) { prefStates: Array<PreferenceState> ->
         MultiplePreferenceState(prefStates.toList())
+    }.stateIn(scope, Eagerly, initialValue)
  }
```

To convert combined flow into a StateFlow, `stateIn()` is used which needs a `CoroutineScope`. Thus, it ultimately restricts to ask for consumer's scope here (_which we don't want some time in some use cases. Example, we don't want to control when to start collecting flow, scope it to a specific scope, etc._). Also, the initial state needs to calculate separately. That's the problem.

In both examples, what we want is:

> **_If all the flows which are being combined are StateFlows then derived/transformed Flow should also be StateFlow._**

Now, let's find out the solution for this.

---

## Solution 💡

On GitHub, [issue](https://github.com/Kotlin/kotlinx.coroutines/issues/2631) is already open for this particular use case. Till an official solution is available, let's try to build our own solution. This solution is gonna be mixed learnings from the discussions that happened there.

To be able to combine multiple state flows into a derived state flow, we need to have our own implementation of `StateFlow` which fulfills our needs. So the solution looks like this 👇.

```kotlin
private class TransformedStateFlow<T>(
    private val getValue: () -> T,
    private val flow: Flow<T>
) : StateFlow<T> {

    override val replayCache: List<T> get() = listOf(value)
    override val value: T get() = getValue()

    override suspend fun collect(collector: FlowCollector<T>): Nothing =
        coroutineScope { flow.stateIn(this).collect(collector) }
}

/**
 * Returns [StateFlow] from [flow] having initial value from calculation of [getValue]
 */
fun <T> stateFlow(
    getValue: () -> T,
    flow: Flow<T>
): StateFlow<T> = TransformedStateFlow(getValue, flow)

/**
 * Combines all [stateFlows] and transforms them into another [StateFlow] with [transform]
 */
inline fun <reified T, R> combineStates(
    vararg stateFlows: StateFlow<T>,
    crossinline transform: (Array<T>) -> R
): StateFlow<R> = stateFlow(
    getValue = { transform(stateFlows.map { it.value }.toTypedArray()) },
    flow = combine(*stateFlows) { transform(it) }
)
```

Let's understand this:

- The class `TransformedStateFlow` has two properties, the first one is `getValue` which is a lambda returning value that is provided to overriden member `value`. This means whenever `.value` is accessed on StateFlow instance, `getValue` lambda will be called and the value will be returned from the calculation result.
- The second parameter, `flow` is used in the collector i.e. whenever `TransformedStateFlow` is collected, the `flow`'s collector is delegated to it.
- StateFlow's `collect()` method need return type as `Nothing`. That's why we need to provide a collector of StateFlow itself. So `stateIn()` is used with the consumer's CoroutineScope which transforms Flow into StateFlow and then it starts collecting.
- Even if `stateIn()` used here is suspending function, we know that it'll be not a blocking function because the initial state will be available instantly.
- Then `combineStates()` function uses it to transform StateFlows into a StateFlow.

This is a core variant of `combineStates()` method and multiple variants of combineStates() can be added as per the need and number of parameters required.

Let's say in the above Example 1, we need to combine three flows so _type safe function for combining three StateFlows would look like_ 👇.

```kotlin
/**
 * Variant of [combineStates] for combining 3 state flows
 */
inline fun <reified T1, reified T2, reified T3, R> combineStates(
    flow1: StateFlow<T1>,
    flow2: StateFlow<T2>,
    flow3: StateFlow<T3>,
    crossinline transform: (T1, T2, T3) -> R
) = combineStates(flow1, flow2, flow3) { (t1, t2, t3) ->
    transform(
        t1 as T1,
        t2 as T2,
        t3 as T3
    )
}
```

Cool, let's revisit previous examples and revamp them with this solution.

Example 1's implementation will look like this after using this utility

```kotlin
private val isLoading = MutableStateFlow(false)
private val loggedInUser = MutableStateFlow<User?>(null)
private val error = MutableStateFlow<String?>(null)

// Combining these states to form a LoginState
val state: StateFlow<LoginState> = combineStates(
  isLoading,
  loggedInUser,
  error
) { loading, user, errorMessage ->
  LoginState(loading, user, errorMessage)
}
```

Looks nice, right? Let's see how well this fits with Example 2 👇.

```kotlin
class Preferences {
    fun getPreferenceState(key: String): StateFlow<PreferenceState>  { ... }

    fun getMultiplePreferenceState(keys: List<String>): StateFlow<MultiplePreferenceState> {
        val prefStateFlows = keys.map { getPreferenceState(it) }.toTypedArray()

        return combineStates(*prefStateFlows) { prefStates: Array<PreferenceState> ->
            MultiplePreferenceState(prefStates.toList())
        }
    }
}
```

Yeah! That's it 😎. Now it looks good and perfectly solves our problems. Similarly, we can also use this approach for other operations like mapping a StateFlow into another StateFlow.

## Problems with this solution? 🤨

So after all this, there are some problems with this solution due to which it can not fit in some use cases.

- Every time `.value` is accessed, the value from all StateFlows is calculated which won't be good if heavy computation is happening while calculation.
- Since `transform` is not suspending lambda, suspending tasks can't be done there which was possible in `combine` method. We can't add support for suspending transformation because we also need to know the transformed value from `getValue` lambda.

If your use case is NOT affected by these mentioned issues, you can definitely use this approach for combining StateFlows and deriving another StateFlow from it.

---

_If you have any feedback on this approach, I've also suggested this approach in the [GitHub issue](https://github.com/Kotlin/kotlinx.coroutines/issues/2631#issuecomment-1162673773)._

---

That's all, I hope you found this helpful 😉.

"Sharing is caring"

Thank you! 😀

---

## 📚 Resources

- [Kotlinx.coroutines Issue - GitHub](https://github.com/Kotlin/kotlinx.coroutines/issues/2631)
- [StateFlow - Kotlin Flow API](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/)
