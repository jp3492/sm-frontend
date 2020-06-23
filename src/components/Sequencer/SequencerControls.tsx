import React, { useState, useEffect } from "react";
import { useGlobalState } from "react-global-state-hook";
import { PLAYER_PLAYING } from "../Dashboard/Player";
import { onClickOutside } from "../../utils/clickOutside";

// will later be set differently for every provider
const speeds = [0.5, 1, 1.5, 2];

export const SequencerControls = () => {
  const [playing] = useGlobalState(PLAYER_PLAYING);
  const [speed] = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [volumeOpen, setVolumeOpen] = useState(false);

  useEffect(() => {
    if (speedOpen) {
      onClickOutside(".sequencer_controls-speed", () => {
        setSpeedOpen(false);
      });
    }
  }, [speedOpen]);

  useEffect(() => {
    if (volumeOpen) {
      onClickOutside(".sequencer_controls-volume", () => {
        setVolumeOpen(false);
      });
    }
  }, [volumeOpen]);

  return (
    <div className="sequencer_controls">
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
        <div>
          <label>
            {speed}
            <i className="material-icons">speed</i>
          </label>
          {speedOpen && (
            <div className="sequencer_controls-speed">
              {/* need to add logic to only enable on players that support speed */}
              {/* also display different options depending on provider */}
              {speeds.map((s, i) => (
                <div key={i}>s</div>
              ))}
            </div>
          )}
        </div>
      </button>
      <button>
        <label>
          {volume}
          <i className="material-icons">volume_down</i>
        </label>
        {volumeOpen && (
          <div className="sequencer_controls-volume">
            <input
              type="range"
              min="0"
              max="1"
              onChange={({ target: { value } }) => setVolume(Number(value))}
            />
          </div>
        )}
      </button>
      <button>
        <i className="material-icons">keyboard_arrow_up</i>
      </button>
      <button>
        <i className="material-icons">keyboard_arrow_down</i>
      </button>
    </div>
  );
};
