import React, { useState, useEffect, useMemo } from "react";
import { patchVideo, postVideo, deleteVideo } from "../stores/videos";
import { getGlobalState, setGlobalState } from "react-global-state-hook";
import ReactPlayer from "react-player";
import { VIDEO_DETECTED } from "../components/Dashboard/DashboardHeader";
import {
  SELECTED_FOLDER_VIDEO,
  FOLDERS,
  DIRECTORY_TYPES
} from "../stores/folder";
import { PLAYLISTS } from "../stores/playlists";
import { SEQUENCES } from "../stores/sequences";

export const Video = ({ onSubmit, closeModal, id, ...values }) => {
  const [label, setLabel] = useState(values.label || "");
  const [url, setUrl] = useState(values.url || "");
  const [keywords, setKeywords] = useState(values.keywords || []);
  const [keyword, setKeyword] = useState("");
  const [folderName, setFolderName] = useState("");

  const folderId = getGlobalState(SELECTED_FOLDER_VIDEO) || "root";
  const folder = getGlobalState(FOLDERS).find((f) => f.id === folderId);

  useEffect(() => {
    const folders = getGlobalState(FOLDERS);
    const folder = folders.find((f) => f.id === values.folder);
    if (folder) {
      setFolderName(folder.label);
    } else {
      setFolderName("Root Directory");
    }
  }, [values]);

  const deletable = useMemo(() => {
    const usedPlaylistVideoIds = getGlobalState(PLAYLISTS).reduce(
      (prev, curr) => {
        const videoIds = curr.items
          .filter((i) => i.split(":")[0] === DIRECTORY_TYPES.VIDEO)
          .map((i) => i.split(":")[1]);
        return Array.from(new Set([...prev, ...videoIds]));
      },
      []
    );
    const usedSequenceVideoIds = getGlobalState(SEQUENCES).reduce(
      (prev, curr) => {
        return Array.from(new Set([...prev, curr.videoId]));
      },
      []
    );

    const isUnused = !Array.from(
      new Set([...usedPlaylistVideoIds, ...usedSequenceVideoIds])
    ).includes(id);
    return isUnused;
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await patchVideo({ id, url, label, keywords });
      closeModal();
    } else {
      const addFolder = folderId === "root" ? {} : { folder: folderId };
      await postVideo({
        url,
        label,
        keywords,
        ...addFolder
      });
      closeModal();
      setGlobalState(VIDEO_DETECTED, false);
    }
  };

  const handleAddKeyword = (e) => {
    e.preventDefault();
    setKeywords([...keywords, keyword]);
    setKeyword("");
  };

  const handleRemove = (word) =>
    setKeywords(keywords.filter((w) => w !== word));

  const handleChangeUrl = ({ target: { value } }) => {
    if (ReactPlayer.canPlay(value) || value === "") {
      setUrl(value);
    }
  };

  const handleDelete = async () => {
    if (
      deletable &&
      window.confirm("Are you sure you want to delete this video?")
    ) {
      await deleteVideo(id);
      closeModal();
    } else {
      alert("Video is used in playlists and/or sequences");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>
          {`${id ? "Edit Video" : "Post Video"} to ${
            folder ? folder.label : "Root"
          }`}
          {/* type = "button" otehrwise itll submit form */}
          <button type="button" onClick={handleDelete} disabled={!deletable}>
            <i className="material-icons">delete</i>
          </button>
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
            placeholder="Add Label..."
            name="videoName"
            alt="enter video name"
            type="text"
            value={label}
            onChange={({ target: { value } }) => setLabel(value)}
          />
        </label>
        <label>
          Url
          <input
            disabled={!!id}
            name="url"
            alt="enter url name"
            placeholder="Insert Video Link"
            type="text"
            value={url}
            onChange={handleChangeUrl}
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
        <button type="submit">Save</button>
      </div>
    </form>
  );
};
