import React from "react";
import "./Modal.scss";
import { Folder } from "../forms/Folder";
import { Video } from "../forms/Video";
import { Playlist } from "../forms/Playlist";
import { New } from "../forms/New";
import { SelectFolder } from "../forms/SelectFolder";
import { Share } from "../forms/Share";
import { Replay } from "../forms/Replay";
import { usegs, sgs } from "../utils/rxGlobal";
import { SelectPlaylist } from "../forms/SelectPlaylist";
import { RequestAccess } from "../forms/RequestAccess";
import { RequestSupport } from "../forms/RequestSupport";
import { Profile } from "../forms/Profile";

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
  SELECTFOLDER: SelectFolder,
  SHARE: Share,
  REPLAY: Replay,
  SELECT_PLAYLIST: SelectPlaylist,
  REQUEST_ACCESS: RequestAccess,
  REQUEST_SUPPORT: RequestSupport,
  PROFILE: Profile
};

export const Modal = () => {
  const [modal, setModal] = usegs(MODAL, INITIAL_CONFIG);

  const component = modal.component.toUpperCase();

  const closeModal = (payload?: any) => {
    if (modal.onClose) {
      modal.onClose(payload);
    }
    sgs(MODAL, INITIAL_CONFIG);
  };

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
    <div onClick={handleClick} className="modal centered-grid full-screen">
      {renderComponent(component)}
    </div>
  );
};
