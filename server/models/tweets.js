const mongoose = require("mongoose");

var TweetSchema = new mongoose.Schema({
    text: {
        required: true,
        type: String,
        minlength: 1,
        maxlength: 280,
        trim: true
    },
    user: {
        required: true,
        type: String,
        minlength: 1,
        trim: true
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
})

var tweets = mongoose.model("tweets", TweetSchema);

module.exports = {
    tweets
}
