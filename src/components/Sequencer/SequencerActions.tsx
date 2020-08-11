import React, { useMemo, useCallback } from "react";
import { SELECTED_SEQUENCES, deleteSequences } from "../../stores/sequences";
import { MODAL } from "../Modal";
import { DIRECTORY_TYPES } from "../../stores/folder";
import { handleShare } from "../Dashboard/Directory";
import { TAGGER_FAST_TAG } from "./Tagger";
import { usegs, sgs, ggs } from "../../utils/rxGlobal";
import { PLAYLISTS, patchPlaylist } from "../../stores/playlists";

export const SequencerActions = () => {
  const [selectedSequences, setSelectedSequences] = usegs(SELECTED_SEQUENCES);
  const [quickTag, setQuickTag] = usegs(TAGGER_FAST_TAG);

  const disabled = useMemo(() => selectedSequences.length === 0, [
    selectedSequences
  ]);

  const handleSave = useCallback(
    () =>
      sgs(MODAL, {
        component: DIRECTORY_TYPES.PLAYLIST,
        onClose: () => setSelectedSequences([]),
        props: {
          items: selectedSequences.map(
            (s) => `${DIRECTORY_TYPES.SEQUENCE}:${s}`
          )
        }
      }),
    [selectedSequences]
  );

  const handleAdd = useCallback(() => {
    sgs(MODAL, {
      component: "SELECT_PLAYLIST",
      onClose: (id) => {
        const playlist = ggs(PLAYLISTS).find((p) => p.id === id);
        const addedItems = selectedSequences.map((id) => `SEQUENCE:${id}`);
        patchPlaylist({
          id,
          ...playlist,
          items: [...playlist.items, ...addedItems]
        });
      }
    });
  }, [selectedSequences]);

  const handleRemove = useCallback(() => {
    // check with backend if its deletable
    deleteSequences(selectedSequences[0]);
    setSelectedSequences(selectedSequences.filter((s, i) => i !== 0));
  }, [selectedSequences]);

  const onShare = useCallback(
    () => handleShare(DIRECTORY_TYPES.SEQUENCE, selectedSequences[0]),
    [selectedSequences]
  );

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
        <i className="material-icons">playlist_add_check</i>
      </button>
      <button onClick={handleAdd} disabled={disabled}>
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
