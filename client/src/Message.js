import React from "react";

const Message = ({ error, message }) => (
  <div className={`card-panel ${error ? "red" : "green"}`}>
    <span className="white-text">{message}</span>
  </div>
);

export default Message;
