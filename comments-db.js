const fs = require('fs');
const PATH = 'comments-db.json';

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

function getDB(callback) {
    fs.readFile(PATH, (err, data) => {
        if (err) {
            callback(err, null);
            throw err;
        }
        const db = JSON.parse(data);
        callback(null, db);
    });
}

function addNewComment(newComment, callback) {
    getDB((err, db) => {
        if (err) {
            return;
        }
        db.push({ comment: newComment, replies: [] });
        fs.writeFile(PATH, JSON.stringify(db), (err) => {
            if (err) {
                throw err;
            }
            callback();
        });
    });
}

function nextCommentID(callback) {
    getDB((err, db) => {
        if (err) {
            return;
        }
        const length = db.length;
        const nextID = 'com-' + (length + 1);
        callback(nextID);
    });
}

function getComment(id, callback) {
    getDB((err, db) => {
        if (err) {
            return;
        }
        const foundComment = db.find(conversationObj => conversationObj.comment.id == id).comment;
        callback(foundComment);
    });
}

module.exports = {
    dbExists,
    createDB,
    getDB,
    addNewComment,
    nextCommentID,
    getComment
};