import { ApolloClient, InMemoryCache } from "apollo-boost";
import { createUploadLink } from "apollo-upload-client";

const client = new ApolloClient({
  link: createUploadLink(),
  cache: new InMemoryCache()
});

export default client;
