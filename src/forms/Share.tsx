import React, { useMemo } from "react";
import { DIRECTORY_TYPES } from "../stores/folder";
import { VIDEOS } from "../stores/videos";
import { SEQUENCES } from "../stores/sequences";
import { PLAYLISTS } from "../stores/playlists";
import { Link } from "react-router-dom";
import { ggs } from "../utils/rxGlobal";

export const Share = ({ type, id, closeModal }) => {
  const item = useMemo(() => {
    if (type === DIRECTORY_TYPES.VIDEO) {
      return ggs(VIDEOS).find((v) => v.id === id);
    } else if (type === DIRECTORY_TYPES.SEQUENCE) {
      return ggs(SEQUENCES).find((s) => s.id === id);
    } else if (type === DIRECTORY_TYPES.PLAYLIST) {
      return ggs(PLAYLISTS).find((p) => p.id);
    }
  }, [type, id]);

  const url = `http://localhost:3000`;
  const path = `/viewer/${type.toLowerCase()}/${id}`;

  const link = type === DIRECTORY_TYPES.VIDEO ? item.url : `${url} ${path}`;

  const handleCopy = () => navigator.clipboard.writeText(link);

  return (
    <form className="share">
      <h2>{`Share ${type.toLowerCase().capitalize()}: ${item.label}`}</h2>
      <div>
        <small>Share this Link with someone :)</small>
        <p>{link}</p>
        <i onClick={handleCopy} className="material-icons">
          content_copy
        </i>
      </div>
      <Link to={path} onClick={closeModal}>
        Open Link
        <i className="material-icons">open_in_new</i>
      </Link>
    </form>
  );
};
