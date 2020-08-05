import { sgs, ugs } from './../utils/rxGlobal';
export const PLAYLIST_ITEMS = "PLAYLIST_ITEMS";

sgs(PLAYLIST_ITEMS, []);

export const addItem = (item) =>
  ugs(PLAYLIST_ITEMS ,items => ([ ...items, item ]));

export const removeItems = (itemIds) =>
  ugs(PLAYLIST_ITEMS, items =>
    items.filter(({ id }) => !itemIds.includes(id)));
