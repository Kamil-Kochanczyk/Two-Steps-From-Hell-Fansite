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

router.get('/log-in', async (req, res) => {
    const subpageDataArg = { showMain: (await ActiveUser.isEmpty()) };
    loadPage(res, 'Log In', 'log-in', 'log-in', 'log-in', subpageDataArg);
});

router.get('/sign-up', async (req, res) => {
    const subpageDataArg = { showMain: (await ActiveUser.isEmpty()) };
    loadPage(res, 'Sign Up', 'sign-up', 'sign-up', 'sign-up', subpageDataArg);
});

router.get('/profile/:username', async (req, res, next) => {
    const paramUsername = req.params.username;

    const exists = await UsersDB.exists(paramUsername);

    if (exists) {
        const user = await UsersDB.getOneUser(paramUsername);
        const activeUser = await ActiveUser.get();
        const areTheSame = JSON.stringify(user) === JSON.stringify(activeUser);
        const subpageDataArg = {
            username: user.username,
            email: user.email,
            showEditUserInfo: areTheSame,
        };
        
        loadPage(res, 'Profile', 'profile', 'profile', 'profile', subpageDataArg);
    }
    else {
        next(createError(404));
    }
});

module.exports = router;
