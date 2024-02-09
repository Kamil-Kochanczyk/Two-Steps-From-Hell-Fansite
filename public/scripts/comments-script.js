document.addEventListener("DOMContentLoaded", () => {
    try {
        initializeCommentsPage();
    }
    catch (error) {
        console.error(error);
    }
});

async function initializeCommentsPage() {
    try {
        const loggedUser = await getLoggedUser();

        if (loggedUser) {
            initializeAddNewCommentForm(loggedUser);
        }
        else {
            initializeLogInButton();
        }

        await initializePostedCommentsSection(loggedUser);
    }
    catch (error) {
        throw error;
    }
}

async function getLoggedUser() {
    try {
        const response = await fetch("/session-service/user");

        if (!response.ok) {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }

        const loggedUser = await response.json();

        if (loggedUser.error) {
            throw new Error(loggedUser.error);
        }

        if (loggedUser.isEmpty) {
            return null;
        }
        else {
            return loggedUser;
        }
    }
    catch (error) {
        throw error;
    }
}

function initializeAddNewCommentForm(loggedUser) {
    const addNewCommentForm = new AddNewCommentForm();
    const addNewCommentFormContainer = addNewCommentForm.getContainer();

    addNewCommentFormContainer.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = loggedUser.username;
        const date = getCurrentDateTime();
        const content = addNewCommentFormContainer.querySelector(".new-comment-area").value;
        const newCommentData = { username, date, content };

        try {
            const response = await fetch("/comments-service/add-new-comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCommentData)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error. Status: ${response.status}`);
            }
    
            const commentObj = await response.json();

            if (commentObj.error) {
                throw new Error(commentObj.error);
            }

            const newComment = Comment.fromObj(commentObj);
            const replies = new Replies([]);

            const newConversation = new Conversation(newComment, replies);
            const newConversationContainer = newConversation.getContainer();

            const newlyCreatedReplyButton = newConversationContainer.querySelector(".comment-reply-button");
            initializeReplyButton(newlyCreatedReplyButton, loggedUser);

            const newlyCreatedVoteUpButton = newConversationContainer.querySelector(".comment-vote-up");
            initializeVoteButton(newlyCreatedVoteUpButton, loggedUser);

            const newlyCreatedVoteDownButton = newConversationContainer.querySelector(".comment-vote-down");
            initializeVoteButton(newlyCreatedVoteDownButton, loggedUser);

            const postedCommentsContainer = document.getElementById("posted-comments-container");
            postedCommentsContainer.prepend(newConversationContainer);

            const noCommentsText = document.getElementById("no-comments-text");

            if (noCommentsText) {
                noCommentsText.remove();
            }

            addNewCommentFormContainer.querySelector(".new-comment-area").value = "";
        }
        catch (error) {
            throw error;
        }
    });

    const section = document.getElementById("first-section");
    section.appendChild(addNewCommentFormContainer);
}

function initializeAddReplyForm(loggedUser, commentContainer) {
    const addReplyForm = new AddReplyForm();
    const addReplyFormContainer = addReplyForm.getContainer();

    addReplyFormContainer.addEventListener("submit", async (e) => {
        e.preventDefault();

        const referenceCommentID = commentContainer.id;

        const username = loggedUser.username;

        const date = getCurrentDateTime();
    
        const textArea = addReplyFormContainer.querySelector(".new-comment-area");
        const content = textArea.value;
    
        const newReplyData = { referenceCommentID, username, date, content };

        try {
            const response = await fetch("/comments-service/add-new-reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newReplyData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error. Status: ${response.status}`);
            }

            const responseData = await response.json();

            if (responseData.error) {
                throw new Error(responseData.error);
            }

            const replyObj = responseData.replyObj;
            const newReply = Reply.fromObj(replyObj);
            const newReplyContainer = newReply.getContainer();

            if (responseData.isMainComment) {
                const repliesContainer = commentContainer.parentNode.querySelector(".replies-container");
                repliesContainer.appendChild(newReplyContainer);
            }
            else if (responseData.isReplyComment) {
                const repliesContainer = commentContainer.parentNode.parentNode;
                repliesContainer.appendChild(newReplyContainer);
            }
            else {
                throw new Error("Unknown id format");
            }

            const newlyCreatedReplyButton = newReplyContainer.querySelector(".comment-reply-button");
            initializeReplyButton(newlyCreatedReplyButton, loggedUser);

            const newlyCreatedVoteUpButton = newReplyContainer.querySelector(".comment-vote-up");
            initializeVoteButton(newlyCreatedVoteUpButton, loggedUser);

            const newlyCreatedVoteDownButton = newReplyContainer.querySelector(".comment-vote-down");
            initializeVoteButton(newlyCreatedVoteDownButton, loggedUser);

            addReplyFormContainer.remove();
        }
        catch (error) {
            throw error;
        }
    });

    return addReplyFormContainer;
}

function initializeLogInButton() {
    const logInButton = document.createElement("button");

    logInButton.id = "anonymous-user-button";
    logInButton.className = "acf-button";
    logInButton.textContent = "Log In";

    logInButton.addEventListener("click", () => {
        window.location.href = "./log-in";
    });

    const section = document.getElementById("first-section");
    section.appendChild(logInButton);
}

async function initializePostedCommentsSection(loggedUser) {
    try {
        const response = await fetch("/comments-service/get-all-conversations");

        if (!response.ok) {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }

        const allConversations = await response.json();

        if (allConversations.error) {
            throw new Error(allConversations.error);
        }

        const postedCommentsContainer = document.getElementById("posted-comments-container");

        if (allConversations.length === 0) {
            const textContainer = document.createElement("div");
            textContainer.id = "no-comments-text";
            textContainer.innerHTML = "No comments have been added yet";
            postedCommentsContainer.appendChild(textContainer);
            return;
        }

        for (let conversationObj of allConversations) {
            const newConversation = Conversation.fromObj(conversationObj);
            const newConversationContainer = newConversation.getContainer();
            postedCommentsContainer.prepend(newConversationContainer);
        }

        const replyButtons = document.getElementsByClassName("comment-reply-button");

        for (let replyButton of replyButtons) {
            initializeReplyButton(replyButton, loggedUser);
        }

        const voteUpButtons = document.getElementsByClassName("comment-vote-up");
        const voteDownButtons = document.getElementsByClassName("comment-vote-down");

        for (let voteUpButton of voteUpButtons) {
            initializeVoteButton(voteUpButton, loggedUser);
        }
        for (let voteDownButton of voteDownButtons) {
            initializeVoteButton(voteDownButton, loggedUser);
        }

        await colorizeVoteButtons(voteUpButtons, loggedUser);
        await colorizeVoteButtons(voteDownButtons, loggedUser);
    }
    catch (error) {
        throw error;
    }
}

function initializeReplyButton(replyButton, loggedUser) {
    if (loggedUser) {
        initializeReplyButtonForLogged(replyButton, loggedUser);
    }
    else {
        initializeReplyButtonForAnonymous(replyButton);
    }
}

function initializeReplyButtonForLogged(replyButton, loggedUser) {
    replyButton.addEventListener("click", () => {
        const commentContainer = replyButton.parentNode.parentNode.parentNode;
        const nextElement = commentContainer.nextElementSibling;

        if (nextElement && nextElement.classList.contains("add-reply")) {
            return;
        }

        const addReplyFormContainer = initializeAddReplyForm(loggedUser, commentContainer);

        const cancelButton = addReplyFormContainer.querySelector(".cancel-comment-button");

        cancelButton.addEventListener("click", () => {
            addReplyFormContainer.remove();
        });

        if (commentContainer.nextSibling) {
            commentContainer.parentNode.insertBefore(addReplyFormContainer, commentContainer.nextSibling);
        }
        else {
            commentContainer.parentNode.appendChild(addReplyFormContainer);
        }
    });
}

function initializeReplyButtonForAnonymous(replyButton) {
    replyButton.addEventListener("click", () => {
        window.location.href = "./log-in";
    });
}

function initializeVoteButton(voteButton, loggedUser) {
    if (loggedUser) {
        unlockVoteButton(voteButton, loggedUser);
    }
    else {
        lockVoteButton(voteButton);
    }
}

function unlockVoteButton(voteButton, loggedUser) {
    voteButton.addEventListener("click", async () => {
        if (voteButton.classList.contains("green") || voteButton.classList.contains("red")) {
            return;
        }

        try {
            const commentContainer = voteButton.parentNode.parentNode.parentNode.parentNode;
            const commentID = commentContainer.id;
    
            let voteType;
    
            if (voteButton.classList.contains("comment-vote-up")) {
                voteType = "vote up";
            }
            else if (voteButton.classList.contains("comment-vote-down")) {
                voteType = "vote down";
            }
            else {
                throw new Error("Unknown vote type");
            }

            const username = loggedUser.username;

            const requestData = { commentID, voteType, username };

            const response = await fetch("/comments-service/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error. Status: ${response.status}`);
            }

            const responseData = await response.json();

            if (responseData.error) {
                throw new Error(responseData.error);
            }

            const voteResult = responseData.voteResult;

            const parentContainer = voteButton.parentNode;

            parentContainer.querySelector(".comment-vote-result").innerHTML = voteResult;

            if (voteType === "vote up") {
                parentContainer.querySelector(".comment-vote-down").classList.remove("red");
                voteButton.classList.add("green");
            }

            if (voteType === "vote down") {
                parentContainer.querySelector(".comment-vote-up").classList.remove("green");
                voteButton.classList.add("red");
            }
        }
        catch (error) {
            throw error;
        }
    });
}

function lockVoteButton(voteButton) {
    voteButton.addEventListener("click", () => {
        window.location.href = "./log-in";
    });
}

async function colorizeVoteButtons(voteButtons, loggedUser) {
    try {
        if (loggedUser) {
            const username = loggedUser.username;
        
            const response = await fetch("/comments-service/get-user-votes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error. Status: ${response.status}`);
            }
    
            const userVotes = await response.json();
    
            if (userVotes.error) {
                throw new Error(userVotes.error);
            }
    
            for (let voteButton of voteButtons) {
                const commentContainer = voteButton.parentNode.parentNode.parentNode.parentNode;
                const commentID = commentContainer.id;
    
                if (voteButton.classList.contains("comment-vote-up")) {
                    if (userVotes.likes.indexOf(commentID) !== -1) {
                        voteButton.classList.add("green");
                    }
                }
                else if (voteButton.classList.contains("comment-vote-down")) {
                    if (userVotes.dislikes.indexOf(commentID) !== -1) {
                        voteButton.classList.add("red");
                    }
                }
                else {
                    throw new Error("Unknown vote type");
                }
            }
        }
    }
    catch (error) {
        throw error;
    }
}

function getCurrentDateTime() {
    const currentDate = new Date();

    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();

    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');

    const formattedDateTime = `${day}.${month}.${year} ${hours}:${minutes}`;

    return formattedDateTime;
}

// The content of comments-template-script.js is copied here only for convenience

class Comment {
    constructor(id, username, date, content, voteResult) {
        this.id = id;
        this.username = username;
        this.date = date;
        this.content = content;
        this.voteResult = voteResult;
        this.commentAvatar = new CommentAvatar();
        this.commentRightColumn = new CommentRightColumn(this.username, this.date, this.content, this.voteResult);
    }

    getContainer() {
        const commentContainer = document.createElement("div");
        commentContainer.id = this.id;
        commentContainer.classList.add("comment-container");

        const commentAvatarContainer = this.commentAvatar.getContainer();
        commentContainer.appendChild(commentAvatarContainer);

        const commentRightColumnContainer = this.commentRightColumn.getContainer();
        commentContainer.appendChild(commentRightColumnContainer);

        return commentContainer;
    }

    static fromObj(obj) {
        const id = obj.id;
        const username = obj.username;
        const date = obj.date;
        const content = obj.content;
        const voteResult = obj.voteResult;

        return new Comment(id, username, date, content, voteResult);
    }

    static toObj(comment) {
        const id = comment.id;
        const username = comment.username;
        const date = comment.date;
        const content = comment.content;
        const voteResult = comment.voteResult;

        return { id, username, date, content, voteResult };
    }
}

class CommentAvatar {
    constructor() {
        this.img = "/images/avatar-placeholder.jpg";
        this.alt = "avatar";
    }

    getContainer() {
        const commentAvatarContainer = document.createElement("div");
        commentAvatarContainer.classList.add("comment-avatar");

        const img = document.createElement("img");
        img.src = this.img;
        img.alt = this.alt
        commentAvatarContainer.appendChild(img);

        return commentAvatarContainer;
    }
}

class CommentRightColumn {
    constructor(username, date, content, voteResult) {
        this.username = username;
        this.date = date;
        this.content = content;
        this.voteResult = voteResult;
        this.commentFrame = new CommentFrame(this.username, this.date, this.content);
        this.commentBottomOptions = new CommentBottomOptions(this.voteResult);
    }

    getContainer() {
        const commentRightColumnContainer = document.createElement("div");
        commentRightColumnContainer.classList.add("comment-right-column");

        const commentFrameContainer = this.commentFrame.getContainer();
        commentRightColumnContainer.appendChild(commentFrameContainer);

        const commentBottomOptionsContainer = this.commentBottomOptions.getContainer();
        commentRightColumnContainer.appendChild(commentBottomOptionsContainer);

        return commentRightColumnContainer;
    }
}

class CommentFrame {
    constructor(username, date, content) {
        this.username = username;
        this.date = date;
        this.content = content;
        this.commentTopInfo = new CommentTopInfo(this.username, this.date);
        this.commentMainText = new CommentMainText(this.content);
    }

    getContainer() {
        const commentFrameContainer = document.createElement("div");
        commentFrameContainer.classList.add("comment-frame");

        const commentTopInfoContainer = this.commentTopInfo.getContainer();
        commentFrameContainer.appendChild(commentTopInfoContainer);

        const commentMainTextContainer = this.commentMainText.getContainer();
        commentFrameContainer.appendChild(commentMainTextContainer);

        return commentFrameContainer;
    }
}

class CommentTopInfo {
    constructor(username, date) {
        this.username = username;
        this.date = date;
        this.commentUsername = new CommentUsername(this.username);
        this.commentTime = new CommentTime(this.date);
    }

    getContainer() {
        const commentTopInfoContainer = document.createElement("div");
        commentTopInfoContainer.classList.add("comment-top-info");

        const commentUsernameContainer = this.commentUsername.getContainer();
        commentTopInfoContainer.appendChild(commentUsernameContainer);

        const commentTimeContainer = this.commentTime.getContainer();
        commentTopInfoContainer.appendChild(commentTimeContainer);

        return commentTopInfoContainer;
    }
}

class CommentUsername {
    constructor(username) {
        this.username = username;
    }

    getContainer() {
        const aTag = document.createElement("a");
        aTag.setAttribute("href", `/profile/${this.username}`);
        aTag.classList.add("comment-username");
        aTag.innerHTML = this.username;

        return aTag;
    }
}

class CommentTime {
    constructor(date) {
        this.date = date;
    }

    getContainer() {
        const commentTimeContainer = document.createElement("div");
        commentTimeContainer.classList.add("comment-time");
        commentTimeContainer.innerHTML = this.date;

        return commentTimeContainer;
    }
}

class CommentMainText {
    constructor(content) {
        this.content = content;
    }

    getContainer() {
        const commentMainTextContainer = document.createElement("div");
        commentMainTextContainer.classList.add("comment-main-text");
        commentMainTextContainer.innerHTML = this.content;

        return commentMainTextContainer;
    }
}

class CommentBottomOptions {
    constructor(voteResult) {
        this.voteResult = voteResult;
        this.commentVoting = new CommentVoting(voteResult);
        this.commentReplyButton = new CommentReplyButton();
    }

    getContainer() {
        const commentBottomOptionsContainer = document.createElement("div");
        commentBottomOptionsContainer.classList.add("comment-bottom-options");

        const commentVotingContainer = this.commentVoting.getContainer();
        commentBottomOptionsContainer.appendChild(commentVotingContainer);

        const commentReplyButtonContainer = this.commentReplyButton.getContainer();
        commentBottomOptionsContainer.appendChild(commentReplyButtonContainer);

        return commentBottomOptionsContainer;
    }
}

class CommentVoting {
    constructor(voteResult) {
        this.voteResult = voteResult;
        this.commentVoteUp = new CommentVoteUp();
        this.commentVoteDown = new CommentVoteDown();
        this.commentVoteResult = new CommentVoteResult(this.voteResult);
    }

    getContainer() {
        const commentVotingContainer = document.createElement("div");
        commentVotingContainer.classList.add("comment-voting");

        const commentVoteUpContainer = this.commentVoteUp.getContainer();
        commentVotingContainer.appendChild(commentVoteUpContainer);

        const commentVoteDownContainer = this.commentVoteDown.getContainer();
        commentVotingContainer.appendChild(commentVoteDownContainer);

        const commentVoteResultContainer = this.commentVoteResult.getContainer();
        commentVotingContainer.appendChild(commentVoteResultContainer);

        return commentVotingContainer;
    }
}

class CommentVote {
    constructor() {
        this.svg = new SVG();
    }

    getContainer() {
        const commentVoteContainer = document.createElement("button");

        const svgContainer = this.svg.getContainer();
        commentVoteContainer.appendChild(svgContainer);

        return commentVoteContainer;
    }
}

class CommentVoteUp extends CommentVote {
    constructor() {
        super();
    }

    getContainer() {
        const commentVoteUpContainer = super.getContainer();
        commentVoteUpContainer.classList.add("comment-vote-up");

        return commentVoteUpContainer;
    }
}

class CommentVoteDown extends CommentVote {
    constructor() {
        super();
    }

    getContainer() {
        const commentVoteDownContainer = super.getContainer();
        commentVoteDownContainer.classList.add("comment-vote-down");

        return commentVoteDownContainer;
    }
}

class SVG {
    constructor() {
        
    }

    getContainer() {
        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgElement.setAttribute("viewBox", "0 0 16 16");
        svgElement.setAttribute("aria-hidden", "true");

        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("fill", "none");
        pathElement.setAttribute("stroke", "currentColor");
        pathElement.setAttribute("stroke-linecap", "round");
        pathElement.setAttribute("stroke-width", "2");
        pathElement.setAttribute("d", "M4 6.5l3.6 3.6c.2.2.5.2.7 0L12 6.5");

        svgElement.appendChild(pathElement);

        return svgElement;
    }
}

class CommentVoteResult {
    constructor(voteResult) {
        this.voteResult = voteResult;
    }

    getContainer() {
        const commentVoteResultContainer = document.createElement("div");
        commentVoteResultContainer.classList.add("comment-vote-result");
        commentVoteResultContainer.innerHTML = this.voteResult;

        return commentVoteResultContainer;
    }
}

class CommentReplyButton {
    constructor() {
        
    }

    getContainer() {
        const commentReplyButtonContainer = document.createElement("button");
        commentReplyButtonContainer.classList.add("comment-reply-button");
        commentReplyButtonContainer.innerHTML = "Reply";

        return commentReplyButtonContainer;
    }
}

class ToWhatReply {
    constructor(referenceComment) {
        this.referenceComment = referenceComment;
    }

    getContainer() {
        const toWhatReplyContainer = document.createElement("a");
        toWhatReplyContainer.href = "#" + this.referenceComment.id;
        toWhatReplyContainer.classList.add("to-what-reply-container");

        const username = this.referenceComment.username;
        const content = this.referenceComment.content;
        toWhatReplyContainer.innerHTML = ToWhatReply.formatMessage(username, content, 50);

        return toWhatReplyContainer;
    }

    static formatMessage(username, content, maxContentLength) {
        if (content.length > maxContentLength) {
          const trimmedContent = content.substring(0, maxContentLength - 3) + '...';
          return `${username} wrote: "${trimmedContent}"`;
        }
        else {
          return `${username} wrote: "${content}"`;
        }
    }

    static fromObj(obj) {
        const referenceComment = Comment.fromObj(obj);

        return new ToWhatReply(referenceComment);
    }
}

class Reply {
    constructor(toWhatReply, comment) {
        this.toWhatReply = toWhatReply;
        this.comment = comment;
    }

    getContainer() {
        const replyContainer = document.createElement("div");
        replyContainer.classList.add("reply-container");

        const toWhatReplyContainer = this.toWhatReply.getContainer();
        replyContainer.appendChild(toWhatReplyContainer);

        const commentContainer = this.comment.getContainer();
        replyContainer.appendChild(commentContainer);

        return replyContainer;
    }

    static fromObj(obj) {
        const toWhatReply = ToWhatReply.fromObj(obj.toWhatReply);
        const comment = Comment.fromObj(obj.comment);

        return new Reply(toWhatReply, comment);
    }
}

class Replies {
    constructor(replies) {
        this.replies = replies;
    }

    getContainer() {
        const repliesContainer = document.createElement("div");
        repliesContainer.classList.add("replies-container");

        for (let reply of this.replies) {
            repliesContainer.appendChild(reply.getContainer());
        }

        return repliesContainer;
    }

    static fromArray(array) {
        const replies = [];

        for (let obj of array) {
            let reply = Reply.fromObj(obj);
            replies.push(reply);
        }

        return new Replies(replies);
    }
}

class Conversation {
    constructor(comment, replies) {
        this.comment = comment;
        this.replies = replies;
    }

    getContainer() {
        const conversationContainer = document.createElement("div");
        conversationContainer.classList.add("conversation-container");

        const commentContainer = this.comment.getContainer();
        conversationContainer.appendChild(commentContainer);

        const repliesContainer = this.replies.getContainer();
        conversationContainer.appendChild(repliesContainer);

        return conversationContainer;
    }

    static fromObj(obj) {
        const comment = Comment.fromObj(obj.comment);
        const replies = Replies.fromArray(obj.replies);

        return new Conversation(comment, replies);
    }
}

class Form {
    constructor() {
        
    }

    getContainer() {
        const formElement = document.createElement("form");
        formElement.classList.add("add-comment-form");
      
        const textareaElement = document.createElement("textarea");
        textareaElement.classList.add("new-comment-area");
        textareaElement.name = "newcomment";
        textareaElement.rows = "5";
        textareaElement.required = true;
      
        const buttonContainerElement = document.createElement("div");
        buttonContainerElement.classList.add("acf-button-container");
      
        const okButtonElement = document.createElement("button");
        okButtonElement.classList.add("acf-button", "ok-comment-button");
        okButtonElement.type = "submit";
        okButtonElement.textContent = "OK";
      
        const cancelButtonElement = document.createElement("button");
        cancelButtonElement.classList.add("acf-button", "cancel-comment-button");
        cancelButtonElement.type = "reset";
        cancelButtonElement.textContent = "Cancel";
      
        formElement.appendChild(textareaElement);
        formElement.appendChild(buttonContainerElement);
        buttonContainerElement.appendChild(okButtonElement);
        buttonContainerElement.appendChild(cancelButtonElement);
      
        return formElement;
    }      
}

class AddNewCommentForm extends Form {
    constructor() {
        super();
    }

    getContainer() {
        const formElement = super.getContainer();
        formElement.classList.add("add-new-comment");
        
        return formElement;
    }
}

class AddReplyForm extends Form {
    constructor() {
        super();
    }

    getContainer() {
        const formElement = super.getContainer();
        formElement.classList.add("add-reply");

        return formElement;
    }
}
