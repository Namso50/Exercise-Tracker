# Freecodecamp Back end Development and APIs projects

## Exercise Tracker

- You can POST to /api/users with form data username to create a new user, and the returned response from POST /api/users with form data username will be an object with username and _id properties.

- You can make a GET request to /api/users to get a list of all users.
  
- You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used, and The response returned from POST /api/users/:_id/exercises will be the user object with the exercise fields added.

- You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.
 
## Install the dependencies

Run the following to install the dependencies:

```bash
$ npm install
```

## Run Project

Runs the project in the development mode:

```bash
$ npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Production

Builds the app for production to the `build` folder.

```bash
$ npm build
```

## Author
[Namso50](https://github.com/Namso50)
