class SetUpHelper {
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

function getAlbums() {
    const invincible = document.getElementById("invincible");
    const archangel = document.getElementById("archangel");
    const skyworld = document.getElementById("skyworld");
    const classicsVolume1 = document.getElementById("classics-volume-1");
    const miracles = document.getElementById("miracles");
    const battlecry = document.getElementById("battlecry");
    const classicsVolume2 = document.getElementById("classics-volume-2");
    const vanquish = document.getElementById("vanquish");
    const unleashed = document.getElementById("unleashed");
    const dragon = document.getElementById("dragon");
    const myth = document.getElementById("myth");

    return [
        invincible,
        archangel,
        skyworld,
        classicsVolume1,
        miracles,
        battlecry,
        classicsVolume2,
        vanquish,
        unleashed,
        dragon,
        myth
    ];
}

function getColumns() {
    const col1 = document.getElementById("col1");
    const col2 = document.getElementById("col2");
    const col3 = document.getElementById("col3");
    const col4 = document.getElementById("col4");

    return [col1, col2, col3, col4];
}

function setUpGallery() {
    const maxWidthFor1Col = 700;
    const maxWidthFor2Cols = 1350;

    let windowWidth = window.innerWidth;
    let helpers;

    if (windowWidth <= maxWidthFor1Col) {
        helpers = setUpColumns(1);
    }
    else if (windowWidth > maxWidthFor1Col && windowWidth <= maxWidthFor2Cols) {
        helpers = setUpColumns(2);
    }
    else {
        helpers = setUpColumns(4);
    }

    for (const helper of helpers) {
        helper.append();
    }
}

function setUpColumns(howMany) {
    const [
        invincible,
        archangel,
        skyworld,
        classicsVolume1,
        miracles,
        battlecry,
        classicsVolume2,
        vanquish,
        unleashed,
        dragon,
        myth
    ] = getAlbums();

    const [col1, col2, col3, col4] = getColumns();

    let helper1, helper2, helper3, helper4;

    if (howMany === 1) {
        helper1 = new SetUpHelper(col1, [invincible, archangel, skyworld]);
        helper2 = new SetUpHelper(col2, [classicsVolume1, miracles, battlecry]);
        helper3 = new SetUpHelper(col3, [classicsVolume2, vanquish, unleashed]);
        helper4 = new SetUpHelper(col4, [dragon, myth]);
    }
    else if (howMany === 2) {
        helper1 = new SetUpHelper(col1, [invincible, skyworld, miracles]);
        helper2 = new SetUpHelper(col2, [archangel, classicsVolume1, battlecry]);
        helper3 = new SetUpHelper(col3, [classicsVolume2, unleashed, myth]);
        helper4 = new SetUpHelper(col4, [vanquish, dragon]);
    }
    else if (howMany === 4) {
        helper1 = new SetUpHelper(col1, [invincible, miracles, unleashed]);
        helper2 = new SetUpHelper(col2, [archangel, battlecry, dragon]);
        helper3 = new SetUpHelper(col3, [skyworld, classicsVolume2, myth]);
        helper4 = new SetUpHelper(col4, [classicsVolume1, vanquish]);
    }

    return [helper1, helper2, helper3, helper4];
}

document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("resize", () => {
        setUpGallery();
    })

    setUpGallery();
})
