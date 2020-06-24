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

export const SequenceViewer = ({ sequence }) => {
  const [playing, setPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  const player: any = useRef();
  const ref = (p) => (player.current = p);

  const handleReady = () => setPlayerReady(true);

  useEffect(() => {
    if (playerReady) {
      player.current.seekTo(sequence.start, "seconds");
      setPlaying(true);
    }
  }, [playerReady]);

  const handleReplay = () => {
    player.current.seekTo(sequence.start, "seconds");
    setPlaying(true);
  };

  const handleProgress = ({ playedSeconds }) => {
    if (sequence.stop && playedSeconds >= sequence.stop) {
      setPlaying(false);
      setGlobalState(MODAL, {
        component: "replay",
        props: {
          onReplay: handleReplay
        }
      });
    }
  };

  return (
    <div className="sequence_viewer">
      <ReactPlayer
        className={"player_viewer"}
        height="100%"
        width="100%"
        playing={playing}
        ref={ref}
        url={sequence.url}
        onReady={handleReady}
        onProgress={handleProgress}
      />
    </div>
  );
};
