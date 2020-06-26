import React from "react";
import { DIRECTORY_TYPES } from "../../stores/folder";
import { Link } from "react-router-dom";

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
  const handleKeywordClick = (e) => {};

  const handleVideosClick = (e) => {};

  const handleShare = () => onShare(DIRECTORY_TYPES[type], id);

  return (
    <li
      id={id}
      onDrop={handleDrop}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      draggable={true}
      onClick={handleSelect}
      data-selected={selected ? "selected" : ""}
      className={`${DIRECTORY_TYPES[type]} directory_item`}
    >
      <div className="directory_item-header">
        <i className="material-icons">
          {selected ? "check_box" : "check_box_outline_blank"}
        </i>
        <h4>{label}</h4>
      </div>
      <ul className="directory_item-keywords">
        {type !== DIRECTORY_TYPES.SEQUENCE && (
          <>
            <li>#</li>
            {keywords.length === 0 ? (
              <li>
                <small>No keywords</small>
              </li>
            ) : (
              keywords.map((k, i) => (
                <li onClick={handleKeywordClick} key={i}>
                  {k}
                </li>
              ))
            )}
          </>
        )}
      </ul>
      <div className="directory_item-videos" onClick={handleVideosClick}>
        {type === DIRECTORY_TYPES.PLAYLIST && (
          <>
            <i className="material-icons">ondemand_video</i>
            <span>{`${items.length} ${
              items.length === 1 ? "Video" : "Videos"
            }`}</span>
          </>
        )}
      </div>
      <div className="directory_item-footer">
        <i onClick={handleShare} className="material-icons">
          share
        </i>
        {type === DIRECTORY_TYPES.VIDEO ? (
          <Link to={`/sequencer/${id}`}>
            <i className="material-icons">open_in_new</i>
          </Link>
        ) : (
          type === DIRECTORY_TYPES.SEQUENCE && (
            <Link to={`/sequencer/${item.videoId}?sequenceId=${id}`}>
              <i className="material-icons">open_in_new</i>
            </Link>
          )
        )}
        <i onClick={handleEdit} className="material-icons">
          more_vert
        </i>
      </div>
    </li>
  );
};
