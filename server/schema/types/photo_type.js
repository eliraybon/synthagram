const mongoose = require("mongoose");
const graphql = require("graphql");
const Photo = mongoose.model("photos");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList
} = graphql;

const PhotoType = new GraphQLObjectType({
  name: "PhotoType",
  fields: () => ({
    _id: {
      type: GraphQLID
    },
    photoUrl: {
      type: GraphQLString
    },
    body: {
      type: GraphQLString
    },
    user: {
      type: require('./user_type'),
      resolve(parentValue) {
        return Photo.findById(parentValue._id)
          .populate('user')
          .then(photo => photo.user)
      }
    },
    likes: {
      type: new GraphQLList(require('./user_type')),
      resolve(parentValue) {
        return Photo.findById(parentValue._id)
          .populate('likes')
          .then(photo => photo.likes)
      }
    },
    comments: {
      type: new GraphQLList(require('./comment_type')),
      resolve(parentValue) {
        return Photo.findById(parentValue._id)
          .populate('comments')
          .then(photo => photo.comments)
      }
    }
  })
});

module.exports = PhotoType;
