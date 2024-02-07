const express = require('express');
const router = express.Router();

const UsersDB = require('../apis/users-db');
const ActiveUser = require('../apis/active-user');

const createError = require('http-errors');

async function loadPage(req, res, titleArg, templateArg, styleArg, scriptArg, subpageDataArg) {
    try {
        let loggedInArg;
        let loggedInUserUsernameArg;
        
        const isEmpty = await ActiveUser.isEmpty(req.models.ActiveUser);
    
        if (isEmpty) {
            loggedInArg = false;
            loggedInUserUsernameArg = '';
        }
        else {
            loggedInArg = true;
            loggedInUserUsernameArg = (await ActiveUser.get(req.models.ActiveUser)).username;
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
        loadPage(req, res, 'Home', 'home', 'home', null, null);
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'get-home-error '})
    }
});

router.get('/founders', (req, res) => {
    try {
        loadPage(req, res, 'Founders', 'founders', 'founders', null, null);
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'get-founders-error '})
    }
});

router.get('/albums', (req, res) => {
    try {
        loadPage(req, res, 'Albums', 'albums', 'albums', 'albums', null);
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'get-albums-error '})
    }
});

router.get('/news', (req, res) => {
    try {
        loadPage(req, res, 'News', 'news', 'news', null, null);
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'get-news-error '})
    }
});

router.get('/log-in', async (req, res) => {
    try {
        const subpageDataArg = { showMain: (await ActiveUser.isEmpty(req.models.ActiveUser)) };
        loadPage(req, res, 'Log In', 'log-in', 'log-in', 'log-in', subpageDataArg);
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'get-log-in-error '})
    }
});

router.get('/sign-up', async (req, res) => {
    try {
        const subpageDataArg = { showMain: (await ActiveUser.isEmpty(req.models.ActiveUser)) };
        loadPage(req, res, 'Sign Up', 'sign-up', 'sign-up', 'sign-up', subpageDataArg);
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'get-sign-up-error '})
    }
});

router.get('/profile/:username', async (req, res, next) => {
    try {
        const paramUsername = req.params.username;

        const exists = await UsersDB.exists(req.models.UsersDB, paramUsername);
    
        if (exists) {
            const user = await UsersDB.getOneUser(req.models.UsersDB, paramUsername);
            const activeUser = await ActiveUser.get(req.models.ActiveUser);
            const areTheSame = JSON.stringify(user) === JSON.stringify(activeUser);
            const subpageDataArg = {
                username: user.username,
                email: user.email,
                showEditUserInfo: areTheSame,
            };
            
            loadPage(req, res, 'Profile', 'profile', 'profile', 'profile', subpageDataArg);
        }
        else {
            next(createError(404));
        }
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'get-profile-error '})
    }
});

module.exports = router;
