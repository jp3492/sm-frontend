import React from "react";
import { SELECTED_SEQUENCES, deleteSequences } from "../../stores/sequences";
import { useGlobalState, setGlobalState } from "react-global-state-hook";
import { MODAL } from "../Modal";
import { DIRECTORY_TYPES } from "../../stores/folder";
import { handleShare } from "../Dashboard/Directory";
import { TAGGER_FAST_TAG } from "./Tagger";

export const SequencerActions = () => {
  const [selectedSequences, setSelectedSequences] = useGlobalState(
    SELECTED_SEQUENCES
  );
  const [quickTag, setQuickTag] = useGlobalState(TAGGER_FAST_TAG);

  const disabled = selectedSequences.length === 0;

  const handleSave = () =>
    setGlobalState(MODAL, {
      component: DIRECTORY_TYPES.PLAYLIST,
      onClose: () => setSelectedSequences([]),
      props: {
        items: selectedSequences.map((s) => `${DIRECTORY_TYPES.SEQUENCE}:${s}`)
      }
    });

  const handleRemove = () => {
    // check with backend if its deletable
    deleteSequences(selectedSequences[0]);
    setSelectedSequences(selectedSequences.filter((s, i) => i !== 0));
  };

  const onShare = () =>
    handleShare(DIRECTORY_TYPES.SEQUENCE, selectedSequences[0]);

  return (
    <div className="sequencer_actions stretched-grid grid-ac-1">
      <button
        className="centered-grid grid-tc-mm pd-01 gap-s"
        onClick={() => setQuickTag(!quickTag)}
      >
        <i className="material-icons">
          {quickTag ? "check_box" : "check_box_outline_blank"}
        </i>
        <small>
          Fast <br />
          Tagging
        </small>
      </button>
      <button onClick={handleSave} disabled={disabled}>
        <i className="material-icons">playlist_add</i>
      </button>
      <button onClick={handleRemove} disabled={selectedSequences.length !== 1}>
        <i className="material-icons">delete</i>
      </button>
      <button onClick={onShare} disabled={selectedSequences.length !== 1}>
        <i className="material-icons">share</i>
      </button>
    </div>
  );
};
