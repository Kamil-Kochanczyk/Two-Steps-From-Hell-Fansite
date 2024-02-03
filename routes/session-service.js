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

router.post('/log-out', async (req, res) => {
    await ActiveUser.set({});
    res.json({});
});

module.exports = router;
