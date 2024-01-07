class Comment {
    constructor(id, username, date, content) {
        this.id = id;
        this.username = username;
        this.date = date;
        this.content = content;
        this.voteResult = 0;
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
}

class CommentAvatar {
    constructor() {
        this.img = "./Images/avatar-placeholder.jpg";
        this.alt = "avatar";
    }

    getContainer() {
        const commentAvatarContainer = document.createElement("div");
        commentAvatarContainer.classList.add("comment-avatar");

        const img = document.createElement("img");
        img.src = this.img;
        img.alt = this.alt

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
        aTag.setAttribute("href", "./profile");
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
    constructor(id, referenceComment) {
        this.id = id;
        this.referenceComment = referenceComment;
    }

    getContainer() {
        const toWhatReplyContainer = document.createElement("div");
        toWhatReplyContainer.classList.add("to-what-reply-container");

        const username = this.referenceComment.username;
        const content = this.referenceComment.content;
        toWhatReplyContainer.innerHTML = ToWhatReply.formatMessage(username, content, 50);

        return toWhatReplyContainer;
    }

    static formatMessage(username, content, maxContentLength) {
        if (content.length > maxContentLength) {
          const trimmedContent = content.substring(0, maxContentLength - 3) + '...';
          return `${username} wrote: ${trimmedContent}`;
        }
        else {
          return `${username} wrote: ${content}`;
        }
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
}