const mongoose = require("mongoose");
const graphql = require("graphql");
const Comment = mongoose.model("comments");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList
} = graphql;

const CommentType = new GraphQLObjectType({
  name: "CommentType",
  fields: () => ({
    _id: {
      type: GraphQLID
    },
    body: {
      type: GraphQLString
    },
    author: {
      type: require('./user_type'),
      resolve(parentValue) {
        return Comment.findById(parentValue._id)
          .populate('author')
          .then(comment => comment.author)
      }
    },
    photo: {
      type: require('./photo_type'),
      resolve(parentValue) {
        return Comment.findById(parentValue._id)
          .populate('photo')
          .then(comment => comment.photo)
      }
    },
    parentComment: {
      type: CommentType,
      resolve(parentValue) {
        return Comment.findById(parentValue._id)
          .populate('parentComment')
          .then(comment => comment.parentComment)
      }
    },
    replies: {
      type: new GraphQLList(CommentType),
      resolve(parentValue) {
        return Comment.findById(parentValue._id)
          .populate('replies')
          .then(comment => comment.replies)
      }
    }
  })
});

module.exports = CommentType;