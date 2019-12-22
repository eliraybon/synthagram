const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({ 
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    min: 8,
    max: 32
  },
  profileImg: {
    type: String
  },
  photos: [{ type: Schema.Types.ObjectId, ref: "photos" }],
  likes: [{ type: Schema.Types.ObjectId, ref: "photos" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "comments" }],
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("users", UserSchema);