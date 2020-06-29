import React, { useEffect } from "react";
import { useGlobalState, getGlobalState } from "react-global-state-hook";
import { PLAYER_POSITION, openPlayer } from "./Player";
import { DIRECTORY_TYPES } from "../../stores/folder";
import { PLAYLIST_ITEMS } from "../../stores/playlist_items";

const onDragOver = (e) => {
  e.stopPropagation();
  e.preventDefault();
};

const handlePlayerDone = ({ detail: { id } }: any) => {
  const items = getGlobalState(PLAYLIST_ITEMS);
  const itemIndex = items.findIndex((i) => i.id === id);
  // when item is the last in List, do nothing
  // if not get the next id and openPlayer(id);

  if (itemIndex < items.length - 1) {
    const nextItem = items.find((i, index) => index === itemIndex + 1);
    openPlayer(nextItem.id);
  }
};

export const ListList = ({
  items,
  filteredItems,
  selectedItems,
  handleSelect
}) => {
  const [position] = useGlobalState(PLAYER_POSITION);

  const onDragStart = (e) => {
    const id = e.target.closest("li").id;
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ items: [...selectedItems, id], type: "list" })
    );
  };

  useEffect(() => {
    document.addEventListener("playerdone", handlePlayerDone);
    return () => document.removeEventListener("playerdone", handlePlayerDone);
  }, []);

  return (
    <ul className="bg-white overflow-a">
      {items.length === 0 ? (
        <li className="no-items centered-grid pd-2">
          Nothing in selection. Drag video or playlist into here or open an
          existing playlist.
        </li>
      ) : (
        filteredItems.map(({ id, label, url, type, start, stop }, i) => {
          const selected = selectedItems.includes(id);
          return (
            <li
              onClick={openPlayer}
              draggable={true}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              className={`${
                DIRECTORY_TYPES[type]
              } grid grid-tc-m1m  pd-05 gap-m ${
                i === position ? "active" : ""
              }`}
              id={id}
              key={i}
            >
              <i onClick={handleSelect} className="material-icons">
                {/* here i need logic to display request states for saving, patching and deleting */}
                {selected ? "check_box" : "check_box_outline_blank"}
              </i>
              <label>{label}</label>
              {/* <i className="material-icons">edit</i> */}
            </li>
          );
        })
      )}
    </ul>
  );
};
