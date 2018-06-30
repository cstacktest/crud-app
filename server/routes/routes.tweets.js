const { tweets } = require("../models/tweets.js");
const { authenticate } = require("../middleware/authenticate.js");
const { ObjectID } = require("mongodb");
const _ = require("lodash");

module.exports = function (app) {

    app.post("/api/tweets", authenticate, (req, res) => {

        var body = _.pick(req.body, ["text"])

        var newTweet = new tweets({
            text: body.text,
            user: req.user.id
        });

        newTweet.save().then((doc) => {
            console.log(_.omit(doc, ["__v"])+"")
            res.send(doc);
        }, (err) => {
            // console.log(req);
            res.status(400).send(err);
        }).catch((err) => {
            res.status(400).send(err);
        })

    });


    app.get("/api/tweets", authenticate, (req, res) => {

        tweets.find({}, { "__v": 0 }).then((doc) => {
            res.send({
                doc
            });
        }, (err) => {
            res.status(400).send(err);
        }).catch((err) => {
            res.status(400).send(err);
        })

    });


    app.get("/api/tweets/:id", authenticate, (req, res) => {

        if (!ObjectID.isValid(req.params.id)) {
            res.status(400).send({ "error": "Request not valid." });
            return;
        };
        tweets.find({
            _id: req.params.id
        },{"__v":0}).then((doc) => {
            if (doc.length == 0) {
                return res.status(404).send({ "error": "Tweet not found." });
            }
            res.send(
                doc[0]
            );
        }, (err) => {
            res.status(400).send(err);
        }).catch((err) => {
            res.status(400).send(err);
        });

    });


    app.delete("/api/tweets/:id", authenticate, (req, res) => {

        var idToRemove = req.params.id;
        if (!ObjectID.isValid(idToRemove) && idToRemove != "*") {
            return res.status(400).send({ "error": "Request not valid." });

        };

        tweets.remove({
            _id: req.params.id
        }).then((doc) => {
            if (doc.n == 0) {
                return res.status(404).send({ "error": "Tweet not found." });
            }
            res.send({
                "msg":`Deleted one record with id '${req.params.id}'`
            });
        }, (err) => {
            res.status(400).send(err);
        }).catch((err) => {
            res.status(400).send(err);
        });

    });


    app.put("/api/tweets/:id", authenticate, (req, res) => {

        if (!ObjectID.isValid(req.params.id)) {
            return res.status(400).send({ "error": "Request not valid." });

        };

        var body = _.pick(req.body, ["text"])

        tweets.findOneAndUpdate({
            _id: req.params.id
        }, {
                $set: body
            }, {
                new: true
            }).then((doc) => {
                if (!doc) {
                    return res.status(404).send({ "error": "Tweet not found." });
                }
                res.status(200).send(_.omit(doc,["__v"]));
            }, (err) => {
                res.status(400).send(err);
            }).catch((err) => {
                res.status(400).send(err);
            });

    });

}
