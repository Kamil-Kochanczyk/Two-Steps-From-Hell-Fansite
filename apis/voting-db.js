const fs = require('fs');
const { promisify } = require('util');
const PATH = './models/voting-db.json';

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

class VotingDB {
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

    static async getDB() {
        try {
            const data = await readFileAsync(PATH, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            throw error;
        }
    }

    static async setDB(db) {
        try {
            await writeFileAsync(PATH, JSON.stringify(db, null, 4));
        }
        catch (error) {
            throw error;
        }
    }

    static async initializeEntry(usernameArg) {
        try {
            const userEntry = { username: usernameArg, likes: [], dislikes: [] };
            const db = await this.getDB();
            db.push(userEntry);
            await this.setDB(db);
        }
        catch (error) {
            throw error;
        }
    }

    static async findEntryIndex(username) {
        try {
            const db = await this.getDB();
            return db.findIndex(entry => entry.username === username);
        }
        catch (error) {
            throw error;
        }
    }

    static async getOneEntry(username) {
        try {
            const db = await this.getDB();
            const entryIndex = await this.findEntryIndex(username);
            return db[entryIndex];
        }
        catch (error) {
            throw error;
        }
    }

    static async alreadyLiked(commentID, username) {
        try {
            const db = await this.getDB();
            const entryIndex = await this.findEntryIndex(username);
            return db[entryIndex].likes.indexOf(commentID) !== -1;
        }
        catch (error) {
            throw error;
        }
    }

    static async alreadyDisliked(commentID, username) {
        try {
            const db = await this.getDB();
            const entryIndex = await this.findEntryIndex(username);
            return db[entryIndex].dislikes.indexOf(commentID) !== -1;
        }
        catch (error) {
            throw error;
        }
    }

    static async addToLikes(commentID, username) {
        try {
            const db = await this.getDB();
            const entryIndex = await this.findEntryIndex(username);
            db[entryIndex].likes.push(commentID);
            await this.setDB(db);
        }
        catch (error) {
            throw error;
        }
    }

    static async addToDislikes(commentID, username) {
        try {
            const db = await this.getDB();
            const entryIndex = await this.findEntryIndex(username);
            db[entryIndex].dislikes.push(commentID);
            await this.setDB(db);
        }
        catch (error) {
            throw error;
        }
    }

    static async removeFromLikes(commentID, username) {
        try {
            const db = await this.getDB();
            const entryIndex = await this.findEntryIndex(username);
            db[entryIndex].likes = db[entryIndex].likes.filter(id => id !== commentID);
            await this.setDB(db);
        }
        catch (error) {
            throw error;
        }
    }

    static async removeFromDislikes(commentID, username) {
        try {
            const db = await this.getDB();
            const entryIndex = await this.findEntryIndex(username);
            db[entryIndex].dislikes = db[entryIndex].dislikes.filter(id => id !== commentID);
            await this.setDB(db);
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = VotingDB;
