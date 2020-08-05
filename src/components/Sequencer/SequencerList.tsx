import React, { useMemo, useState, useEffect, useCallback } from "react";
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
import { usegs, ggs, sgs } from "../../utils/rxGlobal";

let timeout;
let lastSort;

export const SequencerList = ({ sequences: seqs, sequenceId }) => {
  const [selectedSequences, setSelectedSequences] = usegs(
    SELECTED_SEQUENCES
  );
  const [sequences] = usegs(FILTERED_SEQUENCES);
  const [activeSequenceId, setActiveSequenceId] = useState(sequenceId);
  const [playingSequenceIds] = usegs(SEQUENCER_PLAYING_SEQUENCES);
  const [editingSequence, setEditingSequence] = usegs(
    EDITING_SEQUENCE
  );
  const [sortTime, setSortTime]: any = useState("asc");
  const [sortLabel, setSortLabel]: any = useState();

  useEffect(() => {
    lastSort = "time";
  }, [sortTime]);

  useEffect(() => {
    lastSort = "label";
  }, [sortLabel]);

  useEffect(() => {
    if (sequenceId) {
      const sequence = sequences.find((s) => s.id === sequenceId);
      if (sequence) {
        seekToSequence(sequenceId);
      }
    }
  }, [sequenceId, sequences]);

  const handleSelect = useCallback(
    (e) => {
      e.stopPropagation();
      const id = e.target.closest("li").id;

      if (selectedSequences.includes(id)) {
        setSelectedSequences(selectedSequences.filter((s) => s !== id));
      } else {
        setSelectedSequences([...selectedSequences, id]);
      }
    },
    [selectedSequences]
  );

  const editSequence = useCallback(
    (id) => {
      const sequence = sequences.find((s) => s.id === id);
      setEditingSequence(sequence);
    },
    [sequences]
  );

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

  const seekToSequence = useCallback(
    (id) => {
      const { player, ready } = ggs(SEQUENCER_PLAYER);
      if (player && ready) {
        const sequence = sequences.find((s) => s.id === id);
        if (sequence) {
          player.seekTo(sequence.start, "seconds");
          sgs(SEQUENCER_PLAYER_PLAYING, true);
        }
      } else {
        setTimeout(() => {
          seekToSequence(id);
        }, 500);
      }
    },
    [sequences]
  );

  const handleEdit = (e) => {
    e.stopPropagation();
    const id = e.target.closest("li").id;
    editSequence(id);
  };

  const sortedSequences = useMemo(() => {
    let sorted = sequences.sort((a, b) => {
      if (sortTime === "asc") {
        return a.start - b.start;
      }
      return b.start - a.start;
    });
    if (!!sortLabel && lastSort === "label") {
      sorted = sorted.sort((a, b) => {
        var nameA = a.label.toUpperCase(); // ignore upper and lowercase
        var nameB = b.label.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return sortLabel === "asc" ? -1 : 1;
        }
        if (nameA > nameB) {
          return sortLabel === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [sequences, sortLabel, sortTime]);

  useEffect(() => {
    document.addEventListener("controls", handleControls);
    return () => document.removeEventListener("controls", handleControls);
  }, [sortedSequences, activeSequenceId]);

  const handleControls = (e) => {
    const event = e.detail;
    const activeIndex = sortedSequences.findIndex(
      (i) => i.id == activeSequenceId
    );
    if (event === "next" || event === "back") {
      let nextIndex;
      if (event === "next") {
        nextIndex =
          activeIndex < sortedSequences.length - 1 ? activeIndex + 1 : 0;
      } else if (event === "back") {
        nextIndex =
          activeIndex > 0 ? activeIndex - 1 : sortedSequences.length - 1;
      }
      const nextId = sortedSequences[nextIndex].id;
      setActiveSequenceId(nextId);
      seekToSequence(nextId);
    } else if (event === "edit") {
      editSequence(activeSequenceId);
    }
  };

  const handleSortLabel = () => {
    if (!sortLabel) {
      setSortLabel("asc");
    } else if (sortLabel === "asc") {
      setSortLabel("desc");
    } else {
      setSortLabel();
    }
  };

  const handleSortTime = () => {
    if (sortTime === "desc") {
      setSortTime("asc");
    } else {
      setSortTime("desc");
    }
  };

  const allSelected = useMemo(() => {
    return sequences.every((s) => selectedSequences.includes(s.id));
  }, [selectedSequences, sequences]);

  const handleSelectAll = () => {
    if (allSelected) {
      const allIds = sequences.map((s) => s.id);
      setSelectedSequences(
        selectedSequences.filter((s) => !allIds.includes(s))
      );
    } else {
      setSelectedSequences(
        Array.from(
          new Set([...selectedSequences, ...sequences.map((s) => s.id)])
        )
      );
    }
  };

  return (
    <ul className="sequencer_list-list">
      <li className="sequencer_list-list-sort stretched-grid gap-xs bg-grey-light">
        <span
          className="centered-grid bg-white pd-05 gap-m"
          onClick={handleSortTime}
        >
          <i className="material-icons">
            {!sortTime
              ? "unfold_more"
              : sortTime === "desc"
              ? "expand_less"
              : "expand_more"}
          </i>
        </span>
        <span
          className="aligned-grid bg-white pd-05 gap-m"
          onClick={handleSortLabel}
        >
          <i className="material-icons">
            {!sortLabel
              ? "unfold_more"
              : sortLabel === "desc"
              ? "expand_less"
              : "expand_more"}
          </i>
        </span>
        <i
          onClick={handleSelectAll}
          className="material-icons aligned-grid bg-white pd-05"
        >
          {allSelected ? "check_box" : "check_box_outline_blank"}
        </i>
      </li>
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
            data-loading={!s.id}
            onClick={handleClick}
            id={s.id || i}
            key={i}
            className="stretched-grid gap-xs bg-grey-light"
          >
            <div className="stretched-grid bg-white">
              <span className="centered-grid">{secondsToTime(s.start)}</span>
            </div>
            <label className="aligned-grid bg-white pd-05 gap-m grid-tc-1m">
              {s.label}
              <i onClick={handleEdit} className="material-icons">
                edit
              </i>
            </label>
            <i
              onClick={handleSelect}
              className="material-icons aligned-grid bg-white pd-05"
            >
              {!s.id
                ? "close"
                : selected
                ? "check_box"
                : "check_box_outline_blank"}
            </i>
          </li>
        );
      })}
    </ul>
  );
};
