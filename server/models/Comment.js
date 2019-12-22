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

//forEach function that allows async-await 
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

//helper function to remove a comment as well as clean-up references
async function removeSingleComment(comment) {
  const Comment = mongoose.model('comments');
  const User = mongoose.model('users');
  const Photo = mongoose.model('photos');

  return Promise.all([
    Comment.findByIdAndDelete(comment._id),
    User.findById(comment.author),
    Photo.findById(comment.photo),
    Comment.findById(comment.parentComment)
  ]).then(([comment, author, photo, parentComment]) => {
    author.comments.pull(comment);
    photo.comments.pull(comment);
    if (parentComment) parentComment.replies.pull(comment);

    if (parentComment) {
      return Promise.all([
        author.save(),
        photo.save(),
        parentComment.save()
      ]).then(([author, photo, parentComment]) => comment)
    } else {
      return Promise.all([
        author.save(),
        photo.save()
      ]).then(([author, photo]) => comment)
    }
  })
}

//function that recursively deletes a comment and all of its replies
async function removeNestedReplies(rootComment) {
  const Comment = mongoose.model('comments');

  if (!rootComment.replies.length) {
    return removeSingleComment(rootComment)
  }

  asyncForEach(rootComment.replies, async (commentId) => {
    const comment = await Comment.findById(commentId);
    await removeNestedReplies(comment);
  })

  return removeSingleComment(rootComment);
}


CommentSchema.statics.deleteComment = commentId => {
  const Comment = mongoose.model('comments');

  return Comment.findById(commentId).then(comment => {
    return removeNestedReplies(comment);
  })
}



module.exports = mongoose.model("comments", CommentSchema);