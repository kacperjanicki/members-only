const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
});
module.exports = mongoose.model("Post", postSchema);
