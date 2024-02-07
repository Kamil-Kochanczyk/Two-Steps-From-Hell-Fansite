const express = require('express');
const router = express.Router();

const UsersDB = require('../apis/users-db');
const ActiveUser = require('../apis/active-user');

const createError = require('http-errors');

async function loadPage(res, titleArg, templateArg, styleArg, scriptArg, subpageDataArg) {
    try {
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
    catch (error) {
        throw error;
    }
}

router.get('/', (req, res) => {
    try {
        loadPage(res, 'Home', 'home', 'home', null, null);
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'get-home-error' });
    }
});

router.get('/founders', (req, res) => {
    try {
        loadPage(res, 'Founders', 'founders', 'founders', null, null);
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'get-founders-error' });
    }
});

router.get('/albums', (req, res) => {
    try {
        loadPage(res, 'Albums', 'albums', 'albums', 'albums', null);
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'get-albums-error' });
    }
});

router.get('/news', (req, res) => {
    try {
        loadPage(res, 'News', 'news', 'news', null, null);
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'get-news-error' });
    }
});

router.get('/comments', (req, res) => {
    try {
        loadPage(res, 'Comments', 'comments', 'comments', 'comments', null);
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'get-comments-error' });
    }
});

router.get('/log-in', async (req, res) => {
    try {
        const subpageDataArg = { showMain: (await ActiveUser.isEmpty()) };
        loadPage(res, 'Log In', 'log-in', 'log-in', 'log-in', subpageDataArg);
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'get-log-in-error' });
    }
});

router.get('/sign-up', async (req, res) => {
    try {
        const subpageDataArg = { showMain: (await ActiveUser.isEmpty()) };
        loadPage(res, 'Sign Up', 'sign-up', 'sign-up', 'sign-up', subpageDataArg);
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'get-sign-up-error' });
    }
});

router.get('/profile/:username', async (req, res, next) => {
    try {
        const paramUsername = req.params.username;

        const exists = await UsersDB.exists(paramUsername);
    
        if (exists) {
            const user = await UsersDB.getOneUser(paramUsername);
            const activeUser = await ActiveUser.get();
            const areTheSame = false;
            // const areTheSame = JSON.stringify(user) === JSON.stringify(activeUser);
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
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'get-profile-error' });
    }
});

module.exports = router;
