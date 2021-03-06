import React, { useState } from "react";
import {
  OPEN_FOLDERS,
  SELECTED_DIRECTORY,
  DIRECTORY_TYPES,
  FOLDERS,
  SELECTED_FOLDER,
  patchFolder
} from "../../stores/folder";
import { movePlaylists } from "../../stores/playlists";
import { moveVideos } from "../../stores/videos";
import { moveSequences } from "../../stores/sequences";
import { MenuFolder } from "./MenuFolder";
import { getPath } from "./Path";
import { ggs, sgs, usegs, ugs } from "../../utils/rxGlobal";

export const MOVING_ITEMS = "MOVING_ITEMS";
sgs(MOVING_ITEMS, []);

const handleSelectFolder = (id, directory) => {
  sgs(SELECTED_FOLDER, id);
  sgs(`SELECTED_FOLDER_${DIRECTORY_TYPES[directory]}`, id);
};

const handleDrop = async (e) => {
  e.stopPropagation();
  const folders = ggs(FOLDERS);
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
    ugs(MOVING_ITEMS, (items) => [...items, ...ids]);
    // restricts movement into different directory
    if (type === DIRECTORY_TYPES.PLAYLIST) {
      await movePlaylists({ folderId: dropFolderId, ids, type });
    } else if (type === DIRECTORY_TYPES.VIDEO) {
      await moveVideos({ folderId: dropFolderId, ids, type });
    } else {
      await moveSequences({ folderId: dropFolderId, ids, type });
    }
    ugs(MOVING_ITEMS, (items) => items.filter((i) => !ids.includes(i)));
  }
};

const handleOpenFolder = (id) =>
  ugs(OPEN_FOLDERS, (openFolders) => {
    if (openFolders.includes(id)) {
      return openFolders.filter((f) => f !== id);
    }
    return [...openFolders, id];
  });

export const MenuItem = ({ folders, directory }) => {
  const [selectedDirectory, setSelectedDirectory] = usegs(SELECTED_DIRECTORY);
  const rootFolders = folders.filter(
    (f) => !f.folder && f.directory === directory
  );
  const [open, setOpen] = useState(directory === DIRECTORY_TYPES.PLAYLIST);

  const handleSelect = () => {
    handleOpenFolder(null);
    handleSelectFolder(null, directory);
    setSelectedDirectory(DIRECTORY_TYPES[directory]);
  };

  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(!open);
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
      <div className="menu_item_header pd-01501 aligned-grid grid-tc-m1m gap-m">
        <i
          className={`material-icons ${
            directory === DIRECTORY_TYPES.SEQUENCE ? "sequence-icon" : ""
          }`}
        >
          {directory === DIRECTORY_TYPES.PLAYLIST
            ? "playlist_play"
            : directory === DIRECTORY_TYPES.VIDEO
            ? "subscriptions"
            : "open_in_full"}
        </i>
        <label>
          {DIRECTORY_TYPES[directory].toLowerCase().capitalize() + "s"}
        </label>
        {/* <MenuFolderCount type={DIRECTORY_TYPES[directory]} /> */}
        <i className="material-icons" onClick={handleOpen}>
          {open ? "expand_less" : "expand_more"}
        </i>
      </div>
      {open && (
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
      )}
    </div>
  );
};
