const fs = require('fs');
const { promisify } = require('util');
const PATH = 'voting-db.json';

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

function exists() {
    return fs.existsSync(PATH);
}

function initialize() {
    const db = [];

    try {
        fs.writeFileSync(PATH, JSON.stringify(db, null, 4));
    }
    catch (error) {
        throw error;
    }
}

async function getDB() {
    try {
        const data = await readFileAsync(PATH);
        const db = JSON.parse(data);
        return db;
    }
    catch (error) {
        throw error;
    }
}

async function initializeUserEntry(username) {
    try {
        const userEntry = { username: username, likes: [], dislikes: [] };
        const db = await getDB();
        db.push(userEntry);
        await writeFileAsync(PATH, JSON.stringify(db, null, 4));
    }
    catch (error) {
        throw error;
    }
}

async function getEntryIndex(username) {
    try {
        const db = await getDB();
        const entryIndex = db.findIndex(entry => entry.username === username);
        return entryIndex;
    }
    catch (error) {
        throw error;
    }
}

async function getEntry(username) {
    try {
        const db = await getDB();
        const entryIndex = db.findIndex(entry => entry.username === username);
        return db[entryIndex];
    }
    catch (error) {
        throw error;
    }
}

async function alreadyLiked(commentID, username) {
    try {
        const db = await getDB();
        const entryIndex = await getEntryIndex(username);
        return db[entryIndex].likes.indexOf(commentID) !== -1;
    }
    catch (error) {
        throw error;
    }
}

async function alreadyDisliked(commentID, username) {
    try {
        const db = await getDB();
        const entryIndex = await getEntryIndex(username);
        return db[entryIndex].dislikes.indexOf(commentID) !== -1;
    }
    catch (error) {
        throw error;
    }
}

async function removeFromLikes(commentID, username) {
    try {
        const db = await getDB();
        const entryIndex = await getEntryIndex(username);
        db[entryIndex].likes = db[entryIndex].likes.filter(id => id !== commentID);
        await writeFileAsync(PATH, JSON.stringify(db, null, 4));
    }
    catch (error) {
        throw error;
    }
}

async function removeFromDislikes(commentID, username) {
    try {
        const db = await getDB();
        const entryIndex = await getEntryIndex(username);
        db[entryIndex].dislikes = db[entryIndex].dislikes.filter(id => id !== commentID);
        await writeFileAsync(PATH, JSON.stringify(db, null, 4));
    }
    catch (error) {
        throw error;
    }
}

async function addToLikes(commentID, username) {
    try {
        const db = await getDB();
        const entryIndex = await getEntryIndex(username);
        db[entryIndex].likes.push(commentID);
        await writeFileAsync(PATH, JSON.stringify(db, null, 4));
    }
    catch (error) {
        throw error;
    }
}

async function addToDislikes(commentID, username) {
    try {
        const db = await getDB();
        const entryIndex = await getEntryIndex(username);
        db[entryIndex].dislikes.push(commentID);
        await writeFileAsync(PATH, JSON.stringify(db, null, 4));
    }
    catch (error) {
        throw error;
    }
}

module.exports = {
    exists,
    initialize,
    getDB,
    initializeUserEntry,
    getEntryIndex,
    getEntry,
    alreadyLiked,
    alreadyDisliked,
    removeFromLikes,
    removeFromDislikes,
    addToLikes,
    addToDislikes
};