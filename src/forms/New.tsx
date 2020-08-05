import React from "react";
import { MODAL } from "../components/Modal";
import { DIRECTORY_TYPES } from "../stores/folder";
import { sgs } from "../utils/rxGlobal";

export const New = ({ closeModal }) => {
  const openFolder = () => {
    closeModal();
    sgs(MODAL, {
      component: "folder"
    });
  };

  const openVideo = () => {
    closeModal();
    sgs(MODAL, {
      component: DIRECTORY_TYPES.VIDEO
    });
  };

  return (
    <form className="form-new">
      <div className="form-header">
        <h3>Add New</h3>
      </div>
      <div className="form-body">
        <div onClick={openFolder}>
          <i className="material-icons">folder</i>
          <label>Folder</label>
        </div>
        <div onClick={openVideo}>
          <i className="material-icons">ondemand_video</i>
          <label>Video</label>
        </div>
      </div>
    </form>
  );
};
