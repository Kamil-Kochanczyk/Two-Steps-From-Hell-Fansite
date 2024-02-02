const express = require('express');
const router = express.Router();

function loadPage(res, titleArg, templateArg, styleArg, scriptArg, loggedInArg, loggedInUserArg) {
    res.render('index', {
        title: titleArg,
        specificTemplate: templateArg,
        specificStyle: styleArg,
        specificScript: scriptArg,
        loggedIn: loggedInArg,
        loggedInUser: loggedInUserArg
    });
}

router.get('/', (req, res) => {
    loadPage(res, 'Home', 'home', 'home', null, false, null);
});

router.get('/founders', (req, res) => {
    loadPage(res, 'Founders', 'founders', 'founders', null, false, null);
});

router.get('/albums', (req, res) => {
    loadPage(res, 'Albums', 'albums', 'albums', 'albums', false, null);
});

router.get('/news', (req, res) => {
    loadPage(res, 'News', 'news', 'news', null, false, null);
});

module.exports = router;
