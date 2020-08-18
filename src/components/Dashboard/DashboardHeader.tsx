import React, { useEffect } from "react";
import "./DashboardHeader.scss";

import { MODAL } from "../Modal";
import ReactPlayer from "react-player";
import { postVideo, VIDEOS } from "../../stores/videos";
import { DIRECTORY_TYPES } from "../../stores/folder";
import { Link } from "react-router-dom";
import { MENU_OPEN } from "./Menu";
import { usegs, ggs, sgs } from "../../utils/rxGlobal";
import { logout } from "../../services/auth";

export const VIDEO_DETECTED = "VIDEO_DETECTED";

export const Header = ({ push }) => {
  const [menuOpen, setMenuOpen] = usegs(MENU_OPEN, true);
  const [url, setUrl] = usegs(VIDEO_DETECTED);

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
    const videos = ggs(VIDEOS);
    const add = videos.every((v) => v.url !== url);
    if (ReactPlayer.canPlay(url) && add) {
      setUrl(url);
    }
  };

  const handleVideoAdd = () => {
    sgs(MODAL, {
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

  const handleProfileClick = async () => {
    await logout();
    push("/auth/login");
  };

  const handleClearSearch = () => setUrl("");

  return (
    <header className="dashboard-header || grid grid-tc-mm11m align-i-c || bg-grey || shadow-s z1">
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        className={`header_menu ${menuOpen ? "open" : ""}`}
      >
        <i className="material-icons">{menuOpen ? "menu_open" : "menu"}</i>
      </div>
      <div className="header_logo || pd-01 || cl-content-icon">
        <Link to="/">
          <h2>Viden</h2>
        </Link>
      </div>
      {/* <Add /> */}
      <div className="header_add grid grid-tc-m1mm" data-active={!!url}>
        <i className="material-icons rounded">ondemand_video</i>
        <input
          type="text"
          placeholder="Paste video url here:"
          value={url}
          onChange={handleChangeUrl}
        />
        <i onClick={handleClearSearch} className="material-icons">
          clear
        </i>
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
      <div className="header_profile stretched-grid">
        <div onClick={handleProfileClick}>
          <i className="material-icons">person</i>
        </div>
      </div>
    </header>
  );
};
