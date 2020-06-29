import React from "react";
import { useGlobalState } from "react-global-state-hook";
import { PLAYER_PLAYING, PLAYER_ITEM } from "./Player";

export const ListActions = ({ items }) => {
  const [playing, setPlaying] = useGlobalState(PLAYER_PLAYING);
  const [item, setItem] = useGlobalState(PLAYER_ITEM);

  const handlePlay = () => {
    if (!item) {
      setItem(items[0]);
    } else {
      setPlaying(!playing);
    }
  };

  const move = (up) => {
    if (item && items.length !== 1) {
      const currentIndex = items.findIndex((i) => i.id === item.id);
      let nextItem;
      if (up && currentIndex !== 0) {
        nextItem = items.find((_, i) => i === currentIndex - 1);
      } else if (currentIndex !== items.length - 1) {
        nextItem = items.find((_, i) => i === currentIndex + 1);
      }
      setItem(nextItem);
    } else {
      console.log("ONLY ONE ITEM PRESENT OR PLAYER IS NOT ACTIVE");
    }
  };

  const handleUp = () => move(true);

  const handleDown = () => move(false);

  return (
    <div className="playlist_controls-actions stretched-grid bg-grey">
      <button onClick={handlePlay}>
        {/* show loading when player isnt ready yet, otherwise first play press might fail */}
        <i className="material-icons">{playing ? "pause" : "play_arrow"}</i>
      </button>
      <button onClick={handleUp}>
        <i className="material-icons">keyboard_arrow_up</i>
      </button>
      <button onClick={handleDown}>
        <i className="material-icons">keyboard_arrow_down</i>
      </button>
      <button>
        <i className="material-icons">share</i>
      </button>
    </div>
  );
};
