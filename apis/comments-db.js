const fs = require('fs');
const { promisify } = require('util');
const PATH = './models/comments-db.json';

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

class CommentsDB {
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

    static async nextCommentID() {
        try {
            const db = await this.getDB();
            const length = db.length;
            return 'com-' + (length + 1);
        }
        catch (error) {
            throw error;
        }
    }

    static async nextReplyID(commentID) {
        try {
            const db = await this.getDB();
            const conversationIndex = await this.findConversationIndex(commentID);
            const repliesLength = db[conversationIndex].replies.length;
            return db[conversationIndex].comment.id + '-' + (repliesLength + 1);
        }
        catch (error) {
            throw error;
        }
    }

    static async addNewComment(newComment) {
        try {
            const db = await this.getDB();
            db.push({ comment: newComment, replies: [] });
            await this.setDB(db);
        }
        catch (error) {
            throw error;
        }
    }

    static async addNewReply(newReply) {
        try {
            const db = await this.getDB();
            const conversationIndex = await this.findConversationIndex(newReply.toWhatReply.id);
            db[conversationIndex].replies.push(newReply);
            await this.setDB(db);
        }
        catch (error) {
            throw error;
        }
    }

    static async getOneComment(commentID) {
        try {
            if (this.isMainComment(commentID)) {
                const db = await this.getDB();
                return db.find(conversationObj => conversationObj.comment.id === commentID).comment;
            }
            else if (this.isReplyComment(commentID)) {
                const reply = await this.getOneReply(commentID);
                return reply.comment;
            }
            else {
                throw new Error('Unknown id format');
            }
        }
        catch (error) {
            throw error;
        }
    }

    static async getOneReply(commentID) {
        try {
            const db = await this.getDB();
            const conversationIndex = await this.findConversationIndex(commentID);
            return db[conversationIndex].replies.find(replyObj => replyObj.comment.id === commentID);
        }
        catch (error) {
            throw error;
        }
    }

    static async findConversationIndex(commentID) {
        try {
            const db = await this.getDB();

            if (this.isMainComment(commentID)) {
                return db.findIndex(conversationObj => conversationObj.comment.id === commentID);
            }
            else if (this.isReplyComment(commentID)) {
                return db.findIndex(conversationObj => conversationObj.replies.find(replyObj => replyObj.comment.id === commentID) !== undefined);
            }
            else {
                throw new Error('Unknown id format');
            }
        }
        catch (error) {
            throw error;
        }
    }

    static async vote(commentID, deltaVote) {
        try {
            const db = await this.getDB();
            const conversationIndex = await this.findConversationIndex(commentID);
    
            if (this.isMainComment(commentID)) {
                db[conversationIndex].comment.voteResult += deltaVote;
            }
            else if (this.isReplyComment(commentID)) {
                const replyIndex = db[conversationIndex].replies.findIndex(reply => reply.comment.id === commentID);
                db[conversationIndex].replies[replyIndex].comment.voteResult += deltaVote;
            }
            else {
                throw new Error('Unknown id format');
            }
    
            await this.setDB(db);
        }
        catch (error) {
            throw error;
        }
    }

    static isMainComment(commentID) {
        try {
            return /^com-\d+$/.test(commentID);
        }
        catch (error) {
            throw error;
        }
    }

    static isReplyComment(commentID) {
        try {
            return /^com-\d+-\d+$/.test(commentID);
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = CommentsDB;
