const fs = require('fs');
const { promisify } = require('util');
const PATH = './databases/users-db.json';

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

function usersExist() {
    return fs.existsSync(PATH);
}

function initializeUsers() {
    const users = [];
    
    try {
        fs.writeFileSync(PATH, JSON.stringify(users, null, 4));
    }
    catch (error) {
        throw error;
    }
}

async function getUsers() {
    try {
        const data = await readFileAsync(PATH);
        const users = JSON.parse(data);
        return users;
    }
    catch (error) {
        throw error;
    }
}

async function addUser(user) {
    try {
        const users = await getUsers();
        users.push(user);
        await writeFileAsync(PATH, JSON.stringify(users, null, 4));
    }
    catch (error) {
        throw error;
    }
}

async function findUser(username) {
    try {
        const users = await getUsers();
        const foundUser = users.find(user => user.username === username);
        return foundUser;
    }
    catch (error) {
        throw error;
    }
}

module.exports = {
    usersExist,
    initializeUsers,
    getUsers,
    addUser,
    findUser
};