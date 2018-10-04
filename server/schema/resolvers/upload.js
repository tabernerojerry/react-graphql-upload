import controller from "../../controllers";

export default {
  Query: {
    hello: () => "Hello Jerry"
  },
  Mutation: {
    singleUpload: async (_, { file }) =>
      await controller.upload.singleUpload(file),
    multipleUpload: async (_, { files }) =>
      await controller.upload.multipleUpload(files)
  }
};
