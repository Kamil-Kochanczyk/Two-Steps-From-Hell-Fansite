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
            return JSON.parse(data);
        }
        catch (error) {
            throw error;
        }
    }

    static async setUsers(users) {
        try {
            await writeFileAsync(PATH, JSON.stringify(users, null, 4));
        }
        catch (error) {
            throw error;
        }
    }

    static async addUser(user) {
        try {
            const users = await this.getUsers();
            users.push(user);
            await this.setUsers(users);
        }
        catch (error) {
            throw error;
        }
    }

    static async findIndex(username) {
        try {
            const users = await this.getUsers();
            return users.findIndex(user => user.username === username);
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
                return users[index].password === password;
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

    static async deleteOneUser(username) {
        try {
            const index = await this.findIndex(username);

            if (index !== -1) {
                const users = await this.getUsers();
                users.splice(index, 1);
                await this.setUsers(users);
                return 1;
            }
            else {
                return 0;
            }
        }
        catch (error) {
            throw error;
        }
    }

    static async setAttribute(username, attributeName, newValue) {
        try {
            const index = await this.findIndex(username);

            if (index !== -1) {
                const users = await this.getUsers();

                if (attributeName === 'username') {
                    users[index].username = newValue;
                    await this.setUsers(users);
                }
                else if (attributeName === 'email') {
                    users[index].email = newValue;
                    await this.setUsers(users);
                }
                else if (attributeName === 'password') {
                    users[index].password = newValue;
                    await this.setUsers(users);
                }
                else {
                    throw new Error('Unknown attribute');
                }

                return newValue;
            }
            else {
                return null;
            }
        }
        catch (error) {
            throw error;
        }
    }

    static async setUsername(username, newUsername) {
        try {
            const result = await this.setAttribute(username, 'username', newUsername);
            return result;
        }
        catch (error) {
            throw error;
        }
    }

    static async setEmail(username, newEmail) {
        try {
            const result = await this.setAttribute(username, 'email', newEmail);
            return result;
        }
        catch (error) {
            throw error;
        }
    }

    static async setPassword(username, newPassword) {
        try {
            const result = await this.setAttribute(username, 'password', newPassword);
            return result;
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = UsersDB;
