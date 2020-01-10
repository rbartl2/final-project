const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({ comment: String, username: String })
const postSchema = new Schema({
  username: String,
  body: String,
  comments: [commentSchema]
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;