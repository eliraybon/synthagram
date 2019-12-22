const mongoose = require("mongoose");
const graphql = require("graphql");
const User = mongoose.model("users");
const UserType = require("./user_type");


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
  })
});

module.exports = RootQueryType;