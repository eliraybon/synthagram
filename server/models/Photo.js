const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({ 
  photoUrl: {
    type: String,
    required: true
  },
  body: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  likes: [{ type: Schema.Types.ObjectId, ref: "users" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "comments" }],
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("photos", PhotoSchema);