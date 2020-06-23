import React from "react";
import { SELECTED_SEQUENCES } from "../../stores/sequences";
import { useGlobalState } from "react-global-state-hook";

export const SequencerActions = () => {
  const [selectedSequences] = useGlobalState(SELECTED_SEQUENCES);

  const disabled = selectedSequences.length === 0;

  return (
    <div className="sequencer_actions">
      <button disabled={disabled}>
        <i className="material-icons">save</i>
      </button>
      <button disabled={disabled}>
        <i className="material-icons">playlist_add</i>
      </button>
      <button disabled={disabled}>
        <i className="material-icons">delete</i>
      </button>
      {selectedSequences.length <= 1 && (
        <button disabled={disabled}>
          <i className="material-icons">share</i>
        </button>
      )}
    </div>
  );
};
