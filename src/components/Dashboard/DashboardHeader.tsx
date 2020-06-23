import React, { useEffect } from "react";
import "./DashboardHeader.scss";

import {
  useGlobalState,
  setGlobalState,
  getGlobalState
} from "react-global-state-hook";
import { MODAL } from "../Modal";
import ReactPlayer from "react-player";
import { postVideo, VIDEOS } from "../../stores/videos";
import { DIRECTORY_TYPES } from "../../stores/folder";

export const VIDEO_DETECTED = "VIDEO_DETECTED";

const onFocus = async () => {
  const videos = getGlobalState(VIDEOS);
  const url = await navigator.clipboard.readText();
  const add = videos.every((v) => v.url !== url);
  // await navigator.clipboard.writeText("");
  if (ReactPlayer.canPlay(url) && add) {
    setGlobalState(VIDEO_DETECTED, url);
  }
};

export const Header = () => {
  const [menuOpen, setMenuOpen] = useGlobalState("MENU_OPEN", true);
  const [profileOpen, setProfileOpen] = useGlobalState("PROFILE_OPEN", false);
  const [url] = useGlobalState(VIDEO_DETECTED);

  useEffect(() => {
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
    };
  });

  const handleVideoAdd = () => {
    setGlobalState(MODAL, {
      component: DIRECTORY_TYPES.VIDEO,
      props: {
        url,
        onSubmit: (values) => postVideo(values)
      }
    });
  };

  return (
    <header>
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        className={`header_menu ${menuOpen ? "open" : ""}`}
      >
        <i className="material-icons">menu</i>
      </div>
      <Add />
      <div className="header_logo">
        {!!url && (
          <button onClick={handleVideoAdd}>
            <i className="material-icons">ondemand_video</i>
            Video
            <i className="material-icons">add</i>
          </button>
        )}
      </div>
      <div className="header_search">
        {/* <i className="material-icons">search</i> */}
      </div>
      <div className="header_profile">
        <div onClick={() => setProfileOpen(!profileOpen)}>
          <i className="material-icons">person</i>
        </div>
      </div>
    </header>
  );
};

const Add = () => {
  const openNew = () => {
    setGlobalState(MODAL, {
      component: "new"
    });
  };

  return (
    <div className="menu-add">
      <button onClick={openNew}>
        <i className="material-icons">add</i>
        New
      </button>
    </div>
  );
};
