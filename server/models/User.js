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

sortByDate = (photos) => {
  if (photos.length < 2) return photos;

  const pivot = photos[0];
  let left = photos.slice(1).filter(photo => photo.created > pivot.created);
  let right = photos.slice(1).filter(photo => photo.created <= pivot.created);
  left = sortByDate(left);
  right = sortByDate(right);

  return left.concat([pivot]).concat(right);
} 

UserSchema.statics.feed = currentUserId => {
  const User = mongoose.model('users');
  //you need to find a way to sort the returned photos from newest to oldest
  return User.findById(currentUserId)
    .populate('photos')
    .populate({path: 'followedUsers', populate: { path: 'photos' }})
    .then(user => {
      const feedPhotos = [];

      user.followedUsers.forEach(followedUser => {
        followedUser.photos.forEach(photo => {
          feedPhotos.push(photo);
        })
      })

      user.photos.forEach(photo => {
        feedPhotos.push(photo);
      })

      return sortByDate(feedPhotos);
    })
}

module.exports = mongoose.model("users", UserSchema);