import React, { Component } from "react";
import { Mutation } from "react-apollo";
import _ from "lodash";

import { MULTIPLE_UPLOAD } from "./query";
import Message from "./Message";

export class MultipleDropzone extends Component {
  state = {
    files: [],
    uploadFiles: [],
    uploadedFiles: [],
    message: "",
    isError: false
  };

  // Validate File Method
  _validateFile = file => {
    //return ""; // test server error

    const MAX_SIZE = 5242880; //bytes = 5MB
    const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

    const isImage = allowedTypes.includes(file.type);
    const tooLarge = file.size > MAX_SIZE;

    if (isImage && tooLarge)
      return `${file.name} - Too large, Max size is ${MAX_SIZE / 1048576}MB`;

    if (!isImage) return `${file.name} - Only images are allowed!`;

    return "";
  };

  // Submit Form
  _onChange = multipleUpload => async ({
    target: { validity, name, files }
  }) => {
    validity.valid &&
      (await this.setState({
        [name]: [
          ..._.map(files, file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            invalidMessage: this._validateFile(file)
          }))
        ],
        uploadFiles: [...files]
      }));
    //console.log("files: ", this.state.files);
    //console.log("uploadFiles: ", this.state.uploadFiles);

    try {
      const validFiles = _.filter(
        this.state.uploadFiles,
        file => this._validateFile(file) === ""
      );
      //console.log("validFiles: ", validFiles);

      // API Call
      const { data } = await multipleUpload({
        variables: { files: validFiles }
      });

      // if OK false skip process
      if (!data.multipleUpload.ok)
        return this.setState({
          isError: true,
          message: data.multipleUpload.error.message
        });

      await this.setState({
        uploadedFiles: [
          ...this.state.uploadedFiles,
          ...data.multipleUpload.files.map(file => file.path)
        ],
        message:
          validFiles.length > 0 &&
          `${validFiles.length} files has been successfully uploaded!`,
        isError: false
      });
    } catch (error) {
      console.log("Error", error);
    }
  };

  _renderProp = (multipleUpload, { loading, error }) => {
    const { isError, message, files, uploadedFiles } = this.state;

    return (
      <form encType="multipart/form-data">
        {message && <Message error={isError} message={message} />}

        <div className="dropzone z-depth-2">
          <input
            multiple
            type="file"
            name="files"
            className="input-dropzone"
            onChange={this._onChange(multipleUpload)}
          />

          {!loading ? (
            <p className="call-to-action">Multiple File Dropzone</p>
          ) : (
            <p className="call-to-action">Uploading Files...</p>
          )}
        </div>

        {files.length > 0 &&
          files.map(
            (file, index) =>
              file.invalidMessage && (
                <Message
                  key={index}
                  error={true}
                  message={file.invalidMessage}
                />
              )
          )}

        {uploadedFiles.length > 0 &&
          uploadedFiles.map((file, index) => (
            <div key={index} className="col s4">
              <div className="card">
                <div className="card-image">
                  <img src={file} alt="" />
                </div>
              </div>
            </div>
          ))}
      </form>
    );
  };

  render() {
    return <Mutation mutation={MULTIPLE_UPLOAD}>{this._renderProp}</Mutation>;
  }
}

export default MultipleDropzone;
