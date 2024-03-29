const express = require('express');
const router = express.Router();

const UsersDB = require('../apis/users-db');
const VotingDB = require('../apis/voting-db');
const ActiveUser = require('../apis/active-user');

router.post('/submit', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const exists = await UsersDB.exists(username);

        if (!exists) {
            await UsersDB.addUser({ username, email, password });
            await VotingDB.initializeEntry(username);
            await ActiveUser.set({ username, email, password });
            res.json({ username, email });
        }
        else {
            res.json({ error: 'username-already-exists' });
        }
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'sign-up-service-submit-error' });
    }
});

module.exports = router;
