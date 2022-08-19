const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  postId: String,
  text: String,
  name: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// Post Model
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
