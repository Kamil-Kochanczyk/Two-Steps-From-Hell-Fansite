const fs = require('fs');
const { promisify } = require('util');
const PATH = 'comments-db.json';

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

function dbExists() {
    return fs.existsSync(PATH);
}

function createDB() {
    const db = [];

    try {
        fs.writeFileSync(PATH, JSON.stringify(db));
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

async function addNewComment(newComment) {
    try {
        const db = await getDB();
        db.push({ comment: newComment, replies: [] });
        await writeFileAsync(PATH, JSON.stringify(db));
    }
    catch (error) {
        throw error;
    }
}

async function nextCommentID() {
    try {
        const db = await getDB();
        const length = db.length;
        const nextID = 'com-' + (length + 1);
        return nextID;
    }
    catch (error) {
        throw error;
    }
}

async function getComment(id) {
    try {
        const db = await getDB();
        const foundComment = db.find(conversationObj => conversationObj.comment.id === id).comment;
        return foundComment;
    }
    catch (error) {
        throw error;
    }
}

module.exports = {
    dbExists,
    createDB,
    getDB,
    addNewComment,
    nextCommentID,
    getComment
};