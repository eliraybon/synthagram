const mongoose = require("mongoose");
const graphql = require("graphql");
const UserType = require("./user_type");
const User = mongoose.model("users");
const ProductType = require('./product_type');
const Product = mongoose.model("products");
const ReviewType = require('./review_type');
const Review = mongoose.model("reviews");
const StoreType = require('./store_type');
const Store = mongoose.model('stores');

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

  })
});

module.exports = RootQueryType;