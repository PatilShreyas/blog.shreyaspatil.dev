---
title: "Composing composable in the Text line with InlineTextContent in Jetpack Compose"
pubDatetime: 2021-07-30T14:08:38.907Z
description: "TODO: Add a description"
tags:
- android-app-development
- android
- ui
- ui-design
- kotlin
coverImage: "../../assets/images/cover-composing-composable-in-the-text-line-with-inlinetextcontent-in-jetpack-compose.png"
---

👋Hey Composers (Android developers)😄, finally wait is over and Jetpack Compose 1.0.0 is here 🎉. In this article, we’ll see how to use _InlineTextContent_ to use composable in the text line in Jetpack Compose.

# ⚡Introduction ️

While developing Android applications, we sometimes may have a design-use-case that we need a design that aligns with the Text component. See below diagram 👇 (_Forgive me for my bad design and example_ 😬).


![image.png](../../assets/images/content/composing-composable-in-the-text-line-with-inlinetextcontent-in-jetpack-compose/img-bde13a38.png)

Here’s what I want to explain from this diagram:

1. Showing user presence _(online/offline)_ ahead of user’s name
2. Showing some shapes with text _(just for example)_
3. Adding a divider/separator between social links.

Let’s see then how to implement UI ***3***

---

# 💻Implementation

Okay. So we have to design a UI where we want to show three text items _i.e. LinkedIn / Twitter / Portfolio_ and have separator in between these items. We know we can build divider UI using [Box](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary#Box(androidx.compose.ui.Modifier)) with Shape as a clip. So let’s do that.

Basically, we can do these things by using _`Row`_, right? So what's an advantage here? So the advantage is the size of composable always remains with the size of text and we can control it. You'll see how we provide size to inline composable content in some time 👇.

Jetpack Compose comes with [foundation](https://developer.android.com/jetpack/androidx/releases/compose-foundation) group which provides ready to use building blocks and extend foundation to build your own design system pieces. `InlineTextContent` is part of foundation group. Let’s directly see code and step-by-step understand what is what and why!

Let’s first create a Composable function with basic setup of showing text.

<script src="https://gist.github.com/PatilShreyas/7fd0d97e3a90906bd89dcd773ed3fb38.js"></script>

Basically we use `AnnotatedString` to set different styles within the same `Text` composable and for this we use `buildAnnotatedString{}` lambda function which provides a `Builder` so that we can _append_ or _add styles_ to text.

`appendInlineContent()` of a _Builder_ is used to insert composables into the text layout and by using this, we are going to add divider _(Composable Shape)_ in between the text items. Let’s see usage 👇

<script src="https://gist.github.com/PatilShreyas/2a0bcbed73a7e2c8176b7751184097c7.js"></script>

`appendInlineContent()` requires `id` as a first parameter which is referred by [`BasicText`](https://developer.android.com/reference/kotlin/androidx/compose/foundation/text/package-summary#BasicText(androidx.compose.ui.text.AnnotatedString,androidx.compose.ui.Modifier,androidx.compose.ui.text.TextStyle,kotlin.Function1,androidx.compose.ui.text.style.TextOverflow,kotlin.Boolean,kotlin.Int,kotlin.collections.Map)) to replace the corresponding composable at runtime _(we’ll see this)._ The second parameter is `alternateText` is actually appended to the `AnnotatedString` and marks the range of text to be replaced by inline content and is also used to describe the inline content by accessibility feature.

We can have multiple types of inline composables inside AnnotatedString and every composable is uniquely identified by its specified `id`. Just like here, we want to show only one type of composable i.e. Divider. So we have just repeated it twice and we have created common id `inlineDividerId`.

Now let’s proceed 👉

<script src="https://gist.github.com/PatilShreyas/a0780bcb1f949201d2398001c5cb8513.js"></script>

Here we’ve created Map of `String` i.e. _id_ and `InlineTextContent`. As discussed earlier, we can have multiple pairs of id and inline content. `PlaceHolder` is required to `InlineTextContent` which takes _width, height_ and _vertical alignment_ for inline content. The value specified to width and height defines the size of the composable in the text line and is always proportional to the size of a _Text_. Now insider the content, we have specified `Box` layout with _Rectangular_ shape having _color_ and some _rotation_.

Finally, we have used `BasicText` and provided **AnnotatedString**i.e. `text` which we created earlier and**Map of Inline Content** .

Yes, that’s all needed! 😃 Now just run the app and see magic ✨.


![image.png](../../assets/images/content/composing-composable-in-the-text-line-with-inlinetextcontent-in-jetpack-compose/img-2400b83b.png)

---

[Refer to this gist](https://gist.github.com/PatilShreyas/eb81fa1e47c66cf4fb7596d289e68ba9) for full code snippet and happy Composing 🙌

I hope you liked the article and found it helpful. Thank you! 😃

> _“Sharing is caring”_

---

# 📚 References:

- [https://developer.android.com/jetpack/compose/text](https://developer.android.com/jetpack/compose/text)
- [https://developer.android.com/reference/kotlin/androidx/compose/foundation/text/InlineTextContent](https://developer.android.com/reference/kotlin/androidx/compose/foundation/text/InlineTextContent)
- <script src="https://gist.github.com/PatilShreyas/eb81fa1e47c66cf4fb7596d289e68ba9.js"></script>