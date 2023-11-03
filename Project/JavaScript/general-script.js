const showText = "Show menu";
const hideText = "Hide menu";
const widthLimit = 750;

function toggleNavbar() {
    let button = document.getElementById("navbar-toggle");
    let logo = document.getElementById("navbar-logo");
    let nav = document.getElementById("navbar-links");

    logo.classList.toggle("hidden");
    nav.classList.toggle("hidden");

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

    button.innerHTML = showText;
    logo.classList.add("hidden");
    nav.classList.add("hidden");
}

function showHorizontalNavbarElements() {
    let button = document.getElementById("navbar-toggle");
    let logo = document.getElementById("navbar-logo");
    let nav = document.getElementById("navbar-links");

    button.innerHTML = showText;
    logo.classList.remove("hidden");
    nav.classList.remove("hidden");
}

// Flag variable to track if the window size has crossed 700px width
let isWithinLimitFlag = window.innerWidth <= widthLimit;

// Function to handle changes in window size
function handleWindowSizeChange() {
    let windowWidth = window.innerWidth;
    let isWithinLimitNow = windowWidth <= widthLimit;

    // Check if the window size has crossed 700px width
    if (isWithinLimitNow !== isWithinLimitFlag) {
        if (isWithinLimitNow) {
            // Invoke your function when window width is less than or equal to 700px
            hideVerticalNavbarElements();
        }
        else {
            // Invoke another function when window width is greater than 700px
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