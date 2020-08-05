import React, { useMemo } from "react";
import { DIRECTORY_TYPES } from "../../stores/folder";
import { Link } from "react-router-dom";
import { SEQUENCES } from "../../stores/sequences";
import { ggs } from "../../utils/rxGlobal";

const getSequenceCount = (videoId) => {
  return ggs(SEQUENCES).filter((s) => s.videoId === videoId).length;
};

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

  const count = useMemo(
    () => (type === DIRECTORY_TYPES.VIDEO ? getSequenceCount(id) : 0),
    [type, id]
  );

  return (
    <li
      id={id}
      onDrop={handleDrop}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      draggable={true}
      onClick={handleSelect}
      data-selected={selected ? "selected" : ""}
      className={`${DIRECTORY_TYPES[type]} directory_item grid pd-051 gap-l`}
    >
      <div className="directory_item-header aligned-grid grid-tc-1m cgap-m">
        <h4>{label}</h4>
        <ul className="directory_item-keywords aligned-grid cgap-s">
          {type !== DIRECTORY_TYPES.SEQUENCE && (
            <>
              <li>
                <small>#</small>
              </li>
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
      </div>
      <div
        className="directory_item-videos aligned-grid gap-m"
        onClick={handleVideosClick}
      >
        {type === DIRECTORY_TYPES.PLAYLIST ? (
          <>
            <i className="material-icons">ondemand_video</i>
            <span>
              {`${items.length} ${items.length === 1 ? "Video" : "Videos"}`}
            </span>
          </>
        ) : (
          type === DIRECTORY_TYPES.VIDEO && (
            <>
              <i className="material-icons">open_in_full</i>
              <span>
                {`${count} ${count === 1 ? "Sequence" : "Sequences"}`}
              </span>
            </>
          )
        )}
      </div>
      <div className="directory_item-footer aligned-grid gap-l">
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
        {type !== DIRECTORY_TYPES.SEQUENCE && (
          <i onClick={handleEdit} className="material-icons">
            more_vert
          </i>
        )}
        <i className="material-icons">
          {selected ? "check_box" : "check_box_outline_blank"}
        </i>
      </div>
    </li>
  );
};
