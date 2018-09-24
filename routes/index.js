var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', function(req, res){
    res.render('index');
});
// How It Works
router.get('/How-It-Works',function(req, res){
    res.render('how');
});

// Sell Books
router.get('/Sell-Books',function(req, res){
    res.render('sell');
});

// Buy Books
router.get('/Buy-Books',function(req, res){
    res.render('buy');
});

// News 
router.get('/News',function(req, res){
    res.render('news');
});

// Help And Safety 
router.get('/Help-And-Safety',function(req, res){
    res.render('help');
});


module.exports = router;