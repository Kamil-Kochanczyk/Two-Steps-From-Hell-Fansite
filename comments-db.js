const fs = require('fs');
const { promisify } = require('util');
const PATH = './databases/comments-db.json';

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

function dbExists() {
    return fs.existsSync(PATH);
}

function createDB() {
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

async function addNewComment(newComment) {
    try {
        const db = await getDB();
        db.push({ comment: newComment, replies: [] });
        await writeFileAsync(PATH, JSON.stringify(db, null, 4));
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
        const mainCommentIDPattern = /^com-\d+$/;
        const replyCommentIDPattern = /^com-\d+-\d+$/;

        if (mainCommentIDPattern.test(id)) {
            const foundComment = db.find(conversationObj => conversationObj.comment.id === id).comment;
            return foundComment;
        }
        else if (replyCommentIDPattern.test(id)) {
            const reply = await getReply(id);
            return reply.comment;
        }
        else {
            throw "Unknown id format";
        }
    }
    catch (error) {
        throw error;
    }
}

async function getConversationIndex(id) {
    try {
        const db = await getDB();
        const mainCommentIDPattern = /^com-\d+$/;
        const replyCommentIDPattern = /^com-\d+-\d+$/;
    
        if (mainCommentIDPattern.test(id)) {
            const conversationIndex = db.findIndex(conversationObj => conversationObj.comment.id === id);
            return conversationIndex;
        }
        else if (replyCommentIDPattern.test(id)) {
            const conversationIndex = db.findIndex(conversationObj => {
                const repliesObj = conversationObj.replies;
                const foundReply = repliesObj.find(replyObj => replyObj.comment.id === id);
                return foundReply !== undefined;
            });
            return conversationIndex;
        }
        else {
            throw "Unknown id format";
        }
    }
    catch (error) {
        throw error;
    }
}

async function nextReplyID(referenceCommentID) {
    try {
        const db = await getDB();
        const conversationIndex = await getConversationIndex(referenceCommentID);
        const repliesLength = db[conversationIndex].replies.length;
        const nextID = db[conversationIndex].comment.id + '-' + (repliesLength + 1);
        return nextID;
    }
    catch (error) {
        throw error;
    }
}

async function addNewReply(newReplyObj) {
    try {
        const db = await getDB();
        const destinationConversationIndex = await getConversationIndex(newReplyObj.toWhatReply.id);
        db[destinationConversationIndex].replies.push(newReplyObj);
        await writeFileAsync(PATH, JSON.stringify(db, null, 4));
    }
    catch (error) {
        throw error;
    }
}

async function getReply(id) {
    try {
        const db = await getDB();
        const conversationIndex = await getConversationIndex(id);
        const reply = db[conversationIndex].replies.find(replyObj => replyObj.comment.id === id);
        return reply;
    }
    catch (error) {
        throw error;
    }
}

async function vote(commentID, vote) {
    try {
        const db = await getDB();
        const conversationIndex = await getConversationIndex(commentID);
        const mainCommentIDPattern = /^com-\d+$/;
        const replyCommentIDPattern = /^com-\d+-\d+$/;

        if (mainCommentIDPattern.test(commentID)) {
            db[conversationIndex].comment.voteResult += vote;
        }
        else if (replyCommentIDPattern.test(commentID)) {
            const replyIndex = db[conversationIndex].replies.findIndex(reply => reply.comment.id === commentID);
            db[conversationIndex].replies[replyIndex].comment.voteResult += vote;
        }
        else {
            throw "Unknown id format";
        }

        await writeFileAsync(PATH, JSON.stringify(db, null, 4));
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
    getComment,
    getConversationIndex,
    nextReplyID,
    addNewReply,
    getReply,
    vote
};