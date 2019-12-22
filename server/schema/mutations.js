const graphql = require("graphql");
const AuthService = require('../services/auth');
const User = require("../models/User");
const UserType = require('./types/user_type');
const Photo = require("../models/Photo");
const PhotoType = require('./types/photo_type');
const Comment = require("../models/Comment");
const CommentType = require('./types/comment_type');

const { 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLID, 
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean 
} = graphql;


const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.register(args);
      }
    },
    logout: {
      type: UserType,
      args: {
        _id: {
          type: GraphQLID
        }
      },
      resolve(_, args) {
        return AuthService.logout(args);
      }
    },
    login: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.login(args);
      }
    },
    verifyUser: {
      type: UserType,
      args: {
        token: {
          type: GraphQLString
        }
      },
      resolve(_, args) {
        return AuthService.verifyUser(args);
      }
    },
    newPhoto: {
      type: PhotoType,
      args: {
        photoUrl: { type: GraphQLString },
        body: { type: GraphQLString },
        user: { type: GraphQLID }
      },
      resolve(_, { photoUrl, body, user }) {
        return Photo.postPhoto(photoUrl, body, user);
      }
    },
    deletePhoto: {
      type: PhotoType,
      args: {
        photoId: { type: GraphQLID }
      },
      resolve(_, { photoId }) {
        return Photo.deletePhoto(photoId);
      }
    },
    updatePhoto: {
      type: PhotoType,
      args: {
        id: { type: GraphQLID },
        body: { type: GraphQLString }
      },
      resolve(parentValue, { id, body }) {
        const updateObj = {};
        if (body) updateObj.body = body;

        return Photo.findOneAndUpdate(
          { _id: id }, 
          { $set: updateObj }, 
          { new: true, useFindAndModify: false }, 
          (err, photo) => {
          return photo;
        });
      }
    },
  }
});

module.exports = mutation;
