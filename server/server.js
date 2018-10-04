import express from "express";
import path from "path";
import { ApolloServer } from "apollo-server-express";

// Load Schema
import { typeDefs, resolvers } from "./schema";

const app = express();

// Express Static Middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  uploads: {
    maxFileSize: 5242880 //bytes = 5MB
  },
  context: ({ req }) => ({})
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
