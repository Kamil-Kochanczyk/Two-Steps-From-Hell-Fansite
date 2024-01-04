const express = require('express');
const app = express();
const port = 3000;

const users = require('./users');

let activeUser = null;

// Serve static files from the 'HTML' folder
app.use(express.static('public', {
  // Serve only files with .html extension
  extensions: ['html']
}));

// Easily get json data by req.body
app.use(express.json());

// Handle complicated data from forms
app.use(express.urlencoded({ extended: true }));

app.post('/submit-sign-up-data', (req, res) => {
  const signUpData = req.body;

  try {
    if (!users.usersExist()) {
      users.initializeUsers(signUpData, () => {
        users.findUser(signUpData.username, (user) => {
          activeUser = user;
          res.json({ 'initialized': 'initialized' });
        });
      });
    }
    else {
      users.findUser(signUpData.username, (foundUser) => {
        if (foundUser === undefined) {
          users.addUser(signUpData, () => {
            users.findUser(signUpData.username, (user) => {
              activeUser = user;
              res.json({ 'added': 'added' });
            });
          });
        }
        else {
          res.json({ 'error': 'username-already-exists' });
        }
      });
    }
  }
  catch (error) {
    console.error(error);
    res.json({ 'error': 'sign-up-error' });
  }
});

app.post('/submit-log-in-data', (req, res) => {
  const logInData = req.body;

  try {
    if (!users.usersExist()) {
      res.json({ 'error': 'database-not-found' });
    }
    else {
      users.findUser(logInData.username, (foundUser) => {
        if (foundUser === undefined) {
          res.json({ 'error': 'username-not-found' });
        }
        else {
          if (foundUser.password !== logInData.password) {
            res.json({ 'error': 'incorrect-password' });
          }
          else {
            activeUser = foundUser;
            res.json({ 'success': 'success' });
          }
        }
      });
    }
  }
  catch (error) {
    console.error(error);
    res.json({ 'error': 'log-in-error' });
  }
});

app.get('/get-active-user', (req, res) => {
  if (activeUser === null) {
    res.json(null);
  }
  else {
    let username = activeUser.username;
    let email = activeUser.email;
    res.json({ username, email });
  }
});

app.get('/log-out', (req, res) => {
  activeUser = null;
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});