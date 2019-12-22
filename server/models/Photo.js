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

PhotoSchema.statics.postPhoto = (photoUrl, body, user) => {
  const Photo = mongoose.model('photos');
  const User = mongoose.model('users');

  return User.findById(user).then(user => {
    return new Photo({ photoUrl, body, user }).save()
      .then(photo => {
        user.photos.push(photo);
        return user.save()
          .then(user => photo)
      })
  })
}

PhotoSchema.statics.deletePhoto = photoId => {
  const Photo = mongoose.model('photos');
  const User = mongoose.model('users');

  return Photo.findByIdAndDelete(photoId).then(photo => {
    return User.findById(photo.user).then(user => {
      user.photos.pull(photo);
      return user.save()
        .then(user => photo)
    })
  })
}

module.exports = mongoose.model("photos", PhotoSchema);