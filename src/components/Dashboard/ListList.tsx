import React, { useEffect, useRef } from "react";
import {
  openPlayer,
  PLAYER_PLAYING,
  PLAYER_ITEM
} from "./Player";
import { DIRECTORY_TYPES } from "../../stores/folder";
import { PLAYLIST_ITEMS } from "../../stores/playlist_items";
import { ggs, sgs, usegs } from "../../utils/rxGlobal";

const handlePlayerDone = ({ detail: { id } }: any) => {
  const items = ggs(PLAYLIST_ITEMS);
  const itemIndex = items.findIndex((i) => i.id === id);
  // when item is the last in List, do nothing
  // if not get the next id and openPlayer(id);

  if (itemIndex < items.length - 1) {
    const nextItem = items.find((i, index) => index === itemIndex + 1);
    openPlayer(nextItem.id);
  } else {
    sgs(PLAYER_PLAYING, false);
  }
};

export const ListList = ({
  items,
  filteredItems,
  selectedItems,
  setSelectedItems,
  arrangeItems
}) => {
  const [playerItem] = usegs(PLAYER_ITEM);

  const arrangeTarget: any = useRef();
  const draggedTarget: any = useRef();

  const handleSelect = (e) => {
    e.stopPropagation();
    const id = e.target.closest("li").id;
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleDragStart = (e) => {
    const el = e.target.closest("li");
    const id = el.id;
    draggedTarget.current = el;
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ items: [...selectedItems, id], type: "list" })
    );
  };

  const handleDragEnd = (e) => {
    if (arrangeTarget.current) {
      arrangeTarget.current.classList.remove("drop-after");
      arrangeTarget.current.classList.remove("drop-before");
    }
  };

  const handleDragEnter = (e) => {
    const el = e.target.closest("li");
    arrangeTarget.current = el;
  };

  const handleDragLeave = (e) => {
    const el = e.target;
    el.classList.remove("drop-before");
    el.classList.remove("drop-after");
  };

  const handleDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (
      arrangeTarget.current &&
      draggedTarget.current !== arrangeTarget.current
    ) {
      const { height, y } = arrangeTarget.current.getBoundingClientRect();
      const mouseY = e.clientY;
      const before = mouseY < y + height / 2;

      const dragIndex = draggedTarget.current.dataset.index;
      const dropIndex = arrangeTarget.current.dataset.index;

      const down = dragIndex < dropIndex;

      const notSame = Math.abs(dragIndex - dropIndex) !== 1;

      if (before) {
        if (notSame || !down) {
          arrangeTarget.current.classList.remove("drop-after");
          arrangeTarget.current.classList.add("drop-before");
        }
      } else if (notSame || down) {
        arrangeTarget.current.classList.add("drop-after");
        arrangeTarget.current.classList.remove("drop-before");
      }
    }
  };

  const handleDrop = () => {
    const dragIndex = draggedTarget.current.dataset.index;
    const dropIndex = arrangeTarget.current.dataset.index;

    if (dragIndex === dropIndex) return;

    let arrangedItems: any = [...items];

    const before = arrangeTarget.current.classList.contains("drop-before");
    const down = dragIndex < dropIndex;

    const from = dragIndex;
    const to = before && down ? dropIndex - 1 : dropIndex;

    arrangedItems.move(from, to);

    arrangeItems(arrangedItems);
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
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`${
                DIRECTORY_TYPES[type]
              } grid grid-tc-m1m  pd-05 gap-m ${
                playerItem && id === playerItem.id ? "active" : ""
              }`}
              id={id}
              data-index={i}
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
