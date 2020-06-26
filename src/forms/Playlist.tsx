import React, { useState, useEffect } from "react";
import {
  patchPlaylist,
  postPlaylist,
  deletePlaylist
} from "../stores/playlists";
import { getGlobalState, useGlobalState } from "react-global-state-hook";
import { FOLDERS, DIRECTORY_TYPES } from "../stores/folder";
import { VIDEOS } from "../stores/videos";
import { SEQUENCES } from "../stores/sequences";

export const Playlist = ({ onSubmit, closeModal, id, ...values }) => {
  const [label, setLabel] = useState(values.label || "");
  const [items, setItems] = useState(values.items || []);
  const [keywords, setKeywords] = useState(values.keywords || []);
  const [keyword, setKeyword] = useState("");
  const [folderName, setFolderName] = useState("");
  const [videos] = useGlobalState(VIDEOS);
  const [sequences] = useGlobalState(SEQUENCES);

  useEffect(() => {
    const folders = getGlobalState(FOLDERS);
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

  const removeItem = (id) =>
    setItems(items.filter((i) => i.split(":")[0] !== id));

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        <ul className="links">
          {items.length === 0 ? (
            <li>No Videos selected</li>
          ) : (
            items.map((item, i) => {
              const [type, id] = item.split(":");
              const { label } =
                type === DIRECTORY_TYPES.VIDEO
                  ? videos.find((v) => v.id === id)
                  : sequences.find((s) => s.id === id);
              return (
                <li id={i}>
                  {label}
                  <i
                    onClick={() => removeItem(item)}
                    className="material-icons"
                  >
                    close
                  </i>
                </li>
              );
            })
          )}
        </ul>
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
        <button type="submit">Save</button>
      </div>
    </form>
  );
};
