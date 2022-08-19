const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Post Schema
const PostSchema = new Schema({
  title: String,
  text: String,
  whoCreated: String,
  image: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// Post Model
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
