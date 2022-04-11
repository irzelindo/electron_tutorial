## Electron readit application

Readit is a simple app that lists links to websites with the site images respectively.

Users can create new links, delete and open them.

The app is part of the electron course [Master Electron: Desktop Apps with HTML, JavaScript & CSS](https://www.udemy.com/course/master-electron/) froudemy.

The app was created using HTML, CSS and Javascript(vanilla) it covers all the electron econsepts starting from the _**main process**_ to the _**renderer process**_ it covers most of electron infrastructure and libraries listed below:

* IPC Comunication module (renderer, main, remote);
* Shared API;
* Web Contens;
* Offscreen Windows;
* App Menus;
* Code signing;
* Publishing Releases;
* Electron Builder
* Auto Updater;

To run the app, clone the repository and from root run:
```javascript 
    npm i
    npm start
```
To build the app for windows only in this case run
```javascript
    npm run build 
```
Will run the below command from `package.json`
```javascript  
   electron-builder -w
```
if you want to build for MacOS, or Linux follow the [link](https://www.electron.build/multi-platform-build) for more details. And finaly can release the app runnig 
```javascript
npm run release
```
These command will execute
```javascript
electron-builder -w -p onTagOrDraft
```
From `package.json scripts`

*NB:* Remember to create a certificate for code signing the app, also to generate a git token in order to publish your app.

In case have doubts or want more details can target me on [LinkedIn](https://www.linkedin.com/in/irzelindo-salvador/).