import fs from "fs";
import path from "path";

/**
 * Load Graphql File
 * @param {Main Folder of the graphql file} baseFolder
 * @param {File with graphql extension} file
 */
const graphqlFileLoader = (baseFolder, file) => {
  const filePath = path.join(__dirname, baseFolder, file);
  //console.log("GraphQL File: ", filePath);

  return fs.readFileSync(filePath, "utf-8");
};

export default graphqlFileLoader;
