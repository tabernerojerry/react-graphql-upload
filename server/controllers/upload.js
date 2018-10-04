import fs from "fs";
import makeDir from "make-dir";

const UPLOAD_DIR = "uploads";

// Create upload directory if not exist
makeDir(UPLOAD_DIR);
("");

// Remove white space of files
const splitFileName = file => file.split(" ").join("-");

// Store Upload File
const storeFileStream = (stream, filename) => {
  const now = Date.now();
  const renameFile = `${now}-${filename}`;
  const path = `${UPLOAD_DIR}/${renameFile}`;

  return new Promise((resolve, reject) =>
    stream
      .on("error", error => {
        // Delete file
        fs.unlinkSync(path);

        // below if validation is not working stream.truncated results always false
        /* if (stream.truncated) {
          Delete the truncated file
          fs.unlinkSync(path);
        } */
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on("finish", () => resolve({ path, renameFile }))
  );
};

// Filter File Type
const fileFilter = mimetype => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

  if (!allowedTypes.includes(mimetype)) return false;

  return true;
};

export default {
  // Single Upload
  singleUpload: async file => {
    try {
      const { stream, filename, mimetype } = await file;

      // Validate file type
      if (!fileFilter(mimetype))
        // skip process if not valid
        return {
          ok: false,
          error: { message: `${filename} - Only images are allowed` }
        };

      const { path, renameFile } = await storeFileStream(
        stream,
        splitFileName(filename)
      );

      return {
        ok: true,
        file: {
          filename: renameFile,
          mimetype,
          path
        }
      };
    } catch (error) {
      //console.log("Error", JSON.stringify(error));
      if (error.name === "MaxFileSizeUploadError") {
        return {
          ok: false,
          error: { message: "Too large, Max size is 5MB" }
        };
      }
    }
  },

  // Multiple Upload
  multipleUpload: async files => {
    try {
      let data = [];

      for (let [index, file] of files.entries()) {
        const { stream, filename, mimetype } = await file;

        // Validate file type
        if (!fileFilter(mimetype))
          // skip process if invalid
          return {
            ok: false,
            error: { message: `${filename} - Only images are allowed` }
          };

        const { path, renameFile } = await storeFileStream(
          stream,
          splitFileName(filename)
        );

        data[index] = { path, filename: renameFile, mimetype };
      }
      //console.log(data);

      return {
        ok: true,
        files: data
      };
    } catch (error) {
      //console.log("Error: ", JSON.stringify(error));
      if (error.name === "MaxFileSizeUploadError") {
        return {
          ok: false,
          error: { message: "Too large, Max size is 5MB" }
        };
      }
    }
  }
};
