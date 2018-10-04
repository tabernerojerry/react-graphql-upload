import React, { Component } from "react";

import SingleDropzone from "./SingleDropzone";
import MultipleDropzone from "./MultipleDropzone";

class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <h2 className="center-align">DnD GraphQL Upload</h2>
          <p className="center-align">React, GraphQL, Apollo</p>

          <div className="row">
            <div className="col s8 offset-s2">
              <SingleDropzone />
            </div>
          </div>

          <div className="row">
            <div className="col s8 offset-s2">
              <MultipleDropzone />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
