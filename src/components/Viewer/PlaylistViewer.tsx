import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback
} from "react";
import ReactPlayer from "react-player";
import { DIRECTORY_TYPES } from "../../stores/folder";
import { sgs, subgs, unsgs, usegs, ggs, ugs, cgs } from "../../utils/rxGlobal";
import { MODAL } from "../Modal";
import { incrementView } from "../../views/Viewer";
import { postComment, getComments } from "../../stores/comment";
import { AUTH } from "../../services/auth";
import { Link } from "react-router-dom";

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

const handleSelect = (e) => sgs(ACTIVE_ITEM_ID, e.target.closest("li").id);

export const PlaylistViewer = ({ videos, sequences, playlist, query }: any) => {
  const [items, setItems] = usegs(PV_ITEMS, []);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(true);
  const [auth] = usegs(AUTH);

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

  const handleSubmitComment = async (targetType, targetId, content) =>
    await postComment({
      type: "playlist",
      typeId: playlist.id,
      targetType,
      targetId,
      content
    });

  return (
    <div className="playlist_viewer grid bg-black" data-align={query.alignList}>
      <div className="players">
        {urls.map((u, i) => (
          <Video key={i} url={u} />
        ))}
      </div>
      <div className="playlist_viewer-list grid grid-tr-mm1" data-open={open}>
        <h2 className="grid grid-tc-1m align-i-c">
          {playlist.label}
          <i
            onClick={() =>
              handleShare({
                type: DIRECTORY_TYPES.PLAYLIST,
                id: playlist.id,
                label: playlist.label
              })
            }
            className="material-icons"
          >
            share
          </i>
        </h2>
        <input
          className="bg-grey-dark"
          type="text"
          placeholder="Search Playlist..."
          value={search}
          onChange={handleSearch}
        />
        <ul id="playlist-viewer-list" className="grid gap-xs">
          {searchedItems.map((item, i) => (
            <Item
              {...item}
              handleShareItem={handleShareItem}
              handleSubmitComment={handleSubmitComment}
              playlistId={playlist.id}
              auth={auth}
              key={i}
            />
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

const Item = ({
  id,
  label,
  type,
  url,
  views,
  playlistId,
  handleShareItem,
  handleSubmitComment,
  auth,
  stateId = `COMMENTS_${id}`
}) => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [repeating, setRepeating] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments] = usegs(stateId, []);

  // Do i need to remove the state for comments?
  // it might add too much if someone is watching a bunch of playlists
  useEffect(() => {
    return () => {
      cgs(stateId);
    };
  }, []);

  useEffect(() => {
    if (commentsOpen) {
      getComments({
        type: "playlist",
        typeId: playlistId,
        targetType: type,
        targetId: id
      });
    }
  }, [commentsOpen]);

  useEffect(() => {
    setOpen(commentsOpen ? true : active);

    return () => {
      setRepeating(false);
      sgs(PV_REPEATING_ITEM_ID, null);
    };
  }, [active]);

  useEffect(() => {
    if (open && active) {
      if (active) {
        const ul: any = document.getElementById("playlist-viewer-list");
        const li: any = document.getElementById(id);

        ul.scrollTo({
          top: li.offsetTop,
          behavior: "smooth"
        });
      }
    }
  }, [open, active]);

  const handleActive = useCallback(
    (activeItemId) => setActive(activeItemId === id),
    [id]
  );

  useEffect(() => {
    subgs(ACTIVE_ITEM_ID, handleActive);
    return () => unsgs(ACTIVE_ITEM_ID, handleActive);
  }, []);

  const handleRepeat = (e) => {
    e.stopPropagation();
    ugs(PV_REPEATING_ITEM_ID, (setId) => {
      if (setId === id) {
        setRepeating(false);
        return null;
      }
      setRepeating(true);
      return id;
    });
  };

  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const handleComments = () => setCommentsOpen(!commentsOpen);

  const handleSubmit = async () => {
    handleSubmitComment(type.toLowerCase(), id, comment);
    setComment("");
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(active);
    setCommentsOpen(false);
  };

  return (
    <li
      className="bg-grey-dark grid-tr-1m"
      data-comments-open={commentsOpen}
      data-active={active || commentsOpen}
      id={id}
    >
      <div onClick={handleSelect} className="grid row-1m pd-0505051">
        <label>{label}</label>
        {commentsOpen ? (
          <i onClick={handleClose} className="material-icons cl-text-icon">
            clear
          </i>
        ) : (
          <i onClick={handleOpen} className="material-icons cl-text-icon">
            {open ? "keyboard_arrow_up" : "more_vert"}
          </i>
        )}
      </div>

      {open && (
        <div className="grid align-i-c grid-af-c grid-tc-mm1m pd-051 gap-s">
          <small>{`${views || 0} views`}</small>
          <i
            data-icon-active={repeating}
            onClick={handleRepeat}
            className="material-icons cl-text-icon"
          >
            repeat_one
          </i>
          <i
            onClick={() =>
              handleShareItem(DIRECTORY_TYPES[type], id, label, url)
            }
            className="material-icons cl-text-icon"
          >
            share
          </i>
          {!commentsOpen && (
            <i
              data-icon-active={commentsOpen}
              onClick={handleComments}
              className="material-icons cl-text-icon"
            >
              comment
            </i>
          )}
        </div>
      )}
      {commentsOpen && (
        <div className="comment-section">
          {auth ? (
            <div className="pd-05 grid gap-s grid-tc-1m">
              <textarea
                placeholder="Write a comment.."
                value={comment}
                onChange={({ target: { value } }) => setComment(value)}
              ></textarea>
              <button onClick={handleSubmit} className="align-e">
                <i className="material-icons cl-text-icon">send</i>
              </button>
            </div>
          ) : (
            <div className="text-align-c">
              <Link to="/auth" className="cl-text-pri">
                <b>Login to comment.</b>
              </Link>
            </div>
          )}
          <ul className="pd-05 grid gap-s">
            {comments.length === 0 ? (
              <li className="pd-05 text-align-c">Be the first to comment!</li>
            ) : (
              comments.map((c, i) => (
                <li
                  key={i}
                  id={c.id}
                  className="comment rounded pd-05 bg-acc-l cl-content-sec grid gap-s"
                >
                  <small>{c.userName}</small>
                  <p>{c.content}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </li>
  );
};
