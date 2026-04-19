---
title: "🤖 Automate Publishing Android Library to Bintray using GitHub Actions 🚀"
pubDatetime: 2020-05-01T08:47:20.059Z
description: "TODO: Add a description"
tags:
- others
coverImage: "../../assets/images/cover-automate-publishing-android-library-to-bintray-using-github-actions-9b8ad8ab2698.jpeg"
---

In this article, I’m going to demonstrate the use of GitHub Actions to publish open-source Android Library to Bintray when it is released.

You might have developed a cool open-source android library 🛠️. You have published it to Bintray/JCenter. Right? But you’re publishing it manually using Gradle CLI `./gradlew bintrayUpload` command. After you made changes in your library, you always run Gradle command manually. Want to see how you can automate publishing it using **GitHub Actions CI**? Then you are at the right place.

We will see how to publish your open-source cool android library to Bintray automatically when we create a new **release** in GitHub repository. So, let’s start 😃.

Before starting, you’ll need to do some tasks with Bintray profile. If you’ve already done, you can skip this part and directly go to the next part ⚡.

***

## 💻 Setup Bintray 🛠️

*   Visit [Bintray](https://bintray.com) and set up your account there.
*   Go to **Home** → **Repository** and create a **maven** repository and keep its name of your choice. I’ve named it 'maven'. (*Remember, it’ll be useful in upcoming steps.*)
*   After this, it’ll look like below. Click **Edit**.

![](../../assets/images/content/automate-publishing-android-library-to-bintray-using-github-actions-9b8ad8ab2698/img-d0bbe64a.png)

*   Select **API Key** from the left menu and **Copy or Keep** this API Key for future reference.

![](../../assets/images/content/automate-publishing-android-library-to-bintray-using-github-actions-9b8ad8ab2698/img-fd0a238f.png)

Thus, you’re done with Bintray set up. Now let’s see the **Android** part.

***

## 💻 Android Library Set up

In `build.gradle` of your project module, ensure that you’ve below plugins added:

<script src="https://gist.github.com/PatilShreyas/fc9997c4fe63c15c3ef2af99cbd69dda.js"></script>

Add these plugins in the `build.gradle` file of the library module:

```groovy
apply plugin: 'com.android.library'
apply plugin: 'kotlin-android'
apply plugin: 'com.github.dcendents.android-maven'
apply plugin: 'com.jfrog.bintray'
```

Now, we’ve to set up library configuration 🛠 for the Bintray in this file. Just append `build.gradle` file of library module with the code as below:

<script src="https://gist.github.com/PatilShreyas/402d03bbe004df7f75154a160db4ebc2.js"></script>

About these variables:

*   `bintrayRepo` — Name of the repository you’ve created in previous steps.
*   `bintrayName` — Name which will be visible on **Bintray**.
*   Change the values of other fields of your choice.

> **Note:** Notice that we’re reading **Bintray User** and **Bintray API Key** from the system environment variable using `System.getenv()` method. This will be significant in the GitHub Actions Workflow setup.

Now, you’ve done this part and now push your code to the GitHub repo for next step.

***

## 💻 Setting up on GitHub

Go to **Settings** → Click **Add new Secret**. You’ve to add two secret values for this repo: `BINTRAY_USER` and `BINTRAY_API_KEY`.

*   `BINTRAY_USER` — Your Bintray Username
*   `BINTRAY_API_KEY` — Your Bintray API Key (Which you’ve copied in the previous step).

After adding these secrets, it should look as below 👇:

![GitHub Repository Secrets](../../assets/images/content/automate-publishing-android-library-to-bintray-using-github-actions-9b8ad8ab2698/img-a37493cf.png)

***

## 💻 Setting up GitHub Actions Workflow

Now just create a workflow file named `publish.yml` which will be responsible to publish your library automatically on every release.

Just create a `.github` directory at the root of GitHub repository. Under it, create `workflows` directory and put the below file in this. So the path would be `.github/workflows/publish.yml`. Or simply, you can directly create the workflow by clicking the **Actions** tab and then create Workflow from available templates.

<script src="https://gist.github.com/PatilShreyas/94e69e999f565e726945b5238a354a81.js"></script>

> **Note:** Notice that we’ve exposed system environment variable `bintrayUser` and `bintrayApiKey` which values we’re getting from GitHub **secrets**. Remember that we’re reading these values in `build.gradle` using `System.getenv()` method.

Finally, it’s running a command `./gradlew bintrayUpload` which will publish your library to the Bintray!

***

## Test it! 😃

Now let’s test if it is working or not.

Go to **Releases** of your repository and click **Create new Release** and create release as below and click **Publish Release** 👇:

![](../../assets/images/content/automate-publishing-android-library-to-bintray-using-github-actions-9b8ad8ab2698/img-c42de96c.png)

After you click **Publish release**, that workflow we created earlier will be triggered and it will start its execution.

Now just navigate to **Actions** tab of your GitHub repo and notice that your Action is running. Finally, after execution is done, you’ll see the result as below! 👇:

![](../../assets/images/content/automate-publishing-android-library-to-bintray-using-github-actions-9b8ad8ab2698/img-b99801bc.png)

Yeah 😍!!! Your cool open-source Android library is just successfully published in Bintray JFrog repository. Let’s verify it. 😃

Go to your **Bintray** account and open **Maven** repository you created earlier and see your library is listed there. Now, officially your library is published and it can be imported in Android projects. 👇:

![Bintray Repositories](../../assets/images/content/automate-publishing-android-library-to-bintray-using-github-actions-9b8ad8ab2698/img-1b57d18e.png)

![Your package details on Bintray](../../assets/images/content/automate-publishing-android-library-to-bintray-using-github-actions-9b8ad8ab2698/img-3ae75c6d.png)

This is how we automated publishing your cool open-source android library to Bintray using GitHub Actions.

> In the future, you will not need to manage it manually 😎. You just make changes in the library and create Release on GitHub and a new version of the library will be automatically published to the Bintray and it’ll be live in a few seconds 🚀.

> **Yeah 😍!** Hope you liked that. If you find it helpful please share this article. Maybe it’ll help someone needy!

> **Thank you 😄!**

***

**Sharing is Caring!**

***

## 📚 Resources

Here is a repository that contains the code used in this article:

[**PatilShreyas/AndroidLibDemo - GitHub**](https://github.com/PatilShreyas/AndroidLibDemo)

If you want to contact me, feel free to reach me…

[**shreyaspatil.dev**](https://shreyaspatil.dev)

*   [**Facebook**](https://www.facebook.com/shreyaspatil99)
*   [**X (Twitter)**](https://twitter.com/imShreyasPatil)
*   [**LinkedIn**](https://www.linkedin.com/in/patil-shreyas)
*   [**GitHub**](https://github.com/PatilShreyas)