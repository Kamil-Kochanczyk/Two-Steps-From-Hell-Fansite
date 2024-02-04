function showErrorBox(errorBoxID, message) {
    const errorBox = document.getElementById(errorBoxID);
    const errorBoxText = errorBox.querySelector(".error-box-text");
    errorBoxText.innerHTML = message;
    errorBox.style.display = "flex";
}

function createLink(mainLink, queryArgs) {
    const queryString = Object.entries(queryArgs).map(([key, value]) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }).join('&');
  
    return `${mainLink}?${queryString}`;
}

async function createReloadLink(additionalQueryArgs) {
    try {
        const response = await fetch("/session-service/username");

        if (!response.ok) {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }

        const responseData = await response.json();

        if (responseData.error) {
            throw responseData.error;
        }

        const mainLink = "./profile";
        const requiredQueryArgs = { username: responseData.username };
        const queryArgs = { ...requiredQueryArgs, ...additionalQueryArgs };
        return createLink(mainLink, queryArgs);
    }
    catch (error) {
        throw error;
    }
}

function initializeEditUsername() {
    const editUsernameButton = document.getElementById("edit-username");
    const editUsernameForm = document.getElementById("edit-username-form");
    const newUsernameInputField = document.getElementById("newusername");
    const usernameContainer = document.getElementById("username-container");
    const cancelNewUsernameButton = document.getElementById("cancel-new-username");

    editUsernameButton.addEventListener("click", async () => {
        if (editUsernameForm.style.display !== "flex") {
            try {
                const response = await fetch("/session-service/username");

                if (!response.ok) {
                    throw new Error(`HTTP error. Status: ${response.status}`);
                }
        
                const responseData = await response.json();
        
                if (responseData.error) {
                    throw responseData.error;
                }

                const username = responseData.username;
                newUsernameInputField.value = username;
                editUsernameForm.style.display = "flex";
            }
            catch (error) {
                console.error(error);
                showErrorBox("username-error-box", "Unexpected error occurred");
            }
        }
    });

    editUsernameForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const newUsername = newUsernameInputField.value;

            const response = await fetch("/session-service/edit/username", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newValue: newUsername })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error. Status: ${response.status}`);
            }
    
            const responseData = await response.json();
    
            if (responseData.error) {
                throw responseData.error;
            }

            if (responseData.newUsername === null) {
                throw new Error("Value returned from server is null");
            }

            const responseUsername = responseData.newUsername;
            usernameContainer.innerHTML = responseUsername;
            editUsernameForm.style.display = "";
            
            window.location.href = await createReloadLink({ usernameChanged: true });
        }
        catch (error) {
            console.error(error);
            showErrorBox("username-error-box", "Unexpected error occurred");
        }
    });

    cancelNewUsernameButton.addEventListener("click", () => {
        editUsernameForm.style.display = "";
        
        const usernameErrorBox = document.getElementById("username-error-box");

        if (usernameErrorBox.style.display === "flex") {
            usernameErrorBox.querySelector(".error-box-x").click();
        }
    });
}

function initializeEditEmail() {
    const editEmailButton = document.getElementById("edit-email");
    const editEmailForm = document.getElementById("edit-email-form");
    const newEmailInputField = document.getElementById("newemail");
    const emailContainer = document.getElementById("email-container");
    const cancelNewEmailButton = document.getElementById("cancel-new-email");

    editEmailButton.addEventListener("click", async () => {
        if (editEmailForm.style.display !== "flex") {
            try {
                const response = await fetch("/session-service/email");

                if (!response.ok) {
                    throw new Error(`HTTP error. Status: ${response.status}`);
                }
        
                const responseData = await response.json();
        
                if (responseData.error) {
                    throw responseData.error;
                }

                const email = responseData.email;
                newEmailInputField.value = email;
                editEmailForm.style.display = "flex";
            }
            catch (error) {
                console.error(error);
                showErrorBox("email-error-box", "Unexpected error occurred");
            }
        }
    });

    editEmailForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const newEmail = newEmailInputField.value;

            const response = await fetch("/session-service/edit/email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newValue: newEmail })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error. Status: ${response.status}`);
            }
    
            const responseData = await response.json();
    
            if (responseData.error) {
                throw responseData.error;
            }

            if (responseData.newEmail === null) {
                throw new Error("Value returned from server is null");
            }

            const responseEmail = responseData.newEmail;
            emailContainer.innerHTML = responseEmail;
            editEmailForm.style.display = "";

            window.location.href = await createReloadLink({ emailChanged: true });
        }
        catch (error) {
            console.error(error);
            showErrorBox("email-error-box", "Unexpected error occurred");
        }
    });

    cancelNewEmailButton.addEventListener("click", () => {
        editEmailForm.style.display = "";
        
        const emailErrorBox = document.getElementById("email-error-box");

        if (emailErrorBox.style.display === "flex") {
            emailErrorBox.querySelector(".error-box-x").click();
        }
    });
}

function initializeEditPassword() {
    const editPasswordButton = document.getElementById("edit-password");
    const editPasswordForm = document.getElementById("edit-password-form");
    const currentPasswordInputField = document.getElementById("currentpassword");
    const newPasswordInputField = document.getElementById("newpassword");
    const repeatNewPasswordInputField = document.getElementById("repeatnewpassword");
    const cancelNewPasswordButton = document.getElementById("cancel-new-password");

    editPasswordButton.addEventListener("click", () => {
        if (editPasswordForm.style.display !== "flex") {
            editPasswordForm.style.display = "flex";
        }
    });

    editPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const currentPassword = currentPasswordInputField.value;
            const newPassword = newPasswordInputField.value;
            const repeatedNewPassword = repeatNewPasswordInputField.value;

            const getResponse = await fetch("/session-service/password");

            if (!getResponse.ok) {
                throw new Error(`HTTP error. Status: ${getResponse.status}`);
            }
    
            if (getResponse.error) {
                throw getResponse.error;
            }

            const getResponseData = await getResponse.json();

            if (getResponseData.password !== currentPassword) {
                showErrorBox("password-error-box", "Incorrect current password value");
                return;
            }

            if (newPassword !== repeatedNewPassword) {
                showErrorBox("password-error-box", "New password and repeated new password are not the same");
                return;
            }

            const postResponse = await fetch("/session-service/edit/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newValue: newPassword })
            });
    
            if (!postResponse.ok) {
                throw new Error(`HTTP error. Status: ${postResponse.status}`);
            }
    
            const postResponseData = await postResponse.json();
    
            if (postResponseData.error) {
                throw postResponseData.error;
            }

            const responsePassword = postResponseData.newPassword;

            if (responsePassword === null) {
                throw new Error("Value returned from server is null");
            }

            if (responsePassword === newPassword) {
                editPasswordForm.style.display = "";

                window.location.href = await createReloadLink({ passwordChanged: true });
            }
            else {
                throw new Error('Incorrect response from server');
            }
        }
        catch (error) {
            console.error(error);
            showErrorBox("password-error-box", "Unexpected error occurred");
        }
    });

    cancelNewPasswordButton.addEventListener("click", () => {
        editPasswordForm.style.display = "";
        
        const passwordErrorBox = document.getElementById("password-error-box");

        if (passwordErrorBox.style.display === "flex") {
            passwordErrorBox.querySelector(".error-box-x").click();
        }
    });
}

function initializeEditUserInfo() {
    initializeEditUsername();
    initializeEditEmail();
    initializeEditPassword();
}

document.addEventListener("DOMContentLoaded", () => {
    const editUserInfoSection = document.getElementById("edit-user-info");

    if (editUserInfoSection) {
        document.getElementById("forgot-password").addEventListener("click", () => {
            alert("Recover password funcionality has not been implemented yet");
        });
        
        Array.from(document.querySelectorAll(".error-box-x")).forEach(x => {
            x.addEventListener("click", () => {
                x.parentNode.style.display = "";
            });
        });

        const successBoxX = document.querySelector(".success-box-x");

        if (successBoxX) {
            successBoxX.addEventListener("click", () => {
                successBoxX.parentNode.style.display = "none";
            });
        }

        initializeEditUserInfo();
    }
});
