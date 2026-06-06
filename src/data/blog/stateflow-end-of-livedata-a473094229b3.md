---
title: "🌊 StateFlow, End of LiveData?"
pubDatetime: 2020-05-22T15:49:15.659Z
description: "Is StateFlow the end of LiveData? An opinionated look at how Kotlin's StateFlow is replacing LiveData for state management in Android."
tags:
  - others
coverImage: "../../assets/images/cover-stateflow-end-of-livedata-a473094229b3.jpeg"
---

In this article, we’ll learn how to use Kotlin Coroutine `StateFlow` in Android instead of `LiveData`.

In the recent release of Kotlin coroutines library (1.3.6), you can see there a new class — `StateFlow`. So what’s this and how it works? Let’s see…

---

## What is `StateFlow`? 🤷‍♂️

_It’s basically a new primitive for state handling._ It’s designed to eventually replace [`ConflatedBroadcastChannel`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-conflated-broadcast-channel/index.html) for state publication scenarios.

_It is a **flow** that emits updates to its collectors._ Value can be observed by collecting values from the **flow** 🌊.

---

## Still not getting? Here’s a quick demo to understand —

See [this demo program](https://pl.kotl.in/LWtbOSMEZ?theme=darcula) and play with it.

I think now you get it what’s exactly — `StateFlow` 😃. So what’s happening here is whenever we’re updating the value of **stateFlow** then it emits value to its _collectors_.

To manage state in Android we generally used Android Arch. component’s [`LiveData`](https://developer.android.com/topic/libraries/architecture/livedata) which is lifecycle-aware. We can replace it with _StateFlow_. Let’s see how to use it with Android. Let’s write some code!

---

## ⚡️ Getting Started

Open _Android Studio_ and create a new project. Alternatively, you can simply clone [this repository](https://github.com/scalereal/StateFlow-Demo). This is a very simple _counter_ app for demonstrating the use of Kotlin Coroutine’s _StateFlow_ API.

We’ll be using `MainViewModel` to manage our data of `MainActivity`.

```kotlin
@ExperimentalCoroutinesApi
class MainViewModel : ViewModel() {
    private val _countState = MutableStateFlow(0)

    val countState: StateFlow<Int> = _countState

    fun incrementCount() {
        _countState.value++
    }

    fun decrementCount() {
        _countState.value--
    }
}
```

Now you can compare its implementation using _LiveData_.

_`MutableStateFlow` has a setter property for **value**._ We’ve declared an instance of `StateFlow` i.e. _countState_ which we’re exposing for activity (_It’s a read-only field_). `StateFlow` has a property called **value** by which you can be safely read at any time.

Now let’s implement our `MainActivity` —

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel by lazy {
        ViewModelProvider(this)[MainViewModel::class.java]
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        initCountObserver()
        initView()
    }
}
```

Here, we’ve initialized ViewModel for activity. Now let’s implement the `initView()` method which will initialize our Counter App UI.

```kotlin
private fun initView() {
        button_plus.setOnClickListener(::incrementCounter)
        button_minus.setOnClickListener(::decrementCounter)
    }

    private fun incrementCounter(view: View) {
        viewModel.incrementCount()
    }

    private fun decrementCounter(view: View) {
        viewModel.decrementCount()
    }
```

Everything looks cool now! 😃. Let’s observe for count value now to keep track of counting and show it on UI accordingly.

```kotlin
private fun initCountObserver() {
        lifecycleScope.launch {
            viewModel.countState.collect { value ->
                textview_count.text = "$value"
            }
        }
    }
```

Here’s we have collector which will be executed whenever the value of a _countState_ is updated. We also made it **lifecycle-aware** as we’ve used it under `lifecycleScope`. It looks simple, right? That’s it! 😎

Now let’s run this app and see if it’s working:

![Counter app demo](../../assets/images/content/stateflow-end-of-livedata-a473094229b3/img-0964a8c5.gif)

_Counter app demo_

Ain’t it Sweettttt 😍.

---

## We can implement the same using **LiveData** too. What’s different then? 🤷‍♂️

We can use powerful _flow_ operators with `StateFlow` like **_combine, zip, etc_** which can give us more great experience than _LiveData_. Yes, that’s it.

---

## Final Words

- `StateFlow` is really easy to handle and implement. Currently, it doesn’t support LiveData’s `onActive()` or `onInactive()` like callbacks but this will be possible once [`SharedFlow`](https://github.com/Kotlin/kotlinx.coroutines/issues/2034) is officially released 🚀.
- Its behaviour is the same as `LiveData` along with more operators and great performance 😎. Then we should consider using it instead of _LiveData_.

If you found this helpful please give some claps 👏 and share it with everyone.

_Sharing is Caring!_

Thank You :) 🙏

If you need any help, you can contact me [**here**](https://patilshreyas.dev).

---

## 📚 Resources

- [**StateFlow Demo - GitHub**](https://github.com/scalereal/StateFlow-Demo)
- [**StateFlow Documentation**](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/index.html)
