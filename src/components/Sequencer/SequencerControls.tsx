import React, { useEffect } from "react";
import {
  useGlobalState,
  setGlobalState,
  getGlobalState
} from "react-global-state-hook";
import { SEQUENCER_PLAYER_PLAYING, SEQUENCER_PLAYER } from "./SequencerVideo";
import { PLAYER_PROGRESS } from "../../views/Sequencer";

const handleControls = (e) => {
  const event = e.detail;
  if (event === "play") {
    setGlobalState(
      SEQUENCER_PLAYER_PLAYING,
      !getGlobalState(SEQUENCER_PLAYER_PLAYING)
    );
  } else if (event === "forward" || event === "rewind") {
    const { player } = getGlobalState(SEQUENCER_PLAYER);
    if (player) {
      const progress = getGlobalState(PLAYER_PROGRESS);
      const to =
        event === "forward"
          ? progress.playedSeconds + 5
          : progress.playedSeconds - 5;
      player.seekTo(to, "seconds");
    }
  }
};

export const SequencerControls = () => {
  const [playing] = useGlobalState(SEQUENCER_PLAYER_PLAYING);

  useEffect(() => {
    document.addEventListener("controls", handleControls);
    return () => document.removeEventListener("controls", handleControls);
  }, []);

  return (
    <div className="sequencer_controls z1 gap-xs bg-white stretched-grid">
      <button>
        <i className="material-icons">{playing ? "pause" : "play_arrow"}</i>
      </button>
      <button>
        <i className="material-icons">fast_rewind</i>
      </button>
      <button>
        <i className="material-icons">fast_forward</i>
      </button>
      <button>
        <i className="material-icons">keyboard_arrow_up</i>
      </button>
      <button>
        <i className="material-icons">keyboard_arrow_down</i>
      </button>
      <button>
        <i className="material-icons">slow_motion_video</i>
      </button>
    </div>
  );
};
