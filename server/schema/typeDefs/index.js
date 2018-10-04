import graphqlFileLoader from "../../utils/graphqlFileLoader";

export default [
  graphqlFileLoader("../schema", "typeDefs/base.graphql"),
  graphqlFileLoader("../schema", "typeDefs/upload.graphql")
];
