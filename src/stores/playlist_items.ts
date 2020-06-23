import { getGlobalState, setGlobalState } from "react-global-state-hook";

export const PLAYLIST_ITEMS = "PLAYLIST_ITEMS";

setGlobalState(PLAYLIST_ITEMS, []);

export const addItem = (item) => {
  const items = getGlobalState(PLAYLIST_ITEMS);
  setGlobalState(PLAYLIST_ITEMS, [...items, item]);
};

export const removeItems = (itemIds) => {
  const items = getGlobalState(PLAYLIST_ITEMS);
  setGlobalState(
    PLAYLIST_ITEMS,
    items.filter(({ id }) => !itemIds.includes(id))
  );
};
