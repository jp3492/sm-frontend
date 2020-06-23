import React from "react";
import "./Modal.scss";
import { useGlobalState, setGlobalState } from "react-global-state-hook";
import { Folder } from "../forms/Folder";
import { Video } from "../forms/Video";
import { Playlist } from "../forms/Playlist";
import { New } from "../forms/New";
import { SelectFolder } from "../forms/SelectFolder";

export const MODAL = "MODAL";

const INITIAL_CONFIG = {
  component: "",
  props: {}
};

const COMPONENTS = {
  FOLDER: Folder,
  VIDEO: Video,
  PLAYLIST: Playlist,
  NEW: New,
  SELECTFOLDER: SelectFolder
};

export const closeModal = () => {
  setGlobalState(MODAL, INITIAL_CONFIG);
};

export const Modal = () => {
  const [modal, setModal] = useGlobalState(MODAL, INITIAL_CONFIG);

  const component = modal.component.toUpperCase();

  if (!Object.keys(COMPONENTS).includes(component)) {
    document.body.style.overflow = "auto";
    return null;
  }

  const handleClick = (e) => {
    if (e.target.classList.contains("modal")) {
      setModal(INITIAL_CONFIG);
    }
  };

  const renderComponent = (component: string) => {
    const SelectedComponent = COMPONENTS[component];

    return (
      <SelectedComponent
        onClick={(e) => e.stopPropagation()}
        {...modal.props}
        closeModal={closeModal}
      />
    );
  };

  return (
    <div onClick={handleClick} className="modal">
      {renderComponent(component)}
    </div>
  );
};
