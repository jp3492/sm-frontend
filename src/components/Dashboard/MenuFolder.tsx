import React from "react";
import {
  OPEN_FOLDERS,
  DIRECTORY_TYPES,
  SELECTED_DIRECTORY
} from "../../stores/folder";
import { MODAL } from "../Modal";
import { MenuFolderCount } from "./MenuFolderCount";
import { usegs, sgs } from "../../utils/rxGlobal";

const handleDragStart = (e) => {
  const folderId = e.target.closest(".folder").id;
  const directory = e.target.closest(".folder").classList[0];

  e.dataTransfer.setData(
    "text/plain",
    JSON.stringify({ ids: [folderId], type: "FOLDER", directory })
  );
};

export const MenuFolder = ({
  folders,
  id,
  folder,
  label,
  directory,
  handleOpenFolder,
  handleSelectFolder,
  handleDrop
}) => {
  const [openFolders] = usegs(OPEN_FOLDERS);
  const [selectedFolder] = usegs(
    `SELECTED_FOLDER_${DIRECTORY_TYPES[directory]}`
  );
  const [selectedDirectory] = usegs(SELECTED_DIRECTORY);

  const childFolders = folders.filter((f) => f.folder === id);

  const open = openFolders.includes(id);
  const selected = selectedFolder === id && directory === selectedDirectory;

  const handleEdit = () => {
    sgs(MODAL, {
      component: "folder",
      props: { id, label, folder, directory }
    });
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    handleSelectFolder(id, directory);
    sgs(SELECTED_DIRECTORY, DIRECTORY_TYPES[directory]);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`${directory} folder ${open ? "open" : ""} ${
        selected ? "selected" : ""
      }`}
      id={id}
    >
      <div
        draggable={true}
        onDragStart={handleDragStart}
        onClick={handleSelect}
        className="folder_header pd-050 aligned-grid grid-tc-m1mm gap-m bg-white"
      >
        {childFolders.length !== 0 ? (
          <i onClick={() => handleOpenFolder(id)} className="material-icons">
            keyboard_arrow_right
          </i>
        ) : (
          <i className="material-icons no_child_folder centered-grid opacity-0">
            keyboard_arrow_right
          </i>
        )}
        <label>{label}</label>
        <MenuFolderCount type={directory} folderId={id} />
        <i onClick={handleEdit} className="material-icons">
          more_vert
        </i>
      </div>
      <div className="folder_folders">
        {open &&
          childFolders.map((f, i) => (
            <MenuFolder
              {...f}
              handleOpenFolder={handleOpenFolder}
              handleSelectFolder={handleSelectFolder}
              handleDrop={handleDrop}
              key={i}
              folders={folders}
              directory={directory}
            />
          ))}
      </div>
    </div>
  );
};
