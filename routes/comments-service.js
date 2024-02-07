const express = require('express');
const router = express.Router();

const CommentsDB = require('../apis/comments-db');
const VotingDB = require('../apis/voting-db');

router.post('/add-new-comment', async (req, res) => {
    const requestData = req.body;
    const usernameParam = requestData.username;
    const dateParam = requestData.date;
    const contentParam =  requestData.content;

    try {
        const nextCommentID = await CommentsDB.nextCommentID();

        const newCommentObj = {
            id: nextCommentID,
            username: usernameParam,
            date: dateParam,
            content: contentParam,
            voteResult: 0
        };

        await CommentsDB.addNewComment(newCommentObj);
        const foundComment = await CommentsDB.getOneComment(nextCommentID);
        res.json(foundComment);
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'comments-service-add-new-comment-error' });
    }
});

router.post('/add-new-reply', async (req, res) => {
    const requestData = req.body;
    const referenceCommentIDParam = requestData.referenceCommentID;
    const usernameParam = requestData.username;
    const dateParam = requestData.date;
    const contentParam = requestData.content;

    try {
        const referenceCommentObj = await CommentsDB.getOneComment(referenceCommentIDParam);

        const nextReplyID = await CommentsDB.nextReplyID(referenceCommentIDParam);

        const newCommentObj = {
            id: nextReplyID,
            username: usernameParam,
            date: dateParam,
            content: contentParam,
            voteResult: 0
        };

        const newReplyObj = {
            toWhatReply: referenceCommentObj,
            comment: newCommentObj
        };

        await CommentsDB.addNewReply(newReplyObj);

        const foundReply = await CommentsDB.getOneReply(nextReplyID);

        let responseData;

        if (CommentsDB.isMainComment(referenceCommentIDParam)) {
            responseData = {
                replyObj: foundReply,
                isMainComment: true
            };
        }
        else if (CommentsDB.isReplyComment(referenceCommentIDParam)) {
            responseData = {
                replyObj: foundReply,
                isReplyComment: true
            };
        }
        else {
            res.json({ error: 'Unknown id format' });
        }

        res.json(responseData);
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'comments-service-add-new-reply-error' });
    }
});

router.get('/get-all-conversations', async (req, res) => {
    try {
        const allConversations = await CommentsDB.getDB();
        res.json(allConversations);
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'comments-service-get-all-conversations-error' });
    }
});

router.post('/vote', async (req, res) => {
    const { commentID, voteType, username } = req.body;

    try {
        if (voteType === "vote up") {
            const alreadyLiked = await VotingDB.alreadyLiked(commentID, username);

            if (!alreadyLiked) {
                await VotingDB.addToLikes(commentID, username);
            }
            else {
                res.json({ error: 'comment-already-liked' });
            }

            const alreadyDisliked = await VotingDB.alreadyDisliked(commentID, username);

            if (!alreadyDisliked) {
                await CommentsDB.vote(commentID, 1);
            }
            else {
                await VotingDB.removeFromDislikes(commentID, username);
                await CommentsDB.vote(commentID, 2);
            }
        }
        else if (voteType === "vote down") {
            const alreadyDisliked = await VotingDB.alreadyDisliked(commentID, username);

            if (!alreadyDisliked) {
                await VotingDB.addToDislikes(commentID, username);
            }
            else {
                res.json({ error: 'comment-already-disliked' });
            }

            const alreadyLiked = await VotingDB.alreadyLiked(commentID, username);

            if (!alreadyLiked) {
                await CommentsDB.vote(commentID, -1);
            }
            else {
                await VotingDB.removeFromLikes(commentID, username);
                await CommentsDB.vote(commentID, -2);
            }
        }
        else {
            res.json({ error: 'Unknown vote type' });
        }

        const votedComment = await CommentsDB.getOneComment(commentID);

        res.json({ voteResult: votedComment.voteResult });
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'comments-service-vote-error' });
    }
});

router.post('/get-user-votes', async (req, res) => {
    const { username } = req.body;

    try {
        const userVotes = await VotingDB.getOneEntry(username);
        res.json(userVotes);
    }
    catch (error) {
        console.error(error);
        res.json({ error: 'get-user-votes-error' });
    }
});

module.exports = router;
