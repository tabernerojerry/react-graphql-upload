import gql from "graphql-tag";

export const SINGLE_UPLOAD = gql`
  mutation SingleUpload($file: Upload!) {
    singleUpload(file: $file) {
      ok
      error {
        message
      }
      file {
        path
      }
    }
  }
`;

export const MULTIPLE_UPLOAD = gql`
  mutation MultipleUpload($files: [Upload!]!) {
    multipleUpload(files: $files) {
      ok
      error {
        message
      }
      files {
        path
      }
    }
  }
`;
