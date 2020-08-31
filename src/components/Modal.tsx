import React, { useRef } from "react";
import "./Modal.scss";

// Consideration: lazy load all the modal content
import { Folder } from "../forms/Folder";
import { Video } from "../forms/Video";
import { Playlist } from "../forms/Playlist";
import { SelectFolder } from "../forms/SelectFolder";
import { Share } from "../forms/Share";
import { Replay } from "../forms/Replay";
import { usegs, sgs } from "../utils/rxGlobal";
import { SelectPlaylist } from "../forms/SelectPlaylist";
import { RequestAccess } from "../forms/RequestAccess";
import { RequestSupport } from "../forms/RequestSupport";
import { Profile } from "../forms/Profile";
import { Auth } from "../forms/Auth";

export const MODAL = "MODAL";

const INITIAL_CONFIG = {
  component: "",
  props: {}
};

const COMPONENTS = {
  FOLDER: Folder,
  VIDEO: Video,
  PLAYLIST: Playlist,
  SELECTFOLDER: SelectFolder,
  SHARE: Share,
  REPLAY: Replay,
  SELECT_PLAYLIST: SelectPlaylist,
  REQUEST_ACCESS: RequestAccess,
  REQUEST_SUPPORT: RequestSupport,
  PROFILE: Profile,
  AUTH: Auth
};

let preventClose = false;

export const Modal = () => {
  const [modal, setModal] = usegs(MODAL, INITIAL_CONFIG);
  const ref: any = useRef(null);

  const component = (modal.component || "").toUpperCase();

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

  const handleMouseDown = (e) => {
    const clickInside = e.target !== ref.current;
    if (clickInside) {
      preventClose = true;
    }
  };

  const handleMouseUp = (e) => {
    if (!preventClose && e.target.classList.contains("modal")) {
      preventClose = false;
      setModal(INITIAL_CONFIG);
    } else {
      preventClose = false;
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
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="modal centered-grid full-screen"
    >
      {renderComponent(component)}
    </div>
  );
};
