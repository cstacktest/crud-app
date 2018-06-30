const { ObjectID } = require("mongodb");
const { tweets } = require("./../../models/tweets.js");

var oid1 = new ObjectID();
var oid2 = new ObjectID();

const newTweets = [{
    _id: oid1,
    "text": "Hello twitter !!!",
    "user":"user1"
}, {
    _id: oid2,
    "text": "this is my second tweet.",
    "user":"user1"
}]

const addTweets = (done) => {
    tweets.remove({}).then(() => {
        return tweets.insertMany(newTweets, (error, docs) => {
            if (error) return done(error);
        });
    }).then(() => {
        done();
    }).catch((err) => {
        console.log(err)
    });
}



module.exports = {
    addTweets,
    newTweets
}