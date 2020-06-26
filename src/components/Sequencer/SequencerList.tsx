import React, { useMemo, useState, useEffect } from "react";

import {
  useGlobalState,
  setGlobalState,
  getGlobalState
} from "react-global-state-hook";
import {
  FILTERED_SEQUENCES,
  SELECTED_SEQUENCES,
  EDITING_SEQUENCE
} from "../../stores/sequences";
import {
  SEQUENCER_PLAYER,
  SEQUENCER_PLAYER_PLAYING,
  SEQUENCER_PLAYING_SEQUENCES
} from "./SequencerVideo";
import { secondsToTime } from "../../utils/secondsToTime";

let timeout;

export const SequencerList = ({ sequences: seqs, sequenceId }) => {
  const [selectedSequences, setSelectedSequences] = useGlobalState(
    SELECTED_SEQUENCES
  );
  const [sequences] = useGlobalState(FILTERED_SEQUENCES);
  const [activeSequenceId, setActiveSequenceId] = useState(sequenceId);
  const [playingSequenceIds] = useGlobalState(SEQUENCER_PLAYING_SEQUENCES);
  const [editingSequence, setEditingSequence] = useGlobalState(
    EDITING_SEQUENCE
  );

  useEffect(() => {
    if (sequenceId) {
      const sequence = sequences.find((s) => s.id === sequenceId);
      if (sequence) {
        seekToSequence(sequenceId);
      }
    }
  }, [sequenceId, sequences]);

  const handleSelect = (e) => {
    e.stopPropagation();
    const id = e.target.closest("li").id;

    if (selectedSequences.includes(id)) {
      setSelectedSequences(selectedSequences.filter((s) => s !== id));
    } else {
      setSelectedSequences([...selectedSequences, id]);
    }
  };

  const editSequence = (id) => {
    const sequence = sequences.find((s) => s.id === id);
    setEditingSequence(sequence);
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
        setActiveSequenceId(id);
        // cant use an effect here because this will not fire when clicked on the same id
        seekToSequence(id);
        clearTimeout(timeout);
        timeout = undefined;
      }, 200);
    }
  };

  const seekToSequence = (id) => {
    const { player, ready } = getGlobalState(SEQUENCER_PLAYER);
    if (player && ready) {
      const sequence = sequences.find((s) => s.id === id);
      if (sequence) {
        player.seekTo(sequence.start, "seconds");
        setGlobalState(SEQUENCER_PLAYER_PLAYING, true);
      }
    } else {
      setTimeout(() => {
        seekToSequence(id);
      }, 500);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    const id = e.target.closest("li").id;
    editSequence(id);
  };

  const sortedSequences = useMemo(
    () => sequences.sort((a, b) => a.start - b.start),
    [sequences]
  );

  return (
    <ul className="sequencer_list-list">
      {sortedSequences.map((s, i) => {
        const selected = selectedSequences.includes(s.id);
        const active = activeSequenceId === s.id;
        const playing = playingSequenceIds.includes(s.id);
        const editing = editingSequence && editingSequence.id === s.id;
        return (
          <li
            data-active={active}
            data-playing={playing}
            data-editing={editing}
            onClick={handleClick}
            id={s.id}
            key={i}
          >
            <div>
              <span>{secondsToTime(s.start)}</span>
              <span>{secondsToTime(s.stop)}</span>
            </div>
            <label>
              {s.label}
              <i onClick={handleEdit} className="material-icons">
                edit
              </i>
            </label>
            <i onClick={handleSelect} className="material-icons">
              {selected ? "check_box" : "check_box_outline_blank"}
            </i>
          </li>
        );
      })}
    </ul>
  );
};
