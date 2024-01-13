document.addEventListener("DOMContentLoaded", () => {
    initializeProfilePage();
});

async function initializeProfilePage() {
    try {
        const response = await fetch("/get-profile-user");

        if (!response.ok) {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }

        const profileUser = await response.json();

        if (!profileUser) {
            throw "Missing data";
        }

        const username = profileUser.username;
        const email = profileUser.email;

        document.getElementById("username-container").innerHTML = username;
        document.getElementById("email-container").innerHTML = email;
    }
    catch (error) {
        console.error(error);
    }
}