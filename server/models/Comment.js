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

CommentSchema.statics.createComment = (body, author, photo, parentCommentId) => {
  const Comment = mongoose.model('comments');
  const Photo = mongoose.model('photos');
  const User = mongoose.model('users');

  return Promise.all([
    User.findById(author),
    Photo.findById(photo),
    Comment.findById(parentCommentId)
  ]).then(([author, photo, parentComment]) => {
    return new Comment({ body, author, photo, parentComment: parentCommentId }).save()
      .then(comment => {
        author.comments.push(comment);
        photo.comments.push(comment);
        if (parentComment) parentComment.replies.push(comment);

        if (parentComment) {
          return Promise.all([author.save(), photo.save(), parentComment.save()])
            .then(([author, photo, parentComment]) => comment)
        } else {
          return Promise.all([author.save(), photo.save()])
            .then(([author, photo]) => comment)
        }
      })
  })
}

module.exports = mongoose.model("comments", CommentSchema);