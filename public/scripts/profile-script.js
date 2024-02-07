function showErrorBox(errorBoxID, message) {
    const errorBox = document.getElementById(errorBoxID);
    const errorBoxText = errorBox.querySelector(".error-box-text");
    errorBoxText.innerHTML = message;
    errorBox.style.display = "flex";
}

function showSuccessBox(successBoxID, message) {
    const successBox = document.getElementById(successBoxID);
    const successBoxText = successBox.querySelector(".success-box-text");
    successBoxText.innerHTML = message;
    successBox.style.display = "flex";
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
                    throw new Error(responseData.error);
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
                throw new Error(responseData.error);
            }

            if (responseData.newUsername === null) {
                throw new Error("Value returned from server is null");
            }

            if (responseData.usernameAlreadyTaken) {
                showErrorBox("username-error-box", "This username is already taken");
                return;
            }

            const responseUsername = responseData.newUsername;
            usernameContainer.innerHTML = responseUsername;
            editUsernameForm.style.display = "";
            
            showSuccessBox("success-change-box", "Username changed successfully");

            document.getElementById("username-error-box").querySelector(".error-box-x").click();
            
            setTimeout(() => {
                window.location.href = `/profile/${responseUsername}`;
            }, 1000);
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
                    throw new Error(responseData.error);
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
                throw new Error(responseData.error);
            }

            if (responseData.newEmail === null) {
                throw new Error("Value returned from server is null");
            }

            const responseEmail = responseData.newEmail;
            emailContainer.innerHTML = responseEmail;
            editEmailForm.style.display = "";

            showSuccessBox("success-change-box", "Email changed successfully");

            document.getElementById("email-error-box").querySelector(".error-box-x").click();
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
            currentPasswordInputField.value = "";
            newPasswordInputField.value = "";
            repeatNewPasswordInputField.value = "";
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

            const getResponseData = await getResponse.json();

            if (getResponseData.error) {
                throw new Error(getResponseData.error);
            }

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
                throw new Error(postResponseData.error);
            }

            const responsePassword = postResponseData.newPassword;

            if (responsePassword === null) {
                throw new Error("Value returned from server is null");
            }

            if (responsePassword === newPassword) {
                editPasswordForm.style.display = "";

                showSuccessBox("success-change-box", "Password changed successfully");

                document.getElementById("password-error-box").querySelector(".error-box-x").click();
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

function initializeDeleteAccount() {
    const deleteAccountButton = document.getElementById("delete-account");

    deleteAccountButton.addEventListener("click", async () => {
        const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone!");

        if (confirmation) {
            try {
                const response = await fetch("/session-service/delete", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error. Status: ${response.status}`);
                }
        
                const responseData = await response.json();
        
                if (responseData.error) {
                    throw new Error(responseData.error);
                }

                if (responseData.deletedUsers === 1) {
                    window.location.href = "/";
                }
                else {
                    throw new Error('Deleted users count is not 1');
                }
            }
            catch (error) {
                console.error(error);
                showErrorBox("delete-account-error-box", "Unexpected error occurred");
            }
        }
    });
}

function initializeEditUserInfo() {
    initializeEditUsername();
    initializeEditEmail();
    initializeEditPassword();
    initializeDeleteAccount();
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
                successBoxX.parentNode.style.display = "";
            });
        }

        initializeEditUserInfo();
    }
});
