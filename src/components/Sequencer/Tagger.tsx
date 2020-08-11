import React, { useEffect } from "react";
import { PLAYER_PROGRESS, SEQUENCER_VIDEO } from "../../views/Sequencer";
import {
  EDITING_SEQUENCE,
  patchSequence,
  postSequence
} from "../../stores/sequences";
import { secondsToTime } from "../../utils/secondsToTime";
import { ggs, sgs, usegs } from "../../utils/rxGlobal";

export const TAGGER_ACTIVE_TIME = "TAGGER_ACTIVE_TIME";
export const TAGGER_START = "TAGGER_START";
export const TAGGER_STOP = "TAGGER_STOP";
export const TAGGER_LABEL = "TAGGER_LABEL";
export const TAGGER_FAST_TAG = "TAGGER_QUICK_TAG";

sgs(TAGGER_FAST_TAG, false);

const handleControls = (e) => {
  const event = e.detail;
  const fastTagging = ggs(TAGGER_FAST_TAG);

  if (event === "tag") {
    const activeTime = ggs(TAGGER_ACTIVE_TIME);
    const start = ggs(TAGGER_START);

    if (fastTagging) {
      if (activeTime === "start") {
        setStart();
      } else {
        setStop();
        handleSubmit(true);
        setStart();
      }
    } else {
      if (!activeTime && !start) {
        console.log("starting START");
        sgs(TAGGER_ACTIVE_TIME, "start");
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
    }
  } else if (event === "tagback") {
    const activeTime = ggs(TAGGER_ACTIVE_TIME);
    const start = ggs(TAGGER_START);
    // only when start has a value
    if (activeTime === "start") {
      resetTagger();
    } else if (activeTime === "stop") {
      sgs(TAGGER_ACTIVE_TIME, "start");
    } else if (!activeTime && start) {
      sgs(TAGGER_ACTIVE_TIME, "stop");
    }
  } else if (event === "fasttagging") {
    sgs(TAGGER_FAST_TAG, !fastTagging);
  } else if (event === "close") {
    resetTagger();
  }
};

const handleSubmit = (fastTagging?: any) => {
  const editingSequence = ggs(EDITING_SEQUENCE);
  const start = ggs(TAGGER_START);
  const stop = ggs(TAGGER_STOP);
  const label = ggs(TAGGER_LABEL);
  if (!label) {
    alert("Label required!");
  } else {
    resetTagger(fastTagging);
    if (editingSequence) {
      patchSequence({
        ...editingSequence,
        start,
        stop,
        label
      });
    } else {
      const { id, url } = ggs(SEQUENCER_VIDEO);
      postSequence({
        videoId: id,
        start,
        stop,
        label,
        url
      });
    }
  }
};

const handleStartClick = (e) => {
  if (e) e.stopPropagation();
  setStart();
};

const setStart = () => {
  const { playedSeconds = 0 } = ggs(PLAYER_PROGRESS);
  const time = Number(playedSeconds.toFixed(2));
  sgs(TAGGER_START, time);
  sgs(TAGGER_ACTIVE_TIME, "stop");
};

const handleStopClick = (e) => {
  if (e) e.stopPropagation();
  setStop();
};

const setStop = () => {
  const { playedSeconds } = ggs(PLAYER_PROGRESS);
  const time = Number(playedSeconds.toFixed(2));
  sgs(TAGGER_STOP, time);
  sgs(TAGGER_ACTIVE_TIME, undefined);
};

const handleDismiss = () => {
  resetTagger();
  sgs(EDITING_SEQUENCE, undefined);
};

const resetTagger = (fastTagging?: boolean) => {
  sgs(TAGGER_ACTIVE_TIME, "start");
  sgs(TAGGER_LABEL, "");
  if (fastTagging) {
    setStart();
  } else {
    sgs(TAGGER_START, undefined);
  }
  sgs(TAGGER_STOP, undefined);
};

export const Tagger = () => {
  const [activeTime, setActiveTime]: any = usegs(TAGGER_ACTIVE_TIME, "start");
  const [editingSequence] = usegs(EDITING_SEQUENCE);

  const [label, setLabel] = usegs(TAGGER_LABEL, "");
  const [progress] = usegs(PLAYER_PROGRESS);

  const [start, setStart]: any = usegs(TAGGER_START);
  const [stop, setStop]: any = usegs(TAGGER_STOP);

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
