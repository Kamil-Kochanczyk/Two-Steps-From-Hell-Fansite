const express = require('express');
const router = express.Router();

const UsersDB = require('../apis/users-db');
const ActiveUser = require('../apis/active-user');

router.post('/submit', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const exists = await UsersDB.exists(req.models.UsersDB, username);

        if (!exists) {
            await UsersDB.addUser(req.models.UsersDB, { username, email, password });
            await ActiveUser.set(req.models.ActiveUser, { username, email, password });
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
