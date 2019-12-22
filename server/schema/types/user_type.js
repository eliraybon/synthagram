const mongoose = require("mongoose");
const graphql = require("graphql");
const User = mongoose.model("users");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLList
} = graphql;

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    _id: {
      type: GraphQLID
    },
    username: {
      type: GraphQLString
    },
    profileImg: {
      type: GraphQLString
    },
    token: {
        type: GraphQLString
      },
    loggedIn: {
      type: GraphQLBoolean
    },
    photos: {
      type: new GraphQLList(require('./photo_type')),
      resolve(parentValue) {
        return User.findById(parentValue._id)
          .populate('photos')
          .then(user => user.photos)
      }
    },
    likes: {
      type: new GraphQLList(require('./photo_type')),
      resolve(parentValue) {
        return User.findById(parentValue._id)
          .populate('likes')
          .then(user => user.likes)
      }
    },
    comments: {
      type: new GraphQLList(require('./comment_type')),
      resolve(parentValue) {
        return User.findById(parentValue._id)
          .populate('comments')
          .then(user => user.comments)
      }
    }
  })
});

module.exports = UserType;