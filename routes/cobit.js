var express = require('express');
var router = express.Router();
var session = require('express-session');

/*
 * GET cobits.
 */

var sess;
router.get('/', function (req, res) {
    res.redirect('../cobit/new');
});

router.get("/new", function (req, res) {
    sess = req.session;
    if (sess.username) {
        res.render('index.jade', {coBitData: false, loginData: sess.username});
        res.send("done");
    }
    else{
        res.render('index.jade', {coBitData: false, loginData: false} );
        res.send("done");
    }
});

router.get("/:id", function (req, res) {
    sess = req.session;
    var id = req.params.id;
    var db = req.db;
    var collection = db.get("coBits");

    collection.find({"_id": id}, {}, function (e, docs) {
        if (docs.length === 0) {
            res.render("404");
        }
        else if (e === null) {
            if(sess.username){
                res.render('index.jade', {coBitData: docs[0], loginData: sess.username});
                res.send("done");
            }
           else{
                res.render('index.jade', {coBitData: docs[0], loginData: false});
                res.send("done");
            }
        }
    });
});

router.get("/:id/debug", function (req, res) {
    sess = req.session;
    var id = req.params.id;
    var db = req.db;
    var collection = db.get("coBits");

    collection.find({"_id": id}, {}, function (e, docs) {
        if (docs.length === 0) {
            res.render("404");
        }
        else if (e === null) {
            if(sess.username){
                res.render('debug.jade', {coBitData: docs[0], loginData: sess.username});
                res.send("done");
            }
            else{
                res.render('debug.jade', {coBitData: docs[0], loginData: false});
                res.send("done");
            }
        }
    });
});

router.post('/addCoBit', function (req, res) {

    var db = req.db;

    var jsVal = req.body.jsValue;
    var cssVal = req.body.cssValue;
    var htmlVal = req.body.htmlValue;
    var headVal = req.body.settingsValue;
    var titleVal = req.body.titleValue;
    var libsVal = req.body.libsValue;
    var updateVal = req.body.updateValue;
    var userVal = req.body.user;
    var dateVal = req.body.dateValue;

    var collection = db.get('coBits');
    console.log("update: " + updateVal);
    console.log(updateVal);

    if (updateVal === 'false') {
        collection.insert({
            "js": jsVal,
            "css": cssVal,
            "html": htmlVal,
            "head": headVal,
            "title": titleVal,
            "libraries": libsVal,
            "owner": userVal,
            "date": dateVal
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send(err);
            }
            else {
                console.log(doc);
                console.log(err);
                // And forward to success page
                res.redirect("../cobit/" + doc._id);
                res.send("done");
            }
        });
    }
    else if (updateVal !== 'false') {
        collection.update({"_id": updateVal}, {
            $set: {
                "js": jsVal,
                "css": cssVal,
                "html": htmlVal,
                "head": headVal,
                "title": titleVal,
                "libraries": libsVal
            }
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send(err);
            }
            else {
                console.log(doc);
                // And forward to success page
                res.redirect("../cobit/" + updateVal);
                res.send("done");
            }
        });
    }
});

module.exports = router;