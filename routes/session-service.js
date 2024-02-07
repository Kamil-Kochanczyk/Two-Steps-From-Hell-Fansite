const express = require('express');
const router = express.Router();

const UsersDB = require('../apis/users-db');
const ActiveUser = require('../apis/active-user');

router.post('/log-in', async (req, res) => {
    const { username, password } = req.body;

    try {
        const exists = await UsersDB.exists(req.models.UsersDB, username);
        const passwordCorrect = await UsersDB.passwordCorrect(req.models.UsersDB, username, password);

        if (!exists) {
            res.json({ error: 'username-not-found' });
        }
        else if (!passwordCorrect) {
            res.json({ error: 'incorrect-password' });
        }
        else {
            const activeUser = await UsersDB.getOneUser(req.models.UsersDB, username);
            await ActiveUser.set(req.models.ActiveUser, activeUser);
            
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
        const activeUserUsername = await ActiveUser.getUsername(req.models.ActiveUser);
        res.json({ username: activeUserUsername });
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'session-service-username-error' });
    }
});

router.get('/email', async (req, res) => {
    try {
        const activeUserEmail = await ActiveUser.getEmail(req.models.ActiveUser);
        res.json({ email: activeUserEmail });
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'session-service-email-error' });
    }
});

router.get('/password', async (req, res) => {
    try {
        const activeUserPassword = await ActiveUser.getPassword(req.models.ActiveUser);
        res.json({ password: activeUserPassword });
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'session-service-password-error' });
    }
});

router.post('/edit/:attribute', async (req, res) => {
    const activeUser = await ActiveUser.get(req.models.ActiveUser);
    const attribute = req.params.attribute;
    const newValue = req.body.newValue;
    let returnedValue;

    try {
        if (attribute === 'username') {
            const userWithThisUsername = await UsersDB.getOneUser(req.models.UsersDB, newValue);
            const usernameAlreadyExists = userWithThisUsername !== null;

            if (usernameAlreadyExists && JSON.stringify(userWithThisUsername) !== JSON.stringify(activeUser)) {
                res.json({ usernameAlreadyTaken: true });
            }
            else {
                returnedValue = await UsersDB.setUsername(req.models.UsersDB, activeUser.username, newValue);
                await ActiveUser.set(req.models.ActiveUser, (await UsersDB.getOneUser(req.models.UsersDB, returnedValue)));
                res.json({ newUsername: returnedValue });
            }
        }
        else if (attribute === 'email') {
            returnedValue = await UsersDB.setEmail(req.models.UsersDB, activeUser.username, newValue);
            await ActiveUser.set(req.models.ActiveUser, (await UsersDB.getOneUser(req.models.UsersDB, activeUser.username)));
            res.json({ newEmail: returnedValue });
        }
        else if (attribute === 'password') {
            returnedValue = await UsersDB.setPassword(req.models.UsersDB, activeUser.username, newValue);
            await ActiveUser.set(req.models.ActiveUser, (await UsersDB.getOneUser(req.models.UsersDB, activeUser.username)));
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
        const activeUserUsername = await ActiveUser.getUsername(req.models.ActiveUser);
        const deletedUsers = await UsersDB.deleteOneUser(req.models.UsersDB, activeUserUsername);

        if (deletedUsers === 1) {
            await ActiveUser.clear(req.models.ActiveUser);
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
        await ActiveUser.clear(req.models.ActiveUser);
        res.json({});
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'session-service-log-out-error' });
    }
});

module.exports = router;
