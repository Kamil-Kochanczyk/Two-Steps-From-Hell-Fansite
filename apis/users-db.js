const fs = require('fs');
const { promisify } = require('util');
const PATH = './models/users-db.json';

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

class UsersDB {
    static async isInitialized() {
        try {
            const data = await readFileAsync(PATH, 'utf-8');

            if (data !== '') {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw error;
        }
    }
    
    static async initialize() {
        const users = [];
    
        try {
            await writeFileAsync(PATH, JSON.stringify(users, null, 4));
        }
        catch (error) {
            throw error;
        }
    }

    static async getUsers() {
        try {
            const data = await readFileAsync(PATH, 'utf-8');
            const users = JSON.parse(data);
            return users;
        }
        catch (error) {
            throw error;
        }
    }

    static async addUser(user) {
        try {
            const users = await this.getUsers();
            users.push(user);
            await writeFileAsync(PATH, JSON.stringify(users, null, 4));
        }
        catch (error) {
            throw error;
        }
    }

    static async findIndex(username) {
        try {
            const users = await this.getUsers();
            const index = users.findIndex(user => user.username === username);
            return index;
        }
        catch (error) {
            throw error;
        }
    }

    static async exists(username) {
        try {
            const index = await this.findIndex(username);
            return index !== -1;
        }
        catch (error) {
            throw error;
        }
    }

    static async passwordCorrect(username, password) {
        try {
            const index = await this.findIndex(username);

            if (index !== -1) {
                const users = await this.getUsers();
                const isPasswordCorrect = users[index].password === password;
                return isPasswordCorrect;
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw error;
        }
    }

    static async getOneUser(username) {
        try {
            const index = await this.findIndex(username);

            if (index !== -1) {
                const users = await this.getUsers();
                return users[index];
            }
            else {
                return null;
            }
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = UsersDB;
