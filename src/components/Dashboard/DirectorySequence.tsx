import React from "react";
import { DIRECTORY_TYPES } from "../../stores/folder";

export const DirectorySequence = ({
  id,
  label,
  keywords = [],
  selected,
  handleDrop,
  onDragOver,
  onDragStart,
  handleSelect,
  handleEdit
}) => {
  const handleKeywordClick = (e) => {};

  return (
    <li
      id={id}
      onDrop={handleDrop}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      draggable={true}
      onClick={handleSelect}
      className={`${DIRECTORY_TYPES.SEQUENCE} directory_project ${
        selected ? "selected" : ""
      }`}
    >
      <div className="directory_project-header">
        {/* <i className="material-icons">playlist_play</i> */}
        <h4>{label}</h4>
        <i onClick={handleEdit} className="material-icons">
          more_vert
        </i>
      </div>
      <ul className="directory_project-keywords">
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
      </ul>
      <div className="directory_project-footer">
        <i className="material-icons">
          {selected ? "check_box" : "check_box_outline_blank"}
        </i>
        <i className="material-icons">share</i>
        <i className="material-icons">ondemand_video</i>
        <i className="material-icons">play_arrow</i>
      </div>
    </li>
  );
};
