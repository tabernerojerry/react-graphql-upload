import React, { Component } from "react";
import { Mutation } from "react-apollo";

import Message from "./Message";

import { SINGLE_UPLOAD } from "./query";

export class SingleDropzone extends Component {
  state = {
    file: "",
    isError: false,
    message: "",
    uploadedFiles: []
  };

  // Validate File Method
  _validateFile = file => {
    //console.log(file);

    const MAX_SIZE = 5242880; //bytes = 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    const isImage = allowedTypes.includes(file.type);
    const tooLarge = file.size > MAX_SIZE;

    if (isImage && !tooLarge) {
      this.setState({ isError: false, message: "" });

      return true;
    } else {
      this.setState({
        isError: true,
        message:
          isImage && tooLarge
            ? `${file.name} - Too large, Max size is ${MAX_SIZE / 1048576}MB`
            : `${file.name} - Only images are allowed!`
      });

      return false;
    }
  };

  // Submit Form
  _onChange = singleUpload => async ({
    target: {
      validity,
      name,
      files: [file]
    }
  }) => {
    validity.valid && (await this.setState({ [name]: file }));

    // Skip process if file is invalid
    if (!this._validateFile(file)) return;

    try {
      // API Call
      const { data } = await singleUpload({
        variables: { file: this.state.file }
      });

      // if OK false skip process
      if (!data.singleUpload.ok)
        return this.setState({
          isError: true,
          message: data.singleUpload.error.message
        });

      await this.setState({
        uploadedFiles: [
          ...this.state.uploadedFiles,
          data.singleUpload.file.path
        ],
        isError: false,
        message: "File has been successfully uploaded!"
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  _renderProp = (singleUpload, { loading, error }) => {
    const { file, isError, message, uploadedFiles } = this.state;

    return (
      <form encType="multipart/form-data">
        {message && <Message message={message} error={isError} />}

        <div className="dropzone z-depth-2">
          <input
            type="file"
            name="file"
            className="input-dropzone"
            onChange={this._onChange(singleUpload)}
          />

          {!loading ? (
            <p className="call-to-action">Single File Dropzone </p>
          ) : (
            <p className="call-to-action">Uploading {file.name} </p>
          )}
        </div>

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
    return <Mutation mutation={SINGLE_UPLOAD}>{this._renderProp}</Mutation>;
  }
}

export default SingleDropzone;
