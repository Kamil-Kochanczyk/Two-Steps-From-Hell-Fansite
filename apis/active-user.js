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

    static async isEmpty() {
        return JSON.stringify(await this.get()) === JSON.stringify({});
    }
}

module.exports = ActiveUser;
