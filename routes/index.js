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
    const username = req.query.username;
    const exists = await UsersDB.exists(username);

    if (exists) {
        const user = await UsersDB.getOneUser(username);
        const subpageDataArg = { username: user.username, email: user.email };
        loadPage(res, 'Profile', 'profile', 'profile', null, subpageDataArg);
    }
    else {
        next(createError(404));
    }
});

module.exports = router;
