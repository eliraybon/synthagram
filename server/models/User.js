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
  followers: [{ type: Schema.Types.ObjectId, ref: "users"}],
  followedUsers: [{ type: Schema.Types.ObjectId, ref: "users" }],
  created: {
    type: Date,
    default: Date.now
  }
});

UserSchema.statics.addFollow = (followingId, userId) => {
  const User = mongoose.model('users');

  return Promise.all([User.findById(followingId), User.findById(userId)])
    .then(([followee, user]) => {
      followee.followers.push(user);
      user.followedUsers.push(followee);

      return Promise.all([followee.save(), user.save()])
        .then(([followee, user]) => followee);
    })
}

UserSchema.statics.removeFollow = (unfollowingId, userId) => {
  const User = mongoose.model('users');

  return Promise.all([User.findById(unfollowingId), User.findById(userId)])
    .then(([unfollowee, user]) => {
      unfollowee.followers.pull(user);
      user.followedUsers.pull(unfollowee);

      return Promise.all([unfollowee.save(), user.save()])
        .then(([unfollowee, user]) => unfollowee);
    })
}

module.exports = mongoose.model("users", UserSchema);