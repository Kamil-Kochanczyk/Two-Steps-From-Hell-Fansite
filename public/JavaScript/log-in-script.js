function getLogInData() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    return { username, password };
}

async function submitLogInData(callback) {
    try {
        const logInData = getLogInData();

        const response = await fetch("/submit-log-in-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(logInData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }

        const responseData = await response.json();

        callback(responseData);
    }
    catch (error) {
        console.error("Submit log in data error");
        console.error(error);
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

document.getElementById("error-box-x").addEventListener("click", () => {
    hideErrorBox();
});

document.getElementById("log-in-form").addEventListener("submit", (e) => {
    e.preventDefault();

    submitLogInData((responseData) => {
        if (responseData.error) {
            if (responseData.error === "database-not-found") {
                showErrorBox("Unexpected error occurred");
            }
            else if (responseData.error === "username-not-found") {
                showErrorBox("This username doesn't exist")
            }
            else if (responseData.error === "incorrect-password") {
                showErrorBox("Incorrect password");
            }
        }
        else {
            window.location.href = "./";

            // console.table(responseData);
            
            // setTimeout(() => {
            //     window.location.href = "./";
            // }, 5000);
        }
    });
});