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
    newComment: {
      type: CommentType,
      args: {
        body: { type: GraphQLString },
        author: { type: GraphQLID },
        photo: { type: GraphQLID },
        parentCommentId: { type: GraphQLID }
      },
      resolve(_, { body, author, photo, parentCommentId }) {
        return Comment.createComment(body, author, photo, parentCommentId);
      }
    },
    deleteComment: {
      type: CommentType,
      args: {
        commentId: { type: GraphQLID }
      },
      resolve(_, { commentId }) {
        return Comment.deleteComment(commentId);
      }
    },
    updateComment: {
      type: CommentType,
      args: {
        id: { type: GraphQLID },
        body: { type: GraphQLString }
      },
      resolve(parentValue, { id, body }) {
        const updateObj = {};
        if (body) updateObj.body = body;

        return Comment.findOneAndUpdate(
          { _id: id },
          { $set: updateObj },
          { new: true, useFindAndModify: false },
          (err, comment) => {
            return comment;
          });
      }
    },
    addLike: {
      type: PhotoType,
      args: {
        photoId: { type: GraphQLID },
        userId: { type: GraphQLID }
      },
      resolve(parentValue, { photoId, userId }) {
        return Photo.addLike(photoId, userId);
      }
    },
    removeLike: {
      type: PhotoType,
      args: {
        photoId: { type: GraphQLID },
        userId: { type: GraphQLID }
      },
      resolve(parentValue, { photoId, userId }) {
        return Photo.removeLike(photoId, userId);
      }
    },
    addFollow: {
      type: UserType,
      args: {
        followingId: { type: GraphQLID },
        userId: { type: GraphQLID } 
      },
      resolve(parentValue, { followingId, userId }) {
        return User.addFollow(followingId, userId);
      }
    },
    removeFollow: {
      type: UserType,
      args: {
        unfollowingId: { type: GraphQLID },
        userId: { type: GraphQLID }
      },
      resolve(parentValue, { unfollowingId, userId }) {
        return User.removeFollow(unfollowingId, userId);
      }
    }
  }
});

module.exports = mutation;
