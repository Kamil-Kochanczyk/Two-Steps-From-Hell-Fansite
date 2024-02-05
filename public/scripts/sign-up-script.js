function getSignUpData() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    return { username, email, password };
}

async function submitSignUpData() {
    try {
        const signUpData = getSignUpData();

        const response = await fetch("/sign-up-service/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signUpData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }

        const responseData = await response.json();

        if (responseData.error) {
            throw new Error(responseData.error);
        }

        return responseData;
    }
    catch (error) {
        throw error;
    }
}

function showErrorBox(message) {
    document.getElementById("error-box-text").innerHTML = message;
    document.getElementById("header1").style.marginBottom = "33px";
    document.getElementById("sign-up-form").style.marginTop = "33px";
    document.getElementById("error-box").style.display = "flex";
}

function hideErrorBox() {
    document.getElementById("header1").style.marginBottom = "";
    document.getElementById("sign-up-form").style.marginTop = "";
    document.getElementById("error-box").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("error-box-x").addEventListener("click", () => {
        hideErrorBox();
    });

    document.getElementById("sign-up-form").addEventListener("submit", async (e) => {
        e.preventDefault();
    
        const password = document.getElementById("password").value;
        const repeatedPassword = document.getElementById("repeatpassword").value;
    
        if (password === repeatedPassword) {
            try {
                const responseData = await submitSignUpData();
                console.table(responseData);
                window.location.href = "/";
            }
            catch (error) {
                if (error.message === "username-already-exists") {
                    showErrorBox("This username already exists");
                }
                else if (error.message === "sign-up-service-submit-error") {
                    showErrorBox("Server error");
                }
                else {
                    showErrorBox("Unexpected error occurred");
                }
            }
        }
        else {
            showErrorBox("Passwords don't match");
        }
    });
});
