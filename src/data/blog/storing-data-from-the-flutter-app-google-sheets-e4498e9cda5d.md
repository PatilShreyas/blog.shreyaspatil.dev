---
title: "Storing data from the Flutter app → Google Sheets 📊 — Part 1"
pubDatetime: 2020-01-10T07:00:44.300Z
description: "TODO: Add a description"
tags:
- others
coverImage: "../../assets/images/cover-storing-data-from-the-flutter-app-google-sheets-e4498e9cda5d.png"
---

In this article, we’ll create a sample app which stores Feedback of user from the **Flutter** app into Google Sheets using AppScript.

## 💡 Introduction:

Hello everyone, This is my first ever article on Flutter. Google Sheets is a very powerful tool 🔥 if we look deep in it. It provides us with an interface using [Google AppScript](https://script.google.com) so that we can do various types of operations on Google Spreadsheet. We can perform all types of operations like Reading/Inserting/Updating/Deleting using AppScript on Google Sheets. It’s so much powerful and capable than we can even use Google Sheets as a back-end of our application 📲. Here we’ll develop a sample flutter application, which simply takes user User Feedback, makes HTTP request to Google AppScript and then stores that feedback in Google Sheets. So, let’s start. 😃

**You can try the web version of this app [here](https://patilshreyas.github.io/Flutter2GoogleSheets-Demo/demo/).**

Here’s the [link](https://medium.com/scalereal/getting-data-from-google-sheets-flutter-app-part-2-d6e689fdbbed) for Part 2 of this article.

For implementation, we’ll perform the below steps.

## ⚡️ Setting up Google Sheets:

*Sign in with your Google Account.*Go to your [Google Drive](https://drive.google.com/drive/my-drive) and create a new*‘Google Sheets’*document where you want to store your responses and Open that.*Setup**header columns** of sheet and you’ll see like this.

![Initialized Google Sheet. (Selected Part of URL is **Sheet ID**).](../../assets/images/content/storing-data-from-the-flutter-app-google-sheets-e4498e9cda5d/img-8310c772.png)*Initialized Google Sheet. (Selected Part of URL is**Sheet ID**).*

As above, I’ve set up header columns of the sheet. You can see I’ve highlighted part of the URL. It is the ***Sheet ID***of our current document. Just copy it, we’ll require it in the next step.*Every document has a unique**Sheet ID.****As in below Image, Just go to**Tools → Script Editor.**

![Launching AppScript Editor.](../../assets/images/content/storing-data-from-the-flutter-app-google-sheets-e4498e9cda5d/img-87a1e775.png)

## ⚡️ Setting up Google AppScript:

* After the above steps, you’ll see AppScript Editor will be launched in the New Tab of your browser. You’ll see Code window like below.

![AppScript Editor](../../assets/images/content/storing-data-from-the-flutter-app-google-sheets-e4498e9cda5d/img-6456d5ae.png) *AppScript Editor*

Here in this editor, we have to write AppScript which will act as a Web API and that will communicate with Google sheets.
> We’ll write code in `doPost()` which will be invoked when HTTP request using method POST is sent.

<script src="https://gist.github.com/PatilShreyas/812ec4855499ec7726e3444d6b677b59.js"></script>

First of all, we’ll have to Open our spreadsheet, we can open that using `SpreadsheetApp.openById(sheetId)`

**Sheet ID** which we’ve copied in the previous step has to be passed in this method.

Here, we’ll retrieve parameters using `request.parameter` . Finally, by using a method `appendRow([])`, we’ll insert feedback data into Google Sheet. In the end, we’ll return a JSON response with status: ***SUCCESS/FAILED***.*Select from tab,**Publish → Deploy as web app**![Deploying the Web app](../../assets/images/content/storing-data-from-the-flutter-app-google-sheets-e4498e9cda5d/img-83e2d5be.png)* Deploying the Web app*

*You’ll see a window like this, Just ensure that select ‘Execute the app’ as ‘**Me’**and ‘Who has access to the app’ as ‘***Anyone, even anonymous’.***![](../../assets/images/content/storing-data-from-the-flutter-app-google-sheets-e4498e9cda5d/img-a96a4d41.png)* Authorization is required! Just review permissions. Then select your Google Account.

![](../../assets/images/content/storing-data-from-the-flutter-app-google-sheets-e4498e9cda5d/img-8933abec.png)

*You’ll see like this, Just expand that ‘Advanced’ and click on ‘***Go to YOUR_PROJECT_NAME (unsafe)’.*** As I’ve highlighted below.

![Proceed this…](../../assets/images/content/storing-data-from-the-flutter-app-google-sheets-e4498e9cda5d/img-6f4d1440.png) *Proceed this…****Allow** these permissions and then you’re done!

![Review and allow permissions.](../../assets/images/content/storing-data-from-the-flutter-app-google-sheets-e4498e9cda5d/img-b56f1222.png) *Review and allow permissions.*

* Finally, you’ll get a window like this with the Web app URL. Copy that Web URL for a reference. We’ll use this URL for making HTTP GET requests from our flutter app.

![](../../assets/images/content/storing-data-from-the-flutter-app-google-sheets-e4498e9cda5d/img-73bb8265.png)

😃We’ve done this part. Let’s see Flutter implementation.

## ⚡️ Setting up Flutter 💙 App:

*Init a flutter directory using `flutter create PROJECT_NAME` .*In***pubspec.yaml,*** add the following dependency.

```
dependencies:
flutter:
sdk: flutter
http: ^0.12.0+3
```


*In***lib/model*** , we’ll create a `form.dart` file as below.

<script src="https://gist.github.com/PatilShreyas/55fe1d9fe409e38e8677171bbe0a4ff7.js"></script>

Here, we have added a method `toParams()` which will make the body parameters of POST request from fields that we can use later while making HTTP requests.

*In***lib/controller*** , we’ll create a `form_controller.dart` file as below.

<script src="https://gist.github.com/PatilShreyas/3b19df2e464fec7de4c70f20fc567ad3.js"></script>

In `FormController` class, we have created a default constructor which takes `function`callback as a parameter which will be invoked when the HTTP response is received.

Use that web URL which we’ve obtained in previous steps.

Finally, we’ve created an *async* method `submitForm(FeedbackForm)` which takes `FeedbackForm` object as a parameter and makes HTTP GET request on `URL`.

*In***lib/`main.dart`*** , we’ll write the below code.

<script src="https://gist.github.com/PatilShreyas/905c2d390751be49a5b3642badb66963.js"></script>

We have created a Form with four *TextFields*and a*‘Submit Feedback’* button.

Whenever the button is pressed, a form is validated first. Then, we’re instantiating `FeedbackForm` object from TextField values. Finally, we’re passing that object to the`submitForm()` method of `FormController` .

We’ve done the implementation of our flutter app. Let’s test it 😄.

Run command — `flutter run`

![Flutter App Response](../../assets/images/content/storing-data-from-the-flutter-app-google-sheets-e4498e9cda5d/img-880f5165.gif) *Flutter App Response*

Our app is running and we can see SnackBar output. Now let’s see our Google Sheet.

![Google Sheet](../../assets/images/content/storing-data-from-the-flutter-app-google-sheets-e4498e9cda5d/img-365a1a5f.png) *Google Sheet*
> Yippie! 😍. You can see above, Data from flutter app is appended into Google Sheet. It’s working as expected. Hope you liked that. If you find it helpful please share this. Maybe it’ll help someone needy!

Thus, we’ve successfully stored User response from the Flutter app into Google Sheets using Google AppScript.

You can test a web version of this app from [this](https://patilshreyas.github.io/Flutter2GoogleSheets-Demo/demo/) link.

### Part 2 — Getting data from Google Sheets into Flutter App

Here’s the link for the Part 2 of this article where we’ll see how to get data from Google Sheets into the flutter app.

[https://medium.com/scalereal/getting-data-from-google-sheets-flutter-app-part-2-d6e689fdbbed](https://medium.com/scalereal/getting-data-from-google-sheets-flutter-app-part-2-d6e689fdbbed)

If you found this project useful, then please consider giving it a ⭐️ on GitHub and sharing it with your friends via social media.

> Sharing is Caring!

Thank You! 😃

## ☑️ Repository:

Here’s GitHub repo which contains **Flutter**+ Google**AppScript** Code.

[https://github.com/PatilShreyas/Flutter2GoogleSheets-Demo](https://github.com/PatilShreyas/Flutter2GoogleSheets-Demo)


Feel free to reach me anytime on…

[http://patilshreyas.github.io](http://patilshreyas.github.io)