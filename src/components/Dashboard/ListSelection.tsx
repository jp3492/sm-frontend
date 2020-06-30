import React from "react";
import { setGlobalState } from "react-global-state-hook";
import { MODAL } from "../Modal";
import { DIRECTORY_TYPES } from "../../stores/folder";
import { patchPlaylist } from "../../stores/playlists";

const handleAdd = () => {};

export const ListSelection = ({
  activePlaylist,
  playlist,
  items,
  setItems,
  selectedItems
}) => {
  const handleSave = () => {
    const selection = items
      .filter((i) => selectedItems.includes(i.id))
      .map((i) => `${i.type}:${i.id}`);

    setGlobalState(MODAL, {
      component: DIRECTORY_TYPES.PLAYLIST,
      props: {
        items: selection
      }
    });
  };

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
