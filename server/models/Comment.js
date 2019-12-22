const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({ 
  body: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  photo: {
    type: Schema.Types.ObjectId,
    ref: "photos",
    required: true
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: "comments",
  },
  replies: [{ type: Schema.Types.ObjectId, ref: "comments" }],
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("comments", CommentSchema);