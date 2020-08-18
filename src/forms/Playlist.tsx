import React, { useState, useEffect } from "react";
import {
  patchPlaylist,
  postPlaylist,
  deletePlaylist
} from "../stores/playlists";
import { FOLDERS } from "../stores/folder";
import { ggs } from "../utils/rxGlobal";

export const Playlist = ({ onSubmit, closeModal, id, ...values }) => {
  const [label, setLabel] = useState(values.label || "");
  const [items] = useState(values.items || []);
  const [keywords, setKeywords] = useState(values.keywords || []);
  const [keyword, setKeyword] = useState("");
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const folders = ggs(FOLDERS);
    const folder = folders.find((f) => f.id === values.folder);
    if (folder) {
      setFolderName(folder.label);
    } else {
      setFolderName("Root Directory");
    }
  }, [values]);

  const handleAddKeyword = (e) => {
    e.preventDefault();
    setKeywords([...keywords, keyword]);
    setKeyword("");
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Deleting Playlist");
    if (confirmed) {
      await deletePlaylist(id);
      closeModal();
    }
  };

  const handleRemove = (word) =>
    setKeywords(keywords.filter((w) => w !== word));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (id) {
      await patchPlaylist({
        id,
        items,
        label,
        keywords
      });
      closeModal();
    } else {
      await postPlaylist({ items, label, keywords });
      closeModal();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>
          {`${id ? "Edit Playlist" : "Post Playlist"}`}{" "}
          <i onClick={handleDelete} className="material-icons">
            delete
          </i>
        </h3>
        <div className="form-folder">
          <i className="material-icons">folder</i>
          {folderName}
        </div>
      </div>
      <div className="form-body">
        <label>
          Label
          <input
            name="playlistName"
            placeholder="'My Playlist'"
            alt="enter playlist name"
            type="text"
            value={label}
            onChange={({ target: { value } }) => setLabel(value)}
          />
        </label>
        <label className="keywords">
          Keywords
          <input
            type="text"
            value={keyword}
            placeholder="Add keyword.."
            alt="add keyword"
            onChange={({ target: { value } }) => setKeyword(value)}
          />
          <button onClick={handleAddKeyword}>
            <i className="material-icons">add</i>
          </button>
        </label>
        <ul className="keywords-list">
          {keywords.map((k, i) => (
            <li key={i}>
              {k}
              <i onClick={() => handleRemove(k)} className="material-icons">
                close
              </i>
            </li>
          ))}
        </ul>
        <button disabled={loading} type="submit">
          Save
        </button>
      </div>
    </form>
  );
};
