---
title: "Providing AssistedInject supported ViewModel for Composable using Hilt"
pubDatetime: 2021-06-29T14:52:48.200Z
description: "Learn how to provide Hilt ViewModels with AssistedInject to Jetpack Compose Composables for dynamic dependency injection with runtime parameters."
tags:
  - java
  - android
  - kotlin
  - dependency-injection
  - learn-coding
coverImage: "../../assets/images/cover-providing-assistedinject-supported-viewmodel-for-composable-using-hilt.jpeg"
---

Hey Androiders 👋, The hilt has reached stability and getting plenty of attention from the developers due to its simplicity and the feature it provides out of the box. After all, it’s a wrapper over Dagger which provides an easy interface for developers to focus more on the app development instead of DI bindings development 😄.

In this article, we’ll be seeing how you can obtain the instance of [**ViewModel**](https://developer.android.com/reference/android/arch/lifecycle/ViewModel) for usage in [**Composable**](https://developer.android.com/reference/kotlin/androidx/compose/runtime/Composable) screen which is supported by [**AssistedInject**](https://dagger.dev/dev-guide/assisted-injection.html). Let’s keep this article sweet and simple and let’s jump on to the main topic.

---

## 👀 Understand

This is how our ViewModel looks like:

```kotlin
class NoteDetailViewModel @AssistedInject constructor(
    @Assisted private val noteId: String,
    private val notyTaskManager: NotyTaskManager,
    private val noteRepository: NotyNoteRepository
) : ViewModel() {

    // Other ViewModel's implementation...

    @AssistedFactory
    interface Factory {
        fun create(noteId: String): NoteDetailViewModel
    }

    @Suppress("UNCHECKED_CAST")
    companion object {
        fun provideFactory(
            assistedFactory: Factory,
            noteId: String
        ): ViewModelProvider.Factory = object : ViewModelProvider.Factory {
            override fun <T : ViewModel?> create(modelClass: Class<T>): T {
                return assistedFactory.create(noteId) as T
            }
        }
    }
}

@Module
@InstallIn(ActivityRetainedComponent::class)
interface AssistedInjectModule
```

**For those who might be new to hear about AssistedInject:** The AssistedInject is a DI pattern that is used to construct an instance where some parameters can be provided at the runtime (_or the time of creation_).

For example, as you can see in the above snippet, the field `noteId` of a _constructor_ can be only provided at runtime (a.k.a _Assisted_). We have created `Factory` having fun `create()` which will take `noteId` as a parameter and will be responsible for returning `NoteDetailViewModel`. Then we have created a factory provider method `provideFactory()` which is providing `ViewModelProvider.Factory` and we implemented it to create an instance of our ViewModel. Also, we have installed it for `ActivityRetainedComponent` i.e. component that has the lifetime of a configuration surviving Activity.

If it’s implemented for Fragment/Activity, it’s so simple as the following:

```kotlin
@AndroidEntryPoint
class NoteDetailFragment: Fragment() {

    @Inject
    lateinit var viewModelAssistedFactory: NoteDetailViewModel.Factory

    override val viewModel: NoteDetailViewModel by viewModels {
        NoteDetailViewModel.provideFactory(viewModelAssistedFactory, "NOTE_ID_HERE")
    }
}
```

But in Jetpack Compose it’s different. We use nested `@Composable` functions and use the Navigation component for handling screens and Hilt’s `hiltNavGraphViewModel()` to obtain simple injected ViewModel instances.

```kotlin
@Composable
fun NotyNavigation(toggleTheme: () -> Unit) {
    val navController = rememberNavController()

    NavHost(navController, startDestination = Screen.Notes.route, route = NOTY_NAV_HOST_ROUTE) {
        composable(Screen.AddNote.route) {
            AddNoteScreen(navController, hiltNavGraphViewModel())
        }
        composable(Screen.Notes.route) {
            NotesScreen(toggleTheme, navController, hiltNavGraphViewModel())
        }
        composable(
            Screen.NotesDetail.route,
            arguments = listOf(
                navArgument(Screen.NotesDetail.ARG_NOTE_ID) { type = NavType.StringType }
            )
        ) {
            val noteId = it.arguments?.getString(Screen.NotesDetail.ARG_NOTE_ID)
            // We'll see how do create ViewModel using `noteId`
        }
    }
}
```

Let’s see how can we support Composable.

---

## 💡 Solution

In the main Activity of our project, we’ll need to declare _EntryPoint_ interface (to be installed for `ActivityComponent`) which will provide `Factory` for creating `NoteDetailViewModel`.

```kotlin
@AndroidEntryPoint
class MainActivity : AppCompatActivity() {

    @EntryPoint
    @InstallIn(ActivityComponent::class)
    interface ViewModelFactoryProvider {
        fun noteDetailViewModelFactory(): NoteDetailViewModel.Factory
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            NotyTheme {
                NotyNavigation()
            }
        }
    }
}
```

### What is EntryPoint?

An entry point is a boundary from which you can get Dagger-provided instances from code that cannot use Dagger to inject its dependencies. It is the point where code first enters into the graph of objects managed by Dagger.

You will need an entry point when interfacing with non-Dagger libraries or Android components that are not yet supported in Hilt and need to get access to Dagger instances. For e.g. _AssistedInject_ with _ViewModels_ is not yet supported by Hilt. Know more about EntryPoint [here](https://dagger.dev/hilt/entry-points.html).

Now the question is how to get EntryPoint and factory from it? Let’s see.

```kotlin
@Composable
fun noteDetailViewModel(noteId: String): NoteDetailViewModel {
    val factory = EntryPointAccessors.fromActivity(
        LocalContext.current as Activity,
        MainActivity.ViewModelFactoryProvider::class.java
    ).noteDetailViewModelFactory()

    return viewModel(factory = NoteDetailViewModel.provideFactory(factory, noteId))
}
```

[EntryPointAccessors](https://dagger.dev/api/latest/dagger/hilt/android/EntryPointAccessors.html) provided static utility methods for handling entry-points for standard Android components. As you can see above, we have used method `fromActivity()` which returns EntryPoint interface from Activity. Similar methods available like `fromFragment()`, `fromApplication()`, `fromView()`. Once we get Factory, we are instantiating our ViewModel with that Factory and assisted `noteId`.

Awesome! 😍 Now it’s simple to use it, right 😄? Now just go to your navigation components and use this method to provide ViewModel to your `@Composable` screen as following:

```kotlin
NavHost(navController, startDestination = Screen.Notes.route, route = NOTY_NAV_HOST_ROUTE) {
    composable(
        Screen.NotesDetail.route,
        arguments = listOf(navArgument(Screen.NotesDetail.ARG_NOTE_ID) { type = NavType.StringType })
    ) {
        val noteId = it.arguments?.getString(Screen.NotesDetail.ARG_NOTE_ID)!!
        NoteDetailsScreen(navController, noteDetailViewModel(noteId))
    }
}
```

You can find the source code for the same implementation from the below references section.

That’s it! I hope you liked the article and found it helpful.

Thank you! 😃

---

## 📚 References

- [**NotyKT Android source code**](https://github.com/PatilShreyas/NotyKT/tree/master/noty-android)
- [Dagger Hilt Documentation](https://dagger.dev/hilt)

---

_Many thanks to [Himanshu Singh](https://himanshoe.com) for reviewing this article and making it better for you._
