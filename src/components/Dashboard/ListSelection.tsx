import React from "react";

const handleAdd = () => {};

export const ListSelection = ({
  activePlaylist,
  handleDelete,
  handleRemove,
  handleSave
}) => (
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
      <i className="material-icons">format_strikethrough</i>
    </button>
  </div>
);
