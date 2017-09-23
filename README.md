# Project Rome Demo
Quick demo of React + Project Rome

## About
This is a demo web app that calls the [Project Rome APIs](https://developer.microsoft.com/en-us/graph/docs/api-reference/beta/resources/project_rome_overview) for sending context to devices. It uses the Rome *Devices API* to fetch and display signed-in devices. Then, the *Device Command API* enables sending a command to open a webpage on the selected device. Please note that there is a delay between sending the command and when the web page is opened on the selected device.

![Image](https://github.com/dpim/project-rome-demo/blob/master/projectrome.PNG)

## Installation
1. Clone the repo
2. `npm install` dependencies
3. Register a new application using the [Application registration portal](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-app-registration)
3. Update `src/config.jg` with client id and redirect uri information
4. Run `npm start` to serve the web app and visit `localhost:3000`

## Note
This uses **beta APIs**, so avoid using this in production
