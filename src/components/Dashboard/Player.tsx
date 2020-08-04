import React, { useState, useEffect, useMemo, useRef } from "react";
import "./Player.scss";
import {
  useGlobalState,
  setGlobalState,
  getGlobalState
} from "react-global-state-hook";
import ReactPlayer from "react-player";
import { PLAYLIST_ITEMS } from "../../stores/playlist_items";
import { DIRECTORY_TYPES } from "../../stores/folder";

export const PLAYER = "PLAYER";
export const PLAYER_POSITION = "PLAYER_POSITION";
export const PLAYER_PLAYING = "PLAYER_PLAYING";
export const PLAYER_POSITION_CLICK_COUNT = "PLAYER_POSITION_CLICK_COUNT";
export const PLAYER_ITEM = "PLAYER_ITEM";

setGlobalState(PLAYER_PLAYING, false);

const onPlayerEnd = (id) => {
  const event = new CustomEvent("playerdone", {
    detail: {
      id
    }
  });
  document.dispatchEvent(event);
};

export const togglePlay = () => {
  const playing = getGlobalState(PLAYER_PLAYING);
  setGlobalState(PLAYER_PLAYING, !playing);
};

// when clicked on a video, the player needs to change urls if neccessary
// if correct url is used, player.seekTo(0)

// when a sequence is clicked, the player need to change urls if neccessary
// if correct url is used, player.seekTo(start)
let PLAYER_COUNT = 0;

export const openPlayer = (e) => {
  PLAYER_COUNT++;
  const items = getGlobalState(PLAYLIST_ITEMS);

  const item = items.find(
    (i) => i.id === (typeof e == "string" ? e : e.target.closest("li").id)
  );
  setGlobalState(PLAYER_ITEM, { ...item, count: PLAYER_COUNT });
};

export const Player = () => {
  const [item, setItem] = useGlobalState(PLAYER_ITEM);

  const [playing, setPlaying] = useGlobalState(PLAYER_PLAYING);
  const [playerReady, setPlayerReady] = useState(false);

  const [maximized, setMaximized] = useState(false);

  const player = useRef();
  const ref = (p) => (player.current = p);

  const handleReady = () => setPlayerReady(true);

  const lastUrl = useRef();
  const url = useMemo(() => (item ? item.url : ""), [item]);

  useEffect(() => {
    if (playerReady) {
      startPlayer();
    }
  }, [playerReady]);

  useEffect(() => {
    if (playerReady && item && lastUrl.current === item.url) {
      startPlayer();
    }
    return () => (lastUrl.current = item ? item.url : "");
  }, [item, playerReady]);

  const startPlayer = () => {
    //
    const Player: ReactPlayer | any = player.current;
    if (Player) {
      if (item.type === DIRECTORY_TYPES.VIDEO) {
        Player.seekTo(0);
      } else if (item.type === DIRECTORY_TYPES.SEQUENCE) {
        Player.seekTo(item.start, "seconds");
      }
      setPlaying(true);
    } else {
      console.log("PLAYER NOT READY ON START PLAYER");
    }
  };

  const stopPlayer = () => {
    player.current = undefined;
    setPlayerReady(false);
    setPlaying(false);
    setItem();
  };

  const handleProgress = ({ playedSeconds }) => {
    if (item.stop && playedSeconds >= item.stop) {
      onPlayerEnd(item.id);
    }
  };

  const handleResize = () => {
    setMaximized(!maximized);
  };

  console.log(playing);

  return (
    <div
      className={`video-preview bg-white overflow-h shadow-l ${
        maximized ? "" : "minimized"
      } ${url ? "open" : ""}`}
    >
      {url && (
        <>
          <div className="video-preview__header aligned-grid pd-05 grid-tc-1mm z1">
            <h4>{item ? item.label : "Loading Player"}</h4>
            <i onClick={handleResize} className="material-icons">
              {maximized ? "minimize" : "maximize"}
            </i>
            <i onClick={stopPlayer} className="material-icons">
              close
            </i>
          </div>
          <ReactPlayer
            className={"player"}
            height="calc(100% - 45px)"
            width="auto"
            pip={true}
            playing={playing}
            ref={ref}
            url={url}
            onReady={handleReady}
            onProgress={handleProgress}
            controls={true}
          />
        </>
      )}
    </div>
  );
};
