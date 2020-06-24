import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { setGlobalState } from "react-global-state-hook";
import { MODAL } from "../Modal";

// Simple player with:
// loop button
// play/pause
// seekToSlider?
// share button
// save button when logged in

export const VideoViewer = ({ video }) => {
  const [playing, setPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  const player: any = useRef();
  const ref = (p) => (player.current = p);

  const handleReady = () => setPlayerReady(true);

  useEffect(() => {
    if (playerReady) {
      setPlaying(true);
    }
  }, [playerReady]);

  const handleReplay = () => {
    player.current.seekTo(0);
    setPlaying(true);
  };

  const handleEnd = () => {
    setGlobalState(MODAL, {
      component: "replay",
      props: {
        onReplay: handleReplay
      }
    });
  };

  return (
    <div className="sequence_viewer">
      <ReactPlayer
        className={"player_viewer"}
        height="100%"
        width="100%"
        playing={playing}
        ref={ref}
        url={video.url}
        onReady={handleReady}
        onEnded={handleEnd}
        controls={true}
      />
    </div>
  );
};
