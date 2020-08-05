import React, { useMemo, useEffect } from "react";
import { MenuItem } from "../components/Dashboard/MenuItem";
import {
  DIRECTORY_TYPES,
  FOLDERS,
  SELECTED_FOLDER_SEQUENCE
} from "../stores/folder";
import { usegs } from "../utils/rxGlobal";

export const SelectFolder = ({ onSelect }) => {
  const [folders] = usegs(FOLDERS);
  const [selectedFolderId] = usegs(SELECTED_FOLDER_SEQUENCE);

  const selectedFolder = useMemo(
    () => folders.find((f) => f.id === selectedFolderId),
    [folders, selectedFolderId]
  );

  useEffect(() => {
    onSelect(selectedFolderId);
  }, [selectedFolderId, onSelect]);

  return (
    <div className="select-folder">
      <h3>{`${
        selectedFolder ? selectedFolder.label : "Root Folder"
      } Selected`}</h3>
      <MenuItem directory={DIRECTORY_TYPES.SEQUENCE} folders={folders} />
    </div>
  );
};
