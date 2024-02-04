const express = require('express');
const router = express.Router();

const UsersDB = require('../apis/users-db');
const ActiveUser = require('../apis/active-user');

router.post('/log-in', async (req, res) => {
    const { username, password } = req.body;

    try {
        const exists = await UsersDB.exists(username);
        const passwordCorrect = await UsersDB.passwordCorrect(username, password);

        if (!exists) {
            res.json({ error: 'username-not-found' });
        }
        else if (!passwordCorrect) {
            res.json({ error: 'incorrect-password' });
        }
        else {
            const activeUser = await UsersDB.getOneUser(username);
            ActiveUser.set(activeUser);
            
            const activeUserUsername = activeUser.username;
            const activeUserEmail = activeUser.email;
            res.json({ activeUserUsername, activeUserEmail });
        }
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'session-service-log-in-error' });
    }
});

router.get('/username', async (req, res) => {
    try {
        const activeUserUsername = await ActiveUser.getUsername();
        res.json({ username: activeUserUsername });
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'session-service-username-error' });
    }
});

router.get('/email', async (req, res) => {
    try {
        const activeUserEmail = await ActiveUser.getEmail();
        res.json({ email: activeUserEmail });
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'session-service-email-error' });
    }
});

router.get('/password', async (req, res) => {
    try {
        const activeUserPassword = await ActiveUser.getPassword();
        res.json({ password: activeUserPassword });
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'session-service-password-error' });
    }
});

router.post('/edit/:attribute', async (req, res) => {
    const activeUser = await ActiveUser.get();
    const attribute = req.params.attribute;
    const newValue = req.body.newValue;
    let returnedValue;

    try {
        if (attribute === 'username') {
            returnedValue = await UsersDB.setUsername(activeUser.username, newValue);
            await ActiveUser.set(await UsersDB.getOneUser(returnedValue));
            res.json({ newUsername: returnedValue });
        }
        else if (attribute === 'email') {
            returnedValue = await UsersDB.setEmail(activeUser.username, newValue);
            await ActiveUser.set(await UsersDB.getOneUser(activeUser.username));
            res.json({ newEmail: returnedValue });
        }
        else if (attribute === 'password') {
            returnedValue = await UsersDB.setPassword(activeUser.username, newValue);
            await ActiveUser.set(await UsersDB.getOneUser(activeUser.username));
            res.json({ newPassword: returnedValue });
        }
        else {
            throw new Error('Unknown attribute');
        }
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'session-service-edit-attribute-error' });
    }
});

router.post('/log-out', async (req, res) => {
    await ActiveUser.set({});
    res.json({});
});

module.exports = router;
