import React, { useMemo } from "react";
import {
  getGlobalState,
  setGlobalState,
  useGlobalState
} from "react-global-state-hook";
import {
  OPEN_FOLDERS,
  SELECTED_DIRECTORY,
  DIRECTORY_TYPES,
  FOLDERS,
  SELECTED_FOLDER,
  patchFolder
} from "../../stores/folder";
import { movePlaylists, PLAYLISTS } from "../../stores/playlists";
import { moveVideos, VIDEOS } from "../../stores/videos";
import { moveSequences, SEQUENCES } from "../../stores/sequences";
import { MenuFolder } from "./MenuFolder";
import { getPath } from "./Path";
import { MenuFolderCount } from "./MenuFolderCount";

const handleSelectFolder = (id, directory) => {
  setGlobalState(SELECTED_FOLDER, id);
  setGlobalState(`SELECTED_FOLDER_${DIRECTORY_TYPES[directory]}`, id);
};

const handleDrop = async (e) => {
  e.stopPropagation();
  const folders = getGlobalState(FOLDERS);
  const dropFolderId = e.target.closest(".folder").id;
  const dropFolder = folders.find((f) => f.id === dropFolderId);

  const { ids, type, directory } = JSON.parse(
    e.dataTransfer.getData("text/plain")
  );

  if (type === "FOLDER") {
    //  drop folder on folder, need to check if fodler types are matching
    const dragFolderId = ids[0];
    const dragFolder = folders.find((f) => f.id === dragFolderId);

    const path = getPath(dropFolderId, folders, []);
    const isOutOfPath = path.every((p) => p.id !== dragFolderId);
    if (dragFolderId === dropFolderId) {
      alert("Cant push into own folder");
    } else if (!isOutOfPath) {
      alert("Cant push into own path");
    } else if (directory === dragFolder.directory) {
      patchFolder({ id: dragFolderId, folder: dropFolderId || "root" });
    }
  } else if (
    !dropFolderId ||
    type === directory ||
    type === dropFolder.directory
  ) {
    // restricts movement into different directory
    if (type === DIRECTORY_TYPES.PLAYLIST) {
      movePlaylists({ folderId: dropFolderId, ids, type });
    } else if (type === DIRECTORY_TYPES.VIDEO) {
      moveVideos({ folderId: dropFolderId, ids, type });
    } else {
      moveSequences({ folderId: dropFolderId, ids, type });
    }
  }
};

const handleOpenFolder = (id) => {
  const openFolders = getGlobalState(OPEN_FOLDERS);
  if (openFolders.includes(id)) {
    setGlobalState(
      OPEN_FOLDERS,
      openFolders.filter((f) => f !== id)
    );
  } else {
    setGlobalState(OPEN_FOLDERS, [...openFolders, id]);
  }
};

const getItemsCount = (directory) => {
  if (directory === DIRECTORY_TYPES.VIDEO) {
    return getGlobalState(VIDEOS).filter((v) => !v.folder).length;
  } else if (directory === DIRECTORY_TYPES.PLAYLIST) {
    return getGlobalState(PLAYLISTS).filter((p) => !p.folder).length;
  } else {
    return getGlobalState(SEQUENCES).filter((s) => !s.folder).length;
  }
};

export const MenuItem = ({ folders, directory }) => {
  const [selectedDirectory, setSelectedDirectory] = useGlobalState(
    SELECTED_DIRECTORY
  );
  const rootFolders = folders.filter(
    (f) => !f.folder && f.directory === directory
  );

  const handleSelect = () => {
    handleOpenFolder(null);
    handleSelectFolder(null, directory);
    setSelectedDirectory(DIRECTORY_TYPES[directory]);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={handleSelect}
      id=""
      className={`menu_item folder ${
        selectedDirectory === DIRECTORY_TYPES[directory.toUpperCase()]
          ? "selected"
          : ""
      }`}
    >
      <div className="menu_item_header pd-01501 aligned-grid grid-tc-mm1 gap-m">
        <i className="material-icons">
          {directory === DIRECTORY_TYPES.PLAYLIST
            ? "playlist_play"
            : directory === DIRECTORY_TYPES.VIDEO
            ? "subscriptions"
            : "open_in_full"}
        </i>
        <label>
          {DIRECTORY_TYPES[directory].toLowerCase().capitalize() + "s"}
        </label>
        <MenuFolderCount type={DIRECTORY_TYPES[directory]} />
      </div>
      <div className="folder_folders">
        {rootFolders.map((f, i) => {
          return (
            <MenuFolder
              {...f}
              handleOpenFolder={handleOpenFolder}
              handleSelectFolder={handleSelectFolder}
              handleDrop={handleDrop}
              key={i}
              folders={folders}
              directory={directory}
            />
          );
        })}
      </div>
    </div>
  );
};
