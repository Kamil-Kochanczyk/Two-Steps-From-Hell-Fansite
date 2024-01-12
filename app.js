const express = require('express');
const app = express();
const port = 3000;

const usersDB = require('./users-db');
const commentsDB = require('./comments-db');

let activeUser = null;

if (!commentsDB.dbExists()) {
  commentsDB.createDB();
}

// Serve static files from the 'HTML' folder
app.use(express.static('public', {
  // Serve only files with .html extension
  extensions: ['html']
}));

// Easily get json data by req.body
app.use(express.json());

// Handle complicated data from forms
app.use(express.urlencoded({ extended: true }));

app.post('/submit-sign-up-data', async (req, res) => {
  const signUpData = req.body;

  try {
    if (!usersDB.usersExist()) {
      await usersDB.initializeUsers(signUpData);

      const foundUser = await usersDB.findUser(signUpData.username);
      activeUser = foundUser;

      res.json({ initialized: 'initialized' });
    }
    else {
      const foundUser = await usersDB.findUser(signUpData.username);

      if (foundUser === undefined) {
        await usersDB.addUser(signUpData);

        const auxFoundUser = await usersDB.findUser(signUpData.username);
        activeUser = auxFoundUser;

        res.json({ added: 'added' });
      }
      else {
        res.json({ error: 'username-already-exists' });
      }
    }
  }
  catch (error) {
    console.error(error);
    res.json({ error: 'sign-up-error' });
  }
});

app.post('/submit-log-in-data', async (req, res) => {
  const logInData = req.body;

  try {
    if (!usersDB.usersExist()) {
      res.json({ error: 'database-not-found' });
    }
    else {
      const foundUser = await usersDB.findUser(logInData.username);

      if (foundUser === undefined) {
        res.json({ error: 'username-not-found' });
      }
      else if (foundUser.password !== logInData.password) {
        res.json({ error: 'incorrect-password' });
      }
      else {
        activeUser = foundUser;
        res.json({ success: 'success' });
      }
    }
  }
  catch (error) {
    console.error(error);
    res.json({ error: 'log-in-error' });
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

app.post('/add-new-comment', async (req, res) => {
  const newCommentData = req.body;

  try {
    const nextCommentID = await commentsDB.nextCommentID();

    const newCommentObj = {
      id: nextCommentID,
      username: newCommentData.username,
      date: newCommentData.date,
      content: newCommentData.content,
      voteResult: 0
    };

    await commentsDB.addNewComment(newCommentObj);

    const foundComment = await commentsDB.getComment(nextCommentID);

    res.json(foundComment);
  }
  catch (error) {
    console.error(error);
    res.json({ error: 'add-new-comment-error' });
  }
});

app.get('/get-all-conversations', async (req, res) => {
  try {
    const allConversations = await commentsDB.getDB();
    res.json(allConversations);
  }
  catch (error) {
    console.error(error);
    res.json({ error: 'get-all-conversations-error' });
  }
});

app.post('/add-new-reply', async (req, res) => {
  const newReplyData = req.body;

  try {
    const referenceCommentID = newReplyData.referenceCommentID;
    
    const referenceCommentObj = await commentsDB.getComment(referenceCommentID);
  
    const nextReplyID = await commentsDB.nextReplyID(referenceCommentID);
  
    const newCommentObj = {
      id: nextReplyID,
      username: newReplyData.username,
      date: newReplyData.date,
      content: newReplyData.content,
      voteResult: 0
    };
  
    const newReplyObj = { toWhatReply: referenceCommentObj, comment: newCommentObj };
  
    await commentsDB.addNewReply(newReplyObj);
  
    const foundReply = await commentsDB.getReply(nextReplyID);
  
    res.json(foundReply);
  }
  catch (error) {
    console.error(error);
    res.json({ error: 'add-new-reply-error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});