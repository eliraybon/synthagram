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
    type: String,
    default: 'https://us.123rf.com/450wm/burntime555/burntime5551505/burntime555150500105/40328001-music-note-flat-web-icon-or-sign-isolated-on-grey-background-collection-modern-trend-concept-design-.jpg?ver=6'
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

sortByDate = photos => {
  if (photos.length < 2) return photos;

  const pivotPhoto = photos[0];
  let older = photos.slice(1).filter(photo => photo.created > pivotPhoto.created);
  let newer = photos.slice(1).filter(photo => photo.created <= pivotPhoto.created);
  older = sortByDate(older);
  newer = sortByDate(newer);

  return older.concat([pivotPhoto]).concat(newer);
} 

UserSchema.statics.feed = currentUserId => {
  const User = mongoose.model('users');
  
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

UserSchema.statics.addProfileImg = (userId, imgUrl) => {
  const User = mongoose.model('users');
  
  return User.findById(userId).then(user => {
    user.profileImg = imgUrl;
    return user.save();
  })
}

module.exports = mongoose.model("users", UserSchema);