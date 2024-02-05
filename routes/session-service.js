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
            await ActiveUser.set(activeUser);
            
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
            const userWithThisUsername = await UsersDB.getOneUser(newValue);
            const usernameAlreadyExists = userWithThisUsername !== null;

            if (usernameAlreadyExists && JSON.stringify(userWithThisUsername) !== JSON.stringify(activeUser)) {
                res.json({ usernameAlreadyTaken: true });
            }
            else {
                returnedValue = await UsersDB.setUsername(activeUser.username, newValue);
                await ActiveUser.set(await UsersDB.getOneUser(returnedValue));
                res.json({ newUsername: returnedValue });
            }
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

router.post('/delete', async (req, res) => {
    try {
        const activeUserUsername = await ActiveUser.getUsername();
        const deletedUsers = await UsersDB.deleteOneUser(activeUserUsername);

        if (deletedUsers === 1) {
            await ActiveUser.set({});
        }
        else {
            throw new Error('User could not be deleted');
        }

        res.json({ deletedUsers });
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'session-service-delete-error' });
    }
});

router.post('/log-out', async (req, res) => {
    try {
        await ActiveUser.set({});
        res.json({});
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'session-service-log-out-error' });
    }
});

module.exports = router;
