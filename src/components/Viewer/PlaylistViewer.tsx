import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback
} from "react";
import ReactPlayer from "react-player";
import { DIRECTORY_TYPES } from "../../stores/folder";
import { sgs, subgs, unsgs, usegs, ggs, ugs } from "../../utils/rxGlobal";
import { MODAL } from "../Modal";

export const PV_ITEMS = "PV_ITEMS";
export const PV_PLAYING = "PLAYING";
export const ACTIVE_ITEM_ID = "ACTIVE_ITEM_ID";
export const ACTIVE_URL = "ACTIVE_URL";
export const PV_PLAYERS = "PLAYERS";

sgs(PV_PLAYING, false);
sgs(ACTIVE_ITEM_ID, null);
sgs(ACTIVE_URL, "");
sgs(PV_PLAYERS, {});

const handleShare = (type, id, label, videoUrl?) =>
  sgs(MODAL, {
    component: "share",
    props: { type, id, label, videoUrl }
  });

let nextStop: any = null;

let previousItemId;

subgs(ACTIVE_ITEM_ID, (id) => {
  if (id === null) {
    sgs(ACTIVE_URL, "");
    return;
  }
  const items = ggs(PV_ITEMS);
  const previousItem = items.find((i) => i.id === previousItemId);
  const item = items.find((i) => i.id === id);
  if (
    item &&
    ((previousItem && previousItem.url !== item.url) || !previousItem)
  ) {
    sgs(ACTIVE_URL, item.url);
  }
  const skipSeek = !!previousItem && previousItem.stop === item.start;
  nextStop = item.type === DIRECTORY_TYPES.SEQUENCE ? item.stop : null;
  if (!skipSeek) {
    const player = ggs(PV_PLAYERS)[item.url].player;
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

const handleRef = (player, url) => {
  if (player === null) {
    return;
  }
  ugs(PV_PLAYERS, (players) => {
    // console.log("URL", url);

    // console.log("PLAYER", player);
    // console.log("PLAYERS", players);

    return {
      ...players,
      [url]: {
        player,
        ready: false
      }
    };
  });
};

const handleReady = (url) =>
  ugs(PV_PLAYERS, (players) => {
    return {
      ...players,
      [url]: {
        ...players[url],
        ready: true
      }
    };
  });

const handlePlay = () => sgs(PV_PLAYING, true);
const handlePause = () => sgs(PV_PLAYING, false);

const handleProgress = (progress) => {
  if (!!nextStop && progress.playedSeconds >= nextStop) {
    playNext();
  } else if (!nextStop && progress.played === 1) {
    playNext();
  }
};

const playNext = () => {
  const items = ggs(PV_ITEMS);

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

const handleSelect = (e) => sgs(ACTIVE_ITEM_ID, e.target.closest("li").id);

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

  return (
    <div className="playlist_viewer grid bg-black" data-align={query.alignList}>
      <div className="players">
        {urls.map((u, i) => (
          <Video key={i} url={u} />
        ))}
      </div>
      <div className="playlist_viewer-list grid grid-tr-mm1" data-open={open}>
        <h2>
          <i className="material-icons">playlist_play</i>
          {playlist.label}
        </h2>
        <input
          className="bg-grey-dark"
          type="text"
          placeholder="Search Playlist..."
          value={search}
          onChange={handleSearch}
        />
        <ul className="grid gap-xs">
          {searchedItems.map((item, i) => (
            <Item {...item} key={i} />
          ))}
        </ul>
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
    <div className="panel bg-grey">
      <i className="material-icons pd-05" onClick={() => setOpen(!open)}>
        {open ? "chevron_right" : "chevron_left"}
      </i>
      <i className="material-icons pd-05" onClick={() => setPlaying(!playing)}>
        {playing ? "pause" : "play_arrow"}
      </i>
      <i className="material-icons pd-05" onClick={playPrev}>
        expand_less
      </i>
      <span className="pd-05">{index}</span>
      <i className="material-icons pd-05" onClick={playNext}>
        expand_more
      </i>
    </div>
  );
};

const Video = ({ url }) => {
  const [playing, setPlaying] = useState(false);
  const ref: any = useRef(null);

  const handleActive = useCallback((activeUrl) => {
    const isActive = activeUrl === url;
    ref.current.dataset.active = isActive;

    if (isActive) {
      setPlaying(ggs(PV_PLAYING));
    } else {
      setPlaying(false);
    }
  }, []);

  const handlePlaying = useCallback((isPlaying) => {
    const isActive = ref.current.dataset.active == "true";
    if (isActive) {
      setPlaying(isPlaying);
    } else {
      setPlaying(false);
    }
  }, []);

  useEffect(() => {
    subgs(ACTIVE_URL, handleActive);
    subgs(PV_PLAYING, handlePlaying);
    return () => {
      unsgs(ACTIVE_URL, handleActive);
      unsgs(PV_PLAYING, handlePlaying);
    };
  }, []);

  return (
    <div ref={ref} className="player" data-active="false">
      <ReactPlayer
        className={"player_viewer"}
        height="100%"
        width="100%"
        playing={playing}
        ref={(r) => handleRef(r, url)}
        url={url}
        onPlay={handlePlay}
        onPause={handlePause}
        onReady={() => handleReady(url)}
        onProgress={handleProgress}
        controls={true}
        progressInterval={100}
      />
    </div>
  );
};

const Item = ({ id, label, type, url }) => {
  const [active, setActive] = useState(false);

  const handleActive = useCallback(
    (activeItemId) => setActive(activeItemId === id),
    [id]
  );

  useEffect(() => {
    subgs(ACTIVE_ITEM_ID, handleActive);
    return () => unsgs(ACTIVE_ITEM_ID, handleActive);
  }, []);

  return (
    <li
      className="bg-grey-dark row-1m pd-051051"
      data-active={active}
      onClick={handleSelect}
      id={id}
    >
      {label}
      <i
        onClick={() => handleShare(DIRECTORY_TYPES[type], id, label, url)}
        className="material-icons cl-text-icon"
      >
        share
      </i>
    </li>
  );
};
