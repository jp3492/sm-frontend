import React, { useState, useEffect } from "react";
import { useGlobalState } from "react-global-state-hook";
import { PLAYER_PROGRESS } from "../../views/Sequencer";
import { EDITING_SEQUENCE, patchSequence } from "../../stores/sequences";

export const Tagger = ({ onSubmit }) => {
  // states: idle, startSet, stopSet... on submit jump back to idle
  // and have list manage loading feedback
  const [state, setState] = useState("idle");
  const [label, setLabel] = useState("");
  const [progress] = useGlobalState(PLAYER_PROGRESS);

  const [start, setStart] = useState();
  const [stop, setStop] = useState();

  const [activeTime, setActiveTime]: any = useState("start");

  const [editingSequence, setEditingSequence] = useGlobalState(
    EDITING_SEQUENCE
  );

  useEffect(() => {
    if (editingSequence) {
      setStart(editingSequence.start);
      setStop(editingSequence.stop);
      setLabel(editingSequence.label);
      setState("stopSet");
      setActiveTime();
    }
  }, [editingSequence]);

  const setTag = () => {
    setStart(progress.playedSeconds);
    setState("startSet");
    setActiveTime("stop");
  };

  const activateStart = () => setActiveTime("start");
  const activateStop = () => setActiveTime("stop");

  const handleSetStop = () => {
    setStop(progress.playedSeconds);
    setActiveTime();
    setState("stopSet");
  };

  const handleSetStart = () => {
    setStop(progress.playedSeconds);
    setActiveTime("stop");
    setState("startSet");
  };

  const handleSubmit = () => {
    if (editingSequence) {
      patchSequence({
        ...editingSequence,
        start,
        stop,
        label
      });
    } else {
      onSubmit({ start, stop, label });
    }
    resetTagger();
  };

  const resetTagger = () => {
    setActiveTime("");
    setLabel("");
    setState("idle");
    setEditingSequence(null);
  };

  return (
    <div
      data-state={!progress ? "loading" : state}
      className="sequencer_list-tagger"
    >
      {!progress ? (
        <p>Loading...</p>
      ) : state === "idle" ? (
        <>
          <span>{progress.playedSeconds}</span>
          <button onClick={setTag}>Set Tag</button>
        </>
      ) : (
        <>
          <span
            className={activeTime === "start" ? "active" : ""}
            onClick={activateStart}
          >
            {activeTime === "start" ? progress.playedSeconds : start}
          </span>
          <i className="material-icons">arrow_right_alt</i>
          <span
            className={activeTime === "stop" ? "active" : ""}
            onClick={activateStop}
          >
            {activeTime === "stop"
              ? progress.playedSeconds
              : stop
              ? stop
              : "Set Stop"}
          </span>
          <textarea
            onChange={({ target: { value } }) => setLabel(value)}
            value={label}
          />
          {activeTime === "start" ? (
            <button onClick={handleSetStart}>Set Start</button>
          ) : activeTime === "stop" ? (
            <button onClick={handleSetStop}>Set Stop</button>
          ) : (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </>
      )}
    </div>
  );
};
