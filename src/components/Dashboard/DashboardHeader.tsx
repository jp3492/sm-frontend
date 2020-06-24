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

export const Header = () => {
  const [menuOpen, setMenuOpen] = useGlobalState("MENU_OPEN", true);
  const [profileOpen, setProfileOpen] = useGlobalState("PROFILE_OPEN", false);
  const [url, setUrl] = useGlobalState(VIDEO_DETECTED);

  useEffect(() => {
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
    };
  });

  const onFocus = async () => {
    const url = await navigator.clipboard.readText();
    addUrl(url);
  };

  const handleChangeUrl = ({ target: { value } }) => {
    addUrl(value);
  };

  const addUrl = (url) => {
    const videos = getGlobalState(VIDEOS);
    const add = videos.every((v) => v.url !== url);
    if (ReactPlayer.canPlay(url) && add) {
      setUrl(url);
    }
  };

  const handleVideoAdd = () => {
    setGlobalState(MODAL, {
      component: DIRECTORY_TYPES.VIDEO,
      props: {
        url,
        onSubmit: (values) => postVideo(values)
      }
    });
  };

  const handlePaste = async () => {
    const url = await navigator.clipboard.readText();
    addUrl(url);
  };

  return (
    <header>
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        className={`header_menu ${menuOpen ? "open" : ""}`}
      >
        <i className="material-icons">{menuOpen ? "menu_open" : "menu"}</i>
      </div>
      {/* <Add /> */}
      <div className="header_add">
        <i className="material-icons">ondemand_video</i>
        <input
          type="text"
          placeholder="Paste video url here:"
          value={url}
          onChange={handleChangeUrl}
        />
        {url ? (
          <button disabled={!url} onClick={handleVideoAdd}>
            <i className="material-icons">add</i>
          </button>
        ) : (
          <button onClick={handlePaste}>
            <i className="material-icons">content_paste</i>
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