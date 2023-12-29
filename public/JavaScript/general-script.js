function toggleNavDropdown() {
    document.getElementById("nav-dropdown-content").classList.toggle("show-block");
}

document.getElementById("avatar-container").addEventListener("click", toggleNavDropdown);

window.onclick = (e) => {
    let clickedImg = e.target.matches("#avatar-container img");
    let clickedFa = e.target.matches("#avatar-container .fa");
    let clickedDiv = e.target.matches("#avatar-container");

    if (!clickedImg && !clickedFa && !clickedDiv) {
        let navDropdown = document.getElementById("nav-dropdown-content");

        if (navDropdown.classList.contains("show-block")) {
            navDropdown.classList.remove("show-block");
        }
    }
}

const showText = "Show menu";
const hideText = "Hide menu";
const widthLimit = 750;

function toggleNavbar() {
    let button = document.getElementById("navbar-toggle");
    let logo = document.getElementById("navbar-logo");
    let nav = document.getElementById("navbar-links");
    let userOptions = document.getElementById("user-options-container");

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
    let button = document.getElementById("navbar-toggle");
    let logo = document.getElementById("navbar-logo");
    let nav = document.getElementById("navbar-links");
    let userOptions = document.getElementById("user-options-container");

    button.innerHTML = showText;
    logo.classList.add("hidden");
    nav.classList.add("hidden");
    userOptions.classList.add("hidden");
}

function showHorizontalNavbarElements() {
    let button = document.getElementById("navbar-toggle");
    let logo = document.getElementById("navbar-logo");
    let nav = document.getElementById("navbar-links");
    let userOptions = document.getElementById("user-options-container");

    button.innerHTML = showText;
    logo.classList.remove("hidden");
    nav.classList.remove("hidden");
    userOptions.classList.remove("hidden");
}

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

// Event listener for window resize
window.addEventListener("resize", handleWindowSizeChange);

function setNavbarElementsOnPageLoad() {
    let windowWidth = window.innerWidth;

    if (windowWidth <= widthLimit) {
        hideVerticalNavbarElements();
    }
}

// Initial invocation to check the window size on page load
setNavbarElementsOnPageLoad();