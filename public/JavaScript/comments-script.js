import { 
    Comment, 
    CommentAvatar, 
    CommentRightColumn, 
    CommentFrame, 
    CommentTopInfo, 
    CommentUsername, 
    CommentTime, 
    CommentMainText, 
    CommentBottomOptions, 
    CommentVoting, 
    CommentVote, 
    CommentVoteUp, 
    CommentVoteDown, 
    SVG, 
    CommentVoteResult, 
    CommentReplyButton, 
    ToWhatReply, 
    Reply, 
    Replies, 
    Conversation, 
    Form, 
    AddNewCommentForm, 
    AddReplyForm 
} from "./comments-template-script.js";

document.addEventListener("DOMContentLoaded", () => {
    initializeCommentsPage();
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

        initializePostedCommentsSection();
    }
    catch (error) {
        console.error(error);
        console.table(error);
    }
}

async function getLoggedUser() {
    try {
        const response = await fetch("/get-active-user");

        if (!response.ok) {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }

        const loggedUser = await response.json();

        return loggedUser;
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

        const textArea = addNewCommentFormContainer.querySelector(".new-comment-area");
        const content = textArea.value;

        const newCommentData = { username, date, content };

        try {
            const response = await fetch("/add-new-comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCommentData)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error. Status: ${response.status}`);
            }
    
            const commentObj = await response.json();
            const newComment = new Comment(commentObj.id, commentObj.username, commentObj.date, commentObj.content, commentObj.voteResult);
            const replies = new Replies([]);

            const newConversation = new Conversation(newComment, replies);
            const newConversationContainer = newConversation.getContainer();

            const postedCommentsContainer = document.getElementById("posted-comments-container");
            postedCommentsContainer.prepend(newConversationContainer);
        }
        catch (error) {
            throw error;
        }
    });

    const cancelButton = addNewCommentFormContainer.querySelector(".cancel-comment-button");

    cancelButton.addEventListener("click", () => {
        const textArea = addNewCommentFormContainer.querySelector(".new-comment-area");
        textArea.value = "";
    });

    const section = document.getElementById("first-section");
    section.appendChild(addNewCommentFormContainer);
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

async function initializePostedCommentsSection() {
    try {
        const response = await fetch("/get-all-conversations");

        if (!response.ok) {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }

        const allConversations = await response.json();

        if (allConversations.error) {
            throw allConversations;
        }

        const postedCommentsContainer = document.getElementById("posted-comments-container");

        for (let conversationObj of allConversations) {
            const newConversation = Conversation.fromObj(conversationObj);
            const newConversationContainer = newConversation.getContainer();
            postedCommentsContainer.prepend(newConversationContainer);
        }
    }
    catch (error) {
        throw error;
    }
}