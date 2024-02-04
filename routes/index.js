const express = require('express');
const router = express.Router();

const UsersDB = require('../apis/users-db');
const ActiveUser = require('../apis/active-user');

const createError = require('http-errors');

async function loadPage(res, titleArg, templateArg, styleArg, scriptArg, subpageDataArg) {
    let loggedInArg;
    let loggedInUserUsernameArg;
    
    const isEmpty = await ActiveUser.isEmpty();

    if (isEmpty) {
        loggedInArg = false;
        loggedInUserUsernameArg = '';
    }
    else {
        loggedInArg = true;
        loggedInUserUsernameArg = (await ActiveUser.get()).username;
    }

    res.render('index', {
        title: titleArg,
        specificTemplate: templateArg,
        specificStyle: styleArg,
        specificScript: scriptArg,
        loggedIn: loggedInArg,
        loggedInUserUsername: loggedInUserUsernameArg,
        subpageData: subpageDataArg
    });
}

router.get('/', (req, res) => {
    loadPage(res, 'Home', 'home', 'home', null, null);
});

router.get('/founders', (req, res) => {
    loadPage(res, 'Founders', 'founders', 'founders', null, null);
});

router.get('/albums', (req, res) => {
    loadPage(res, 'Albums', 'albums', 'albums', 'albums', null);
});

router.get('/news', (req, res) => {
    loadPage(res, 'News', 'news', 'news', null, null);
});

router.get('/log-in', (req, res) => {
    loadPage(res, 'Log In', 'log-in', 'log-in', 'log-in', null);
});

router.get('/sign-up', (req, res) => {
    loadPage(res, 'Sign Up', 'sign-up', 'sign-up', 'sign-up', null);
});

router.get('/profile', async (req, res, next) => {
    const queryUsername = req.query.username;

    let usernameModified = false;
    let emailModified = false;
    let passwordModified = false;

    if (req.query.usernameChanged) {
        usernameModified = req.query.usernameChanged;
    }
    if (req.query.emailChanged) {
        emailModified = req.query.emailChanged;
    }
    if (req.query.passwordChanged) {
        passwordModified = req.query.passwordChanged;
    }

    const exists = await UsersDB.exists(queryUsername);

    if (exists) {
        const user = await UsersDB.getOneUser(queryUsername);
        const activeUser = await ActiveUser.get();
        const areTheSame = JSON.stringify(user) === JSON.stringify(activeUser);
        const subpageDataArg = {
            username: user.username,
            email: user.email,
            showEditUserInfo: areTheSame,
            usernameChanged: usernameModified,
            emailChanged: emailModified,
            passwordChanged: passwordModified
        };
        loadPage(res, 'Profile', 'profile', 'profile', 'profile', subpageDataArg);
    }
    else {
        next(createError(404));
    }
});

module.exports = router;
