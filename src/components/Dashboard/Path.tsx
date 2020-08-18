import React from "react";
import "./Path.scss";

import {
  FOLDERS,
  SELECTED_DIRECTORY,
  DIRECTORY_TYPES
} from "../../stores/folder";
import { PLAYLIST_OPEN } from "../../stores/playlists";
import { usegs } from "../../utils/rxGlobal";

export const getPath = (
  id: string | null,
  folders: {
    id: string;
    label: string;
  }[],
  path: { id: string | null; label: string }[] = []
) => {
  const folder: any = folders.find((f) => f.id === id);

  if (!folder) {
    return path;
  }
  if (folder && !folder.folder) {
    return [{ id, label: folder.label }, ...path];
  }
  const parentFolder = folders.find((f) => f.id === folder.folder) || {
    id: null,
    label: "Root"
  };

  return getPath(parentFolder.id, folders, [
    { id: folder.folder, label: folder.label },
    ...path
  ]);
};

export const Path = () => {
  const [selectedDirectory] = usegs(SELECTED_DIRECTORY);
  const [folders] = usegs(FOLDERS);
  const [selectedFolder, setSelectedFolder] = usegs(
    `SELECTED_FOLDER_${DIRECTORY_TYPES[selectedDirectory]}`
  );
  const [playlistOpen, setPlaylistOpen] = usegs(PLAYLIST_OPEN);

  const path = getPath(selectedFolder, folders);

  const handleDirClick = () => setSelectedFolder(null);

  return (
    <div className="path aligned-grid grid-tc-1m gap-m bg-white">
      <div className="aligned-grid gap-m pd-051">
        <div className="grid gap-s" onClick={handleDirClick}>
          <i
            className={`material-icons ${
              selectedDirectory === DIRECTORY_TYPES.SEQUENCE
                ? "sequence-icon"
                : ""
            }`}
          >
            {selectedDirectory === DIRECTORY_TYPES.PLAYLIST
              ? "playlist_play"
              : selectedDirectory === DIRECTORY_TYPES.VIDEO
              ? "subscriptions"
              : "open_in_full"}
          </i>
          <h4>{`${selectedDirectory.toLowerCase().capitalize()}s`}</h4>
        </div>
        {path.map((p, i) => {
          return (
            <div
              className="aligned-grid gap-m"
              key={i}
              onClick={() => setSelectedFolder(p.id)}
            >
              <i className="material-icons">keyboard_arrow_right</i>
              {p.label}
            </div>
          );
        })}
      </div>
      <button className="pd-01" onClick={() => setPlaylistOpen(!playlistOpen)}>
        <i className="material-icons">
          {playlistOpen ? "keyboard_arrow_right" : "keyboard_arrow_left"}
        </i>
      </button>
    </div>
  );
};
