import React, { useCallback } from "react";
import { MODAL } from "../Modal";
import { DIRECTORY_TYPES } from "../../stores/folder";
import { patchPlaylist, PLAYLISTS } from "../../stores/playlists";
import { sgs, ggs } from "../../utils/rxGlobal";

export const ListSelection = ({
  activePlaylist,
  playlist,
  items,
  setItems,
  selectedItems
}) => {
  const handleSave = () => {
    const addedItems = items
      .filter((i) => selectedItems.includes(i.id))
      .map((i) => `${i.type}:${i.id}`);

    sgs(MODAL, {
      component: DIRECTORY_TYPES.PLAYLIST,
      props: {
        items: addedItems
      }
    });
  };

  const handleAdd = useCallback(() => {
    sgs(MODAL, {
      component: "SELECT_PLAYLIST",
      onClose: (id) => {
        const playlist = ggs(PLAYLISTS).find((p) => p.id === id);
        const addedItems = items
          .filter((i) => selectedItems.includes(i.id))
          .map((i) => `${i.type}:${i.id}`);
        patchPlaylist({
          id,
          ...playlist,
          items: [...playlist.items, ...addedItems]
        });
      }
    });
  }, [selectedItems, items]);

  const handleDelete = () => {
    const updatedItems = items
      .filter((i) => !selectedItems.includes(i.id))
      .map((i) => `${i.type}:${i.id}`);

    patchPlaylist({ ...playlist, items: updatedItems });
  };

  const handleRemove = () =>
    setItems(items.filter((i) => !selectedItems.includes(i.id)));

  return (
    <div className="playlist_controls-selection overflow-h stretched-grid bg-grey">
      <button>
        {activePlaylist ? (
          <i onClick={handleDelete} className="material-icons">
            delete
          </i>
        ) : (
          <i onClick={handleRemove} className="material-icons">
            clear
          </i>
        )}
      </button>
      <button onClick={handleSave}>
        <i className="material-icons">playlist_add_check</i>
      </button>
      <button onClick={handleAdd}>
        <i className="material-icons">playlist_add</i>
      </button>
    </div>
  );
};
