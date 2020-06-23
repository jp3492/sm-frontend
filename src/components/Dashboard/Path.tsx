import React from "react";
import "./Path.scss";
import { useGlobalState } from "react-global-state-hook";
import {
  FOLDERS,
  SELECTED_DIRECTORY,
  DIRECTORY_TYPES
} from "../../stores/folder";
import { PLAYLIST_OPEN } from "../../stores/playlists";

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
  const [selectedDirectory] = useGlobalState(SELECTED_DIRECTORY);
  const [folders] = useGlobalState(FOLDERS);
  const [selectedFolder, setSelectedFolder] = useGlobalState(
    `SELECTED_FOLDER_${DIRECTORY_TYPES[selectedDirectory]}`
  );
  const [playlistOpen, setPlaylistOpen] = useGlobalState(PLAYLIST_OPEN);

  const path = getPath(selectedFolder, folders);

  const handleDirClick = () => setSelectedFolder(null);

  return (
    <div className="path">
      <div>
        <div onClick={handleDirClick}>
          <i className="material-icons">folder</i>
        </div>
        {path.map((p) => {
          return (
            <div onClick={() => setSelectedFolder(p.id)}>
              <i className="material-icons">keyboard_arrow_right</i>
              {p.label}
            </div>
          );
        })}
      </div>
      <button onClick={() => setPlaylistOpen(!playlistOpen)}>
        <i className="material-icons">
          {playlistOpen ? "keyboard_arrow_right" : "keyboard_arrow_left"}
        </i>
      </button>
    </div>
  );
};
