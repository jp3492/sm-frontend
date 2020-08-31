import React, { useMemo, useEffect, useState, useCallback } from "react";
import { DIRECTORY_TYPES } from "../../stores/folder";
import { Link } from "react-router-dom";
import { SEQUENCES } from "../../stores/sequences";
import { ggs, subgs, unsgs } from "../../utils/rxGlobal";
import { PLAYLISTS, patchPlaylist, STATUS_TYPES } from "../../stores/playlists";
import { MOVING_ITEMS } from "./MenuItem";

const getSequenceCount = (videoId) => {
  return ggs(SEQUENCES).filter((s) => s.videoId === videoId).length;
};

// should be reduced to only 3 items components that will be used in directory
export const DirectoryItem = ({
  id,
  type,
  label,
  keywords,
  items,
  selected,
  handleDrop,
  onDragOver,
  onDragStart,
  handleSelect,
  handleEdit,
  onShare,
  ...item
}) => {
  const [moving, setMoving] = useState(false);

  const handleShare = () => onShare(DIRECTORY_TYPES[type], id, label, item.url);

  const handleMoving = useCallback(
    (ids) => {
      if (ids.includes(id) && !moving) {
        setMoving(true);
      } else {
        setMoving(false);
      }
    },
    [moving, id]
  );

  useEffect(() => {
    subgs(MOVING_ITEMS, handleMoving);
    return () => unsgs(MOVING_ITEMS, handleMoving);
  }, [id]);

  if (type === DIRECTORY_TYPES.PLAYLIST) {
    return (
      <PlaylistItem
        id={id}
        label={label}
        handleDrop={handleDrop}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        handleSelect={handleSelect}
        selected={selected}
        items={items}
        handleEdit={handleEdit}
        handleShare={handleShare}
        status={item.status}
        isMoving={moving}
      />
    );
  } else if (type === DIRECTORY_TYPES.VIDEO) {
    return (
      <VideoItem
        id={id}
        label={label}
        handleDrop={handleDrop}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        handleSelect={handleSelect}
        selected={selected}
        keywords={keywords}
        handleEdit={handleEdit}
        handleShare={handleShare}
        isMoving={moving}
      />
    );
  } else {
    return (
      <SequenceItem
        id={id}
        label={label}
        handleDrop={handleDrop}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        handleSelect={handleSelect}
        selected={selected}
        handleShare={handleShare}
        start={item.start}
        stop={item.stop}
        videoId={item.videoId}
        isMoving={moving}
      />
    );
  }
};

const SequenceItem = ({
  id,
  label,
  handleDrop,
  onDragStart,
  onDragOver,
  handleSelect,
  selected,
  handleShare,
  videoId,
  start,
  stop,
  isMoving
}) => {
  return (
    <li
      id={id}
      onDrop={handleDrop}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      draggable={true}
      onClick={handleSelect}
      data-moving={isMoving}
      data-selected={selected ? "selected" : ""}
      className={`SEQUENCE directory_item grid pd-051 gap-l`}
    >
      <div className="directory_item-header aligned-grid grid-tc-1mm cgap-m">
        <h4>{label}</h4>
        <span className="flex-center gap-s">
          <i className="material-icons">access_time</i>
          <small>{start}</small>
          <small>-</small>
          <small>{stop}</small>
        </span>
      </div>
      <div className="directory_item-videos aligned-grid gap-m"></div>
      <div className="directory_item-footer aligned-grid gap-l">
        <i onClick={handleShare} className="material-icons">
          share
        </i>
        <Link to={`/sequencer/${videoId}?sequenceId=${id}`}>
          <i className="material-icons">open_in_new</i>
        </Link>
        <i className="material-icons">
          {selected ? "check_box" : "check_box_outline_blank"}
        </i>
      </div>
    </li>
  );
};

const VideoItem = ({
  id,
  label,
  handleDrop,
  onDragStart,
  onDragOver,
  handleSelect,
  selected,
  keywords,
  handleShare,
  handleEdit,
  isMoving
}) => {
  const count = useMemo(() => getSequenceCount(id), [id]);
  return (
    <li
      id={id}
      onDrop={handleDrop}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      draggable={true}
      onClick={handleSelect}
      data-moving={isMoving}
      data-selected={selected ? "selected" : ""}
      className={`VIDEO directory_item grid pd-051 gap-l`}
    >
      <div className="directory_item-header aligned-grid grid-tc-1mm cgap-m">
        <h4>{label}</h4>
        <ul className="directory_item-keywords aligned-grid gap-s">
          <li>
            <small>#</small>
          </li>
          {keywords.length === 0 ? (
            <li>
              <small>No keywords</small>
            </li>
          ) : (
            keywords.map((k, i) => <li key={i}>{k}</li>)
          )}
        </ul>
      </div>
      <div className="directory_item-videos aligned-grid gap-s">
        <span>{count}</span>
        <i className="material-icons">open_in_full</i>
      </div>
      <div className="directory_item-footer aligned-grid gap-l">
        <i onClick={handleShare} className="material-icons">
          share
        </i>
        <Link to={`/sequencer/${id}`}>
          <i className="material-icons">open_in_new</i>
        </Link>
        <i onClick={handleEdit} className="material-icons">
          more_vert
        </i>
        <i className="material-icons">
          {selected ? "check_box" : "check_box_outline_blank"}
        </i>
      </div>
    </li>
  );
};

const PlaylistItem = ({
  id,
  label,
  handleDrop,
  onDragStart,
  onDragOver,
  handleSelect,
  selected,
  items,
  handleShare,
  handleEdit,
  status,
  isMoving
}) => {
  const handleStatusChange = ({ target: { value } }) => {
    const playlist = ggs(PLAYLISTS).find((p) => p.id === id);
    patchPlaylist({ ...playlist, status: value });
  };
  return (
    <li
      id={id}
      onDrop={handleDrop}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      draggable={true}
      onClick={handleSelect}
      data-moving={isMoving}
      data-selected={selected ? "selected" : ""}
      className={`PLAYLIST directory_item grid pd-051 gap-l`}
    >
      <div className="directory_item-header aligned-grid grid-tc-1mm cgap-m">
        <h4>{label}</h4>
      </div>
      <div className="directory_item-videos aligned-grid gap-s">
        <span>{items.length}</span>
        <i className="material-icons">playlist_play</i>
      </div>
      <select onChange={handleStatusChange}>
        <option
          value="PRIVATE"
          selected={!status || status === STATUS_TYPES.PUBLIC}
        >
          Private (default)
        </option>
        <option selected={status === STATUS_TYPES.PUBLIC} value="PUBLIC">
          Public
        </option>
        <option selected={status === STATUS_TYPES.FEATURED} value="FEATURED">
          Featured
        </option>
      </select>
      <div className="directory_item-footer aligned-grid gap-l">
        <i onClick={handleShare} className="material-icons">
          share
        </i>
        <i onClick={handleEdit} className="material-icons">
          more_vert
        </i>
        <i className="material-icons">
          {selected ? "check_box" : "check_box_outline_blank"}
        </i>
      </div>
    </li>
  );
};
