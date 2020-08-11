import React, { useState, useMemo } from "react";
import {
  patchFolder,
  postFolder,
  deleteFolder,
  FOLDERS,
  DIRECTORY_TYPES
} from "../stores/folder";
import { usegs, ggs } from "../utils/rxGlobal";

export const Folder = ({ onSubmit, closeModal, id, directory, ...values }) => {
  const [folders] = usegs(FOLDERS);
  const [folder] = useState(
    id ? values.folder : ggs(`SELECTED_FOLDER_${DIRECTORY_TYPES[directory]}`)
  );
  const [label, setLabel] = useState(values.label || "");
  const [loading, setLoading] = useState(false);

  const deletable = useMemo(() => {
    const usedFolderIds = ggs(DIRECTORY_TYPES[directory] + "S").reduce(
      (prev, curr) => {
        return Array.from(new Set([...prev, curr.folder]));
      },
      []
    );
    return !usedFolderIds.includes(id);
  }, [id, directory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const addFolder = !folder ? {} : { folder };
    setLoading(true);
    if (id) {
      await patchFolder({ id, label, ...addFolder });
      closeModal();
    } else {
      await postFolder({ label, directory, ...addFolder });
      closeModal();
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (deletable) {
      const confirmed = window.confirm("Deleting Folder");
      if (confirmed) {
        await deleteFolder(id);
        closeModal();
      }
    } else {
      alert(
        "Folder is not empty. Please move or delete all playlists in this folder before you delete it."
      );
    }
  };

  const { label: folderLabel } = folders.find((f) => f.id === folder) || {
    label: directory.toLowerCase().capitalize() + "s"
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>
          {`${id ? "Edit Folder in" : "Add Folder to"} ${folderLabel}`}
          <button onClick={handleDelete} disabled={!deletable} type="button">
            <i className="material-icons">delete</i>
          </button>
        </h3>
      </div>
      <div className="form-body">
        <label>
          Label
          <input
            name="folderName"
            alt="enter folder name"
            type="text"
            value={label}
            placeholder="Folder name"
            onChange={({ target: { value } }) => setLabel(value)}
          />
        </label>
        <button disabled={loading} type="submit">
          Save
        </button>
      </div>
    </form>
  );
};
