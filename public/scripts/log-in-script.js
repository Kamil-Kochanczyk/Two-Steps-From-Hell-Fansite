function getLogInData() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    return { username, password };
}

async function submitLogInData() {
    try {
        const logInData = getLogInData();

        const response = await fetch("/session-service/log-in", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(logInData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }

        const responseData = await response.json();

        if (responseData.error) {
            throw responseData.error;
        }

        return responseData;
    }
    catch (error) {
        throw error;
    }
}

function showErrorBox(text) {
    document.getElementById("error-box-text").innerHTML = text;
    document.getElementById("header1").style.marginBottom = "33px";
    document.getElementById("log-in-form").style.marginTop = "33px";
    document.getElementById("error-box").style.display = "flex";
}

function hideErrorBox() {
    document.getElementById("header1").style.marginBottom = "";
    document.getElementById("log-in-form").style.marginTop = "";
    document.getElementById("error-box").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("forgot-password").addEventListener("click", () => {
        alert("Recover password funcionality has not been implemented yet");
    });

    document.getElementById("error-box-x").addEventListener("click", () => {
        hideErrorBox();
    });

    document.getElementById("log-in-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const responseData = await submitLogInData();
            console.table(responseData);
            window.location.href = "/";
        }
        catch (error) {
            if (error === "username-not-found") {
                showErrorBox("This username doesn't exist");
            }
            else if (error === "incorrect-password") {
                showErrorBox("Incorrect password");
            }
            else {
                showErrorBox("Unexpected error occurred");
            }
        }
    });
});
