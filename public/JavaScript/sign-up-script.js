function getSignUpData() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    return { username, email, password };
}

async function submitSignUpData(callback) {
    try {
        const signUpData = getSignUpData();

        const response = await fetch("/submit-sign-up-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signUpData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }

        const responseData = await response.json();

        callback(responseData);
    }
    catch (error) {
        console.error("Submit sign up data error");
        console.error(error);
    }
}

function showErrorBox(text) {
    document.getElementById("error-box-text").innerHTML = text;
    document.getElementById("header1").style.marginBottom = "33px";
    document.getElementById("sign-up-form").style.marginTop = "33px";
    document.getElementById("error-box").style.display = "flex";
}

function hideErrorBox() {
    document.getElementById("header1").style.marginBottom = "";
    document.getElementById("sign-up-form").style.marginTop = "";
    document.getElementById("error-box").style.display = "none";
}

document.getElementById("error-box-x").addEventListener("click", () => {
    hideErrorBox();
});

document.getElementById("sign-up-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const repeatedPassword = document.getElementById("repeatpassword").value;

    if (password === repeatedPassword) {
        submitSignUpData((responseData) => {
            if (responseData.error) {
                if (responseData.error === "username-already-exists") {
                    showErrorBox("This username already exists");
                }
                else if (responseData.error === "sign-up-error") {
                    showErrorBox("Unexpected error occurred");
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
    }
    else {
        showErrorBox("Passwords don't match");
    }
});