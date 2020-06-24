import React from "react";

import { useGlobalState, setGlobalState } from "react-global-state-hook";
import {
  FILTERED_SEQUENCES,
  SELECTED_SEQUENCES,
  EDITING_SEQUENCE
} from "../../stores/sequences";

let timeout;

export const SequencerList = ({ sequences }) => {
  const [selectedSequences, setSelectedSequences] = useGlobalState(
    SELECTED_SEQUENCES
  );

  const handleSelect = (e) => {
    const id = e.target.closest("li").id;

    if (selectedSequences.includes(id)) {
      setSelectedSequences(selectedSequences.filter((s) => s !== id));
    } else {
      setSelectedSequences([...selectedSequences, id]);
    }
  };

  const activateSequence = (id) => {
    console.log("Activeated Sequence");
  };

  const editSequence = (id) => {
    const sequence = sequences.find((s) => s.id === id);
    setGlobalState(EDITING_SEQUENCE, sequence);
  };

  const handleClick = (e) => {
    const id = e.target.closest("li").id;
    if (timeout) {
      editSequence(id);
      clearTimeout(timeout);
      timeout = undefined;
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        activateSequence(id);
        clearTimeout(timeout);
        timeout = undefined;
      }, 200);
    }
  };

  return (
    <ul className="sequencer_list-list">
      {sequences.map((s, i) => {
        const selected = selectedSequences.includes(s.id);
        return (
          <li onClick={handleClick} id={s.id} key={i}>
            <i onClick={handleSelect} className="material-icons">
              {selected ? "check_box" : "check_box_outline_blank"}
            </i>
            <div>
              <span>{s.start}</span>
              <span>{s.stop}</span>
            </div>
            <label>{s.label}</label>
          </li>
        );
      })}
    </ul>
  );
};
