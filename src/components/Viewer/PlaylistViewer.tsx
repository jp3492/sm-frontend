import React, { useState, useRef, useEffect, useMemo } from "react";
import ReactPlayer from "react-player";
import { DIRECTORY_TYPES } from "../../stores/folder";

// Like List in Dashboard

export const PlaylistViewer = (props: any) => {
  const [search, setSearch] = useState("");

  const [activeItemId, setActiveItemId] = useState();
  const [counter, setCounter] = useState(0);

  const [playing, setPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  const [url, setUrl] = useState();

  const player: any = useRef();
  const ref = (p) => (player.current = p);

  const { videos, sequences, playlist } = props;

  const handleReady = () => {
    setPlayerReady(true);
  };

  const items = useMemo(
    () =>
      playlist.items
        .map((i) => ({
          type: i.split(":")[0],
          id: i.split(":")[1]
        }))
        .map(({ id, type }) => {
          if (type === DIRECTORY_TYPES.VIDEO) {
            return { ...videos.find((v) => v.id === id), type };
          } else if (type === DIRECTORY_TYPES.SEQUENCE) {
            return { ...sequences.find((s) => s.id === id), type };
          }
        }),
    [playlist]
  );

  const currentItem = useMemo(() => items.find((i) => i.id === activeItemId), [
    items,
    activeItemId
  ]);

  useEffect(() => {
    if (items.length > 0) {
      setActiveItemId(items[0].id);
      setUrl(items[0].url);
    }
  }, [items]);

  useEffect(() => {
    if (currentItem) {
      if (currentItem.url !== url) {
        setPlayerReady(false);
        setUrl(currentItem.url);
      } else if (playerReady) {
        const to =
          currentItem.type === DIRECTORY_TYPES.SEQUENCE ? currentItem.start : 0;
        player.current.seekTo(to, "seconds");
        setPlaying(true);
      }
    }
  }, [playerReady, currentItem]);

  const playNext = () => {
    const currentIndex = items.findIndex((i) => i.id === currentItem.id);
    if (currentIndex === items.length - 1) {
      setPlaying(false);
    } else {
      const newItem = items.find((it, i) => i === currentIndex + 1);
      setActiveItemId(newItem.id);
    }
  };

  const handleEnd = () => playNext();

  const handleProgress = ({ playedSeconds }) => {
    currentItem.stop && playedSeconds >= currentItem.stop && playNext();
  };

  const handleSelect = (e) => {
    setCounter(counter + 1);
    setActiveItemId(e.target.id);
  };

  return (
    <div className="playlist_viewer grid grid-tc-1m bg-black">
      <div>
        <ReactPlayer
          className={"player_viewer"}
          height="100%"
          width="100%"
          playing={playing}
          ref={ref}
          url={url}
          onProgress={handleProgress}
          onReady={handleReady}
          onEnded={handleEnd}
          controls={true}
        />
      </div>
      <div className="playlist_viewer-list grid grid-tr-m1 gap-s">
        <input
          className="bg-grey"
          type="text"
          placeholder="Search Playlist..."
          value={search}
          onChange={({ target: { value } }) => setSearch(value)}
        />
        <ul className="grid gap-xs">
          {items.map(({ id, label, type }, i) => (
            <li
              className="bg-grey-dark pd-051051"
              data-active={activeItemId === id}
              onClick={handleSelect}
              id={id}
              key={i}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
