import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  PV_PLAYING,
  ACTIVE_URL,
  PV_PLAYERS,
  playNext,
  nextStop
} from "./PlaylistViewer";
import { ggs, subgs, unsgs, ugs, sgs } from "../../utils/rxGlobal";
import ReactPlayer from "react-player";

const handleRef = (player, url) => {
  if (player === null) {
    return;
  }
  ugs(PV_PLAYERS, (players) => {
    return {
      ...players,
      [url]: {
        player,
        ready: false
      }
    };
  });
};

const handleReady = (url) =>
  ugs(PV_PLAYERS, (players) => {
    return {
      ...players,
      [url]: {
        ...players[url],
        ready: true
      }
    };
  });

const handlePlay = () => sgs(PV_PLAYING, true);
const handlePause = () => sgs(PV_PLAYING, false);

const handleProgress = (progress) => {
  if (!!nextStop && progress.playedSeconds >= nextStop) {
    playNext();
  } else if (!nextStop && progress.played === 1) {
    playNext();
  }
};

export const PlaylistViewerVideo = ({ url }) => {
  const [playing, setPlaying] = useState(false);
  const ref: any = useRef(null);

  const handleActive = useCallback((activeUrl) => {
    const isActive = activeUrl === url;
    ref.current.dataset.active = isActive;

    if (isActive) {
      setPlaying(ggs(PV_PLAYING));
    } else {
      setPlaying(false);
    }
  }, []);

  const handlePlaying = useCallback((isPlaying) => {
    const isActive = ref.current.dataset.active == "true";
    if (isActive) {
      setPlaying(isPlaying);
    } else {
      setPlaying(false);
    }
  }, []);

  useEffect(() => {
    subgs(ACTIVE_URL, handleActive);
    subgs(PV_PLAYING, handlePlaying);
    return () => {
      unsgs(ACTIVE_URL, handleActive);
      unsgs(PV_PLAYING, handlePlaying);
    };
  }, []);

  return (
    <div ref={ref} className="player" data-active="false">
      <ReactPlayer
        className={"player_viewer"}
        height="100%"
        width="100%"
        playing={playing}
        ref={(r) => handleRef(r, url)}
        url={url}
        onPlay={handlePlay}
        onPause={handlePause}
        onReady={() => handleReady(url)}
        onProgress={handleProgress}
        controls={true}
        progressInterval={100}
      />
    </div>
  );
};
