const showText = "Show menu";
const hideText = "Hide menu";

function toggleNavbar() {
    const button = document.getElementById("navbar-toggle");
    const logo = document.getElementById("navbar-logo");
    const nav = document.getElementById("navbar-links");
    const userOptions = document.getElementById("user-options-container");

    logo.classList.toggle("hidden");
    nav.classList.toggle("hidden");
    userOptions.classList.toggle("hidden");

    if (button.innerHTML == showText) {
        button.innerHTML = hideText;
    }
    else {
        button.innerHTML = showText;
    }
}

function hideVerticalNavbarElements() {
    const button = document.getElementById("navbar-toggle");
    const logo = document.getElementById("navbar-logo");
    const nav = document.getElementById("navbar-links");
    const userOptions = document.getElementById("user-options-container");

    button.innerHTML = showText;
    logo.classList.add("hidden");
    nav.classList.add("hidden");
    userOptions.classList.add("hidden");
}

function showHorizontalNavbarElements() {
    const button = document.getElementById("navbar-toggle");
    const logo = document.getElementById("navbar-logo");
    const nav = document.getElementById("navbar-links");
    const userOptions = document.getElementById("user-options-container");

    button.innerHTML = showText;
    logo.classList.remove("hidden");
    nav.classList.remove("hidden");
    userOptions.classList.remove("hidden");
}

// Width threshold for navbar style change
const widthLimit = 750;

// Flag variable to track if the window size has crossed 750px width
let isWithinLimitFlag = window.innerWidth <= widthLimit;

// Function to handle changes in window size
function handleWindowSizeChange() {
    let windowWidth = window.innerWidth;
    let isWithinLimitNow = windowWidth <= widthLimit;

    // Check if the window size has crossed 750px width
    if (isWithinLimitNow !== isWithinLimitFlag) {
        if (isWithinLimitNow) {
            // Invoke your function when window width is less than or equal to 750px
            hideVerticalNavbarElements();
        }
        else {
            // Invoke another function when window width is greater than 750px
            showHorizontalNavbarElements();
        }

        // Update the flag variable
        isWithinLimitFlag = isWithinLimitNow;
    }
}

function setNavbarElementsOnPageLoad() {
    let windowWidth = window.innerWidth;

    if (windowWidth <= widthLimit) {
        hideVerticalNavbarElements();
    }
}

async function logOut() {
    try {
        const response = await fetch("/session-service/log-out", {
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

        return responseData;
    }
    catch (error) {
        throw error;
    }
}

window.onload = () => {
    const navDropdown = document.getElementById("nav-dropdown");

    if (navDropdown) {
        const avatarContainer = document.getElementById("avatar-container");

        avatarContainer.addEventListener("click", () => {
            document.getElementById("nav-dropdown-content").classList.toggle("show-block");
        });

        window.onclick = (e) => {
            const clickedImg = e.target.matches("#avatar-container img");
            const clickedFa = e.target.matches("#avatar-container .fa");
            const clickedDiv = e.target.matches("#avatar-container");
        
            if (!clickedImg && !clickedFa && !clickedDiv) {
                const navDropdownContent = document.getElementById("nav-dropdown-content");
        
                if (navDropdownContent.classList.contains("show-block")) {
                    navDropdownContent.classList.remove("show-block");
                }
            }
        }

        const logOutButton = document.getElementById("log-out");

        logOutButton.addEventListener("click", async () => {
            try {
                const responseData = await logOut();
                console.table(responseData);
            }
            catch (error) {
                console.error(error);
            }
        })
    }

    window.onresize = () => {
        handleWindowSizeChange();
    }

    setNavbarElementsOnPageLoad();
}
