const mongoose = require("mongoose");
const graphql = require("graphql");
const User = mongoose.model("users");
const UserType = require("./user_type");
const Photo = mongoose.model("photos");
const PhotoType = require("./photo_type");
const Comment = mongoose.model("comments");
const CommentType = require("./comment_type");

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString
} = graphql;


const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({});
      }
    },
    user: {
      type: UserType,
      args: {
        _id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(_, args) {
        return User.findById(args._id);
      }
    },
    photos: {
      type: new GraphQLList(PhotoType),
      resolve() {
        return Photo.find({});
      }
    },
    photo: {
      type: PhotoType,
      args: {
        _id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(_, args) {
        return Photo.findById(args._id);
      }
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve() {
        return Comment.find({});
      }
    },
    comment: {
      type: CommentType,
      args: {
        _id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(_, args) {
        return Comment.findById(args._id);
      }
    },
    searchUsers: {
      type: new GraphQLList(UserType),
      args: {
        filter: { 
          type: GraphQLString
        }
      },
      resolve(_, args) {
        return User.find({ username: { $regex: args.filter, $options: "i" } });
      }
    },
    //you will need to find a way to sort by date
    feed: {
      type: new GraphQLList(PhotoType),
      args: {
        currentUserId: {
          type: GraphQLID
        }
      },
      resolve(_, { currentUserId }) {
        return User.feed(currentUserId);
      }
    },
    //you can fine tune what the explore page actually returns later
    explorePhotos: {
      type: new GraphQLList(PhotoType),
      resolve() {
        return Photo.find({});
      }
    },
    exploreUsers: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({}).limit(6);
      }
    }
  })
});

module.exports = RootQueryType;