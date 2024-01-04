const fs = require('fs');
const PATH = 'users.json';

function usersExist() {
    return fs.existsSync(PATH);
}

function initializeUsers(user, callback) {
    const users = [user];
    fs.writeFile(PATH, JSON.stringify(users), (err) => {
        if (err) {
            console.error(err);
            throw err;
        }
        callback();
    });
}

function getUsers(callback) {
    fs.readFile(PATH, (err, data) => {
        if (err) {
            console.error(err);
            callback(err, null);
            throw err;
        }
        const users = JSON.parse(data);
        callback(null, users);
    });
}

function addUser(user, callback) {
    getUsers((err, users) => {
        if (err) {
            return;
        }
        users.push(user);
        fs.writeFile(PATH, JSON.stringify(users), (err) => {
            if (err) {
                console.error(err);
                throw err;
            }
            callback();
        });
    });
}

function findUser(username, callback) {
    getUsers((err, users) => {
        if (err) {
            return;
        }
        const foundUser = users.find(user => user.username === username);
        callback(foundUser);
    });
}

module.exports = {
    usersExist,
    initializeUsers,
    getUsers,
    addUser,
    findUser
};