const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({ 
  body: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  photo: {
    type: Schema.Types.ObjectId,
    ref: "photos"
  },
  replies: [{ type: Schema.Types.ObjectId, ref: "comments" }],
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("comments", CommentSchema);