import React, { useState } from "react";
import { DIRECTORY_TYPES } from "../stores/folder";

export const Share = ({
  type,
  id,
  label,
  videoUrl,
  originId,
  originLabel,
  closeModal
}) => {
  const [linkPlaylist, setLinkPlaylist]: any = useState(!!originId);

  const url =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000`
      : "https://viden.pro";

  const path = `/viewer/${type.toLowerCase()}/${id}${
    linkPlaylist ? `?originId=${originId}&originLabel=` + originLabel : ""
  }`;
  const link = url + path;

  const handleCopy = () => navigator.clipboard.writeText(link);

  return (
    <form className="share">
      <div className="form-header">
        <h2>{`Share ${type.toLowerCase().capitalize()}: ${label}`}</h2>
        {type === DIRECTORY_TYPES.PLAYLIST && originId && (
          <div
            onClick={() => setLinkPlaylist(!linkPlaylist)}
            className="grid grid-tc-m1 gap-s pd-005"
          >
            <i className="material-icons">
              {linkPlaylist ? "check_box" : "check_box_outline_blank"}
            </i>
            <label>Link playlist</label>
          </div>
        )}
      </div>
      <div className="form-body">
        <div className="share_link">
          <p>{type === DIRECTORY_TYPES.VIDEO ? videoUrl : link}</p>
          <i onClick={handleCopy} className="material-icons">
            content_copy
          </i>
        </div>
        <a
          href={type === DIRECTORY_TYPES.VIDEO ? videoUrl : path}
          target="_blank"
          onClick={closeModal}
          className="cl-content-icon"
        >
          <label>Open Link</label>
          <i className="material-icons">open_in_new</i>
        </a>
      </div>
    </form>
  );
};
