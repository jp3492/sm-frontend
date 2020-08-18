import React from "react";
import { DIRECTORY_TYPES } from "../stores/folder";

export const Share = ({ type, id, label, videoUrl, closeModal }) => {
  const url =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000`
      : "https://viden.pro";

  const path = `/viewer/${type.toLowerCase()}/${id}`;
  const link = url + path;

  const handleCopy = () => navigator.clipboard.writeText(link);

  return (
    <form className="share">
      <h2>{`Share ${type.toLowerCase().capitalize()}: ${label}`}</h2>
      <div>
        <small>Share this Link with someone :)</small>
        <p>{type === DIRECTORY_TYPES.VIDEO ? videoUrl : link}</p>
        <i onClick={handleCopy} className="material-icons">
          content_copy
        </i>
      </div>
      <a
        href={type === DIRECTORY_TYPES.VIDEO ? videoUrl : path}
        target="_blank"
        onClick={closeModal}
      >
        Open Link
        <i className="material-icons">open_in_new</i>
      </a>
    </form>
  );
};
