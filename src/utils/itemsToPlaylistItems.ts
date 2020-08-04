export const itemsToPlaylistItems = (items) => {
  return items.map((i) => `${i.type}:${i.id}`);
};
