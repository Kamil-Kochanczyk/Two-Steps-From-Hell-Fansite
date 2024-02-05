const fs = require('fs');
const { promisify } = require('util');
const PATH = './models/active-user.json';

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

class ActiveUser {
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
        const activeUser = {};

        try {
            await writeFileAsync(PATH, JSON.stringify(activeUser, null, 4));
        }
        catch (error) {
            throw error;
        }
    }

    static async isEmpty() {
        try {
            return JSON.stringify(await this.get()) === JSON.stringify({});
        }
        catch (error) {
            throw error;
        }
    }
    
    static async get() {
        try {
            const data = await readFileAsync(PATH, 'utf-8');
            const activeUser = JSON.parse(data);
            return activeUser;
        }
        catch (error) {
            throw error;
        }
    }

    static async set(user) {
        try {
            await writeFileAsync(PATH, JSON.stringify(user, null, 4));
        }
        catch (error) {
            throw error;
        }
    }

    static async getAttribute(attributeName) {
        try {
            const activeUser = await this.get();

            if (attributeName === 'username') {
                return activeUser.username;
            }
            else if (attributeName === 'email') {
                return activeUser.email;
            }
            else if (attributeName === 'password') {
                return activeUser.password;
            }
            else {
                throw new Error('Unknown attribute');
            }
        }
        catch (error) {
            throw error;
        }
    }

    static async getUsername() {
        try {
            const username = await this.getAttribute('username');
            return username;
        }
        catch (error) {
            throw error;
        }
    }

    static async getEmail() {
        try {
            const email = await this.getAttribute('email');
            return email;
        }
        catch (error) {
            throw error;
        }
    }

    static async getPassword() {
        try {
            const password = await this.getAttribute('password');
            return password;
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = ActiveUser;
