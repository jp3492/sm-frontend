import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DIRECTORY_TYPES } from "../../stores/folder";
import { sgs, subgs, unsgs, usegs, ggs } from "../../utils/rxGlobal";
import { MODAL } from "../Modal";
import { incrementView } from "../../views/Viewer";
import { PlaylistViewerList } from "./PlaylistViewerList";
import { PlaylistViewerVideo } from "./PlaylistViewerVideo";

export const PV_ITEMS = "PV_ITEMS";
export const PV_PLAYING = "PLAYING";
export const ACTIVE_ITEM_ID = "ACTIVE_ITEM_ID";
export const ACTIVE_URL = "ACTIVE_URL";
export const PV_PLAYERS = "PLAYERS";
export const PV_REPEATING_ITEM_ID = "PV_REPEATING_ITEM_ID";

sgs(PV_PLAYING, false);
sgs(ACTIVE_ITEM_ID, null);
sgs(ACTIVE_URL, "");
sgs(PV_PLAYERS, {});
sgs(PV_REPEATING_ITEM_ID, null);

const handleShare = ({
  type,
  id,
  label,
  videoUrl,
  originId,
  originLabel
}: {
  type: string;
  id: string;
  label: string;
  videoUrl?: string;
  originId?: string;
  originLabel?: string;
}) =>
  sgs(MODAL, {
    component: "share",
    props: { type, id, label, videoUrl, originId, originLabel }
  });

export let nextStop: any = null;
let previousItemId;

subgs(ACTIVE_ITEM_ID, (id) => {
  if (id === null) {
    sgs(ACTIVE_URL, "");
    return;
  }

  const items = ggs(PV_ITEMS);
  const previousItem = items.find((i) => i.id === previousItemId);
  const item = items.find((i) => i.id === id);
  incrementView(item.type.toLowerCase(), item.id);
  if (
    item &&
    ((previousItem && previousItem.url !== item.url) || !previousItem)
  ) {
    sgs(ACTIVE_URL, item.url);
  }
  const player = ggs(PV_PLAYERS)[item.url].player;
  // this is triggered at least one time before the player is ready
  // should check and improve this in the future!
  const currentTime = (player.getCurrentTime() || 0).toFixed(2);

  const skipSeek =
    !!previousItem &&
    previousItem.stop === currentTime &&
    previousItem.stop === item.start;
  nextStop = item.type === DIRECTORY_TYPES.SEQUENCE ? item.stop : null;
  if (!skipSeek) {
    player.seekTo(
      item.type === DIRECTORY_TYPES.SEQUENCE ? item.start : 0,
      "seconds"
    );
  }
  previousItemId = id;
  if (!ggs(PV_PLAYING)) sgs(PV_PLAYING, true);
});

subgs(PV_PLAYERS, (players) => {
  if (Object.keys(players).length === 0) {
    return;
  }
  const allReady = Object.keys(players).every((url) => players[url].ready);
  if (allReady) {
    sgs(ACTIVE_ITEM_ID, ggs(PV_ITEMS)[0].id);
    sgs(PV_PLAYING, true);
  }
});

export const playNext = () => {
  const items = ggs(PV_ITEMS);
  const repeatingItemId = ggs(PV_REPEATING_ITEM_ID);

  if (!!repeatingItemId) {
    return sgs(ACTIVE_ITEM_ID, repeatingItemId);
  }

  const currentIndex = items.findIndex(
    (item) => item.id === ggs(ACTIVE_ITEM_ID)
  );
  if (currentIndex === items.length - 1) {
    return sgs(PV_PLAYING, false);
  }
  sgs(ACTIVE_ITEM_ID, items[currentIndex + 1].id);
};

const playPrev = () => {
  const items = ggs(PV_ITEMS);

  const currentIndex = items.findIndex(
    (item) => item.id === ggs(ACTIVE_ITEM_ID)
  );
  if (currentIndex === 0) {
    return sgs(PV_PLAYING, false);
  }
  sgs(ACTIVE_ITEM_ID, items[currentIndex - 1].id);
};

export const PlaylistViewer = ({ videos, sequences, playlist, query }: any) => {
  const [items, setItems] = usegs(PV_ITEMS, []);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const newItems = playlist.items
      .map((i) => ({
        type: i.split(":")[0],
        id: i.split(":")[1]
      }))
      .map(({ id, type }) =>
        type === DIRECTORY_TYPES.VIDEO
          ? { ...videos.find((v) => v.id === id), type }
          : { ...sequences.find((s) => s.id === id), type }
      );
    setItems(newItems);
  }, [videos, playlist, sequences]);

  const urls = useMemo(() => {
    return items.reduce(
      (prev, curr) => (prev.includes(curr.url) ? prev : [...prev, curr.url]),
      []
    );
  }, [items]);

  const searchedItems = useMemo(() => {
    if (!search) {
      return items;
    }
    return items.filter((i) =>
      i.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const handleSearch = useCallback(
    ({ target: { value } }) => setSearch(value),
    []
  );

  const handleShareItem = (type, id, label, videoUrl) => {
    handleShare({
      type,
      id,
      label,
      videoUrl,
      originId: playlist.id,
      originLabel: playlist.label
    });
  };

  return (
    <div className="playlist_viewer grid bg-black" data-align={query.alignList}>
      <div className="players">
        {urls.map((u, i) => (
          <PlaylistViewerVideo key={i} url={u} />
        ))}
      </div>
      <div className="viewer_list grid grid-tr-mm1" data-open={open}>
        <div className="viewer_list-header">
          <h3>{playlist.label}</h3>
          <i
            onClick={() =>
              handleShare({
                type: DIRECTORY_TYPES.PLAYLIST,
                id: playlist.id,
                label: playlist.label
              })
            }
            className="material-icons cl-text-icon"
          >
            share
          </i>
        </div>
        <input
          className="bg-grey-dark"
          type="text"
          placeholder="Search Playlist..."
          value={search}
          onChange={handleSearch}
        />
        <PlaylistViewerList
          handleShareItem={handleShareItem}
          searchedItems={searchedItems}
          playlistId={playlist.id}
        />
        <Panel open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

const Panel = ({ open, setOpen }) => {
  const [playing, setPlaying] = usegs(PV_PLAYING);
  const [index, setIndex] = useState();

  const handleActiveItem = (id) => {
    const items = ggs(PV_ITEMS);
    const currentIndex = items.findIndex((item) => item.id === id);
    setIndex(currentIndex + 1);
  };

  useEffect(() => {
    subgs(ACTIVE_ITEM_ID, handleActiveItem);
    return () => {
      unsgs(ACTIVE_ITEM_ID, handleActiveItem);
    };
  }, []);

  return (
    <div className="panel bg-grey" data-open={open}>
      <i className="material-icons" onClick={() => setOpen(!open)}>
        {open ? "chevron_right" : "chevron_left"}
      </i>
      <i className="material-icons" onClick={() => setPlaying(!playing)}>
        {playing ? "pause" : "play_arrow"}
      </i>
      {!open && (
        <>
          <i className="material-icons">repeat_one</i>
          <i className="material-icons">share</i>
        </>
      )}
      <i className="material-icons" onClick={playPrev}>
        expand_less
      </i>
      <span>{index}</span>
      <i className="material-icons" onClick={playNext}>
        expand_more
      </i>
    </div>
  );
};
