const graphql = require("graphql");
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

  }
});

module.exports = mutation;
