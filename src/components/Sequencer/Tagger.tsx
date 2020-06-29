import React, { useEffect } from "react";
import {
  useGlobalState,
  getGlobalState,
  setGlobalState
} from "react-global-state-hook";
import { PLAYER_PROGRESS, SEQUENCER_VIDEO } from "../../views/Sequencer";
import {
  EDITING_SEQUENCE,
  patchSequence,
  postSequence
} from "../../stores/sequences";
import { secondsToTime } from "../../utils/secondsToTime";

export const TAGGER_ACTIVE_TIME = "TAGGER_ACTIVE_TIME";
export const TAGGER_START = "TAGGER_START";
export const TAGGER_STOP = "TAGGER_STOP";
export const TAGGER_LABEL = "TAGGER_LABEL";

const handleControls = (e) => {
  const event = e.detail;
  if (event === "tag") {
    const activeTime = getGlobalState(TAGGER_ACTIVE_TIME);
    const start = getGlobalState(TAGGER_START);
    if (!activeTime && !start) {
      console.log("starting START");
      setGlobalState(TAGGER_ACTIVE_TIME, "start");
    } else if (activeTime === "start") {
      console.log("SETTING START");
      setStart();
    } else if (activeTime === "stop") {
      console.log("SETTING STOP");
      setStop();
    } else {
      console.log("SBMITTING");
      handleSubmit();
    }
  } else if (event === "tagback") {
    const activeTime = getGlobalState(TAGGER_ACTIVE_TIME);
    const start = getGlobalState(TAGGER_START);
    // only when start has a value
    console.log({ activeTime, start });

    if (activeTime === "start") {
      resetTagger();
    } else if (activeTime === "stop") {
      setGlobalState(TAGGER_ACTIVE_TIME, "start");
    } else if (!activeTime && start) {
      setGlobalState(TAGGER_ACTIVE_TIME, "stop");
    }
  }
};

const handleSubmit = () => {
  const editingSequence = getGlobalState(EDITING_SEQUENCE);
  const start = getGlobalState(TAGGER_START);
  const stop = getGlobalState(TAGGER_STOP);
  const label = getGlobalState(TAGGER_LABEL);
  if (!label) {
    alert("Label required!");
  } else {
    if (editingSequence) {
      patchSequence({
        ...editingSequence,
        start,
        stop,
        label
      });
    } else {
      const { id, url } = getGlobalState(SEQUENCER_VIDEO);
      postSequence({
        videoId: id,
        start,
        stop,
        label,
        url
      });
    }
    resetTagger();
  }
};

const handleStartClick = (e) => {
  if (e) e.stopPropagation();
  setStart();
};

const setStart = () => {
  const { playedSeconds = 0 } = getGlobalState(PLAYER_PROGRESS);
  const time = Number(playedSeconds.toFixed(2));
  setGlobalState(TAGGER_START, time);
  setGlobalState(TAGGER_ACTIVE_TIME, "stop");
};

const handleStopClick = (e) => {
  if (e) e.stopPropagation();
  setStop();
};

const setStop = () => {
  const { playedSeconds } = getGlobalState(PLAYER_PROGRESS);
  const time = Number(playedSeconds.toFixed(2));
  setGlobalState(TAGGER_STOP, time);
  setGlobalState(TAGGER_ACTIVE_TIME, undefined);
};

const handleDismiss = () => {
  resetTagger();
  setGlobalState(EDITING_SEQUENCE, undefined);
};

const resetTagger = () => {
  setGlobalState(TAGGER_ACTIVE_TIME, "start");
  setGlobalState(TAGGER_LABEL, "");
  setGlobalState(TAGGER_START, undefined);
  setGlobalState(TAGGER_STOP, undefined);
};

export const Tagger = () => {
  const [activeTime, setActiveTime]: any = useGlobalState(
    TAGGER_ACTIVE_TIME,
    "start"
  );
  const [editingSequence] = useGlobalState(EDITING_SEQUENCE);

  const [label, setLabel] = useGlobalState(TAGGER_LABEL, "");
  const [progress] = useGlobalState(PLAYER_PROGRESS);

  const [start, setStart]: any = useGlobalState(TAGGER_START);
  const [stop, setStop]: any = useGlobalState(TAGGER_STOP);

  useEffect(() => {
    const ta = document.getElementById("tagInput");
    if (ta) {
      ta.focus();
    }
  }, [start, stop, activeTime]);

  useEffect(() => {
    document.addEventListener("controls", handleControls);
    return () => document.removeEventListener("controls", handleControls);
  }, []);

  useEffect(() => {
    if (editingSequence) {
      console.log("EDIETING");

      setStart(editingSequence.start);
      setStop(editingSequence.stop);
      setLabel(editingSequence.label);
      setActiveTime();
    }
  }, [editingSequence, setStart, setStop, setLabel, setActiveTime]);

  const activateStart = () =>
    setActiveTime(activeTime === "start" ? "" : "start");
  const activateStop = () => setActiveTime(activeTime === "stop" ? "" : "stop");
  const handleLabelChange = ({ target: { value } }) => setLabel(value);

  return (
    <div className="sequencer_list-tagger shadow-l grid">
      <div className="sequencer_list-tagger-times grid bg-grey-light gap-xs">
        <div
          className="bg-white centered-grid grid-tc-m1"
          onClick={activateStart}
        >
          <span className="pd-1">
            {activeTime === "start"
              ? secondsToTime(progress.playedSeconds || 0)
              : secondsToTime(start)}
          </span>
          {activeTime === "start" && (
            <button className="pd-1 bg-grey" onClick={handleStartClick}>
              Set Tag
            </button>
          )}
        </div>
        {(start || start === 0) && (
          <div
            className="bg-white centered-grid grid-tc-m1"
            onClick={activateStop}
          >
            <span className="pd-1">
              {activeTime === "stop"
                ? secondsToTime(progress.playedSeconds)
                : secondsToTime(stop)}
            </span>
            {activeTime === "stop" && (
              <button className="pd-1 bg-grey" onClick={handleStopClick}>
                Set Stop
              </button>
            )}
          </div>
        )}
      </div>
      {(start || start === 0) && (
        <>
          <textarea
            className="pd-1"
            id="tagInput"
            onChange={handleLabelChange}
            value={label}
            placeholder="Add Label to Tag..."
          />
          <div className="sequencer_list-tagger-buttons stretched-grid gap-xs bg-grey-light">
            <button className="bg-white pd-1" onClick={handleDismiss}>
              {editingSequence ? "Dismiss" : "Close"}
            </button>
            <button
              className="bg-white pd-1"
              disabled={!start || !label}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
};
