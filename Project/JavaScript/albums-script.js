let invincible = document.getElementById("invincible");
let archangel = document.getElementById("archangel");
let skyworld = document.getElementById("skyworld");
let classicsVolume1 = document.getElementById("classics-volume-1");
let miracles = document.getElementById("miracles");
let battlecry = document.getElementById("battlecry");
let classicsVolume2 = document.getElementById("classics-volume-2");
let vanquish = document.getElementById("vanquish");
let unleashed = document.getElementById("unleashed");
let dragon = document.getElementById("dragon");
let myth = document.getElementById("myth");

let col1 = document.getElementById("col1");
let col2 = document.getElementById("col2");
let col3 = document.getElementById("col3");
let col4 = document.getElementById("col4");

const maxWidthFor1Col = 700;
const maxWidthFor2Cols = 1350;

class setUpHelper {
    constructor(col, imgs) {
        this._col = col;
        this._imgs = imgs;
    }

    append() {
        for (const img of this._imgs) {
            this._col.appendChild(img);
        }
    }
}

function setUpGallery() {
    windowWidth = window.innerWidth;
    let helpers;

    if (windowWidth <= maxWidthFor1Col) {
        helpers = setUp1Column();
    }
    else if (windowWidth > maxWidthFor1Col && windowWidth <= maxWidthFor2Cols) {
        helpers = setUp2Columns();
    }
    else {
        helpers = setUp4Columns();
    }

    for (const helper of helpers) {
        helper.append();
    }
}

function setUp1Column() {
    helper1 = new setUpHelper(col1, [invincible, archangel, skyworld]);
    helper2 = new setUpHelper(col2, [classicsVolume1, miracles, battlecry]);
    helper3 = new setUpHelper(col3, [classicsVolume2, vanquish, unleashed]);
    helper4 = new setUpHelper(col4, [dragon, myth]);

    helpers = [helper1, helper2, helper3, helper4];

    return helpers;
}

function setUp2Columns() {
    helper1 = new setUpHelper(col1, [invincible, skyworld, miracles]);
    helper2 = new setUpHelper(col2, [archangel, classicsVolume1, battlecry]);
    helper3 = new setUpHelper(col3, [classicsVolume2, unleashed, myth]);
    helper4 = new setUpHelper(col4, [vanquish, dragon]);

    helpers = [helper1, helper2, helper3, helper4];

    return helpers;
}

function setUp4Columns() {
    helper1 = new setUpHelper(col1, [invincible, miracles, unleashed]);
    helper2 = new setUpHelper(col2, [archangel, battlecry, dragon]);
    helper3 = new setUpHelper(col3, [skyworld, classicsVolume2, myth]);
    helper4 = new setUpHelper(col4, [classicsVolume1, vanquish]);

    helpers = [helper1, helper2, helper3, helper4];

    return helpers;
}

window.addEventListener("resize", setUpGallery);

setUpGallery();