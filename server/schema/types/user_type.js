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
    token: {
        type: GraphQLString
      },
    loggedIn: {
      type: GraphQLBoolean
    },
    image: {
      type: GraphQLString
    },
  })
});

module.exports = UserType;