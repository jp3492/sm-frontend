import React, { useState, useEffect, useCallback, useRef } from "react";
import { sgs, subgs, unsgs, ugs, usegs } from "../../utils/rxGlobal";
import { PV_REPEATING_ITEM_ID, ACTIVE_ITEM_ID } from "./PlaylistViewer";
import { DIRECTORY_TYPES } from "../../stores/folder";
import { CommentSection } from "./CommentSection";

export const COMMENTS_OPEN = "COMMENT_OPEN";

sgs(COMMENTS_OPEN, false);

export const PlaylistViewerList = ({
  searchedItems,
  handleShareItem,
  playlistId
}) => {
  const list: any = useRef(null);

  const observeComments = (open) => {
    const width =
      window.innerWidth > 0 ? window.innerWidth : window.screen.width;
    const height =
      window.innerHeight > 0 ? window.innerHeight : window.screen.height;

    const isStacked = width < 768 && height > 400;

    if (open && isStacked) {
      list.current.style.position = "initial";
    } else {
      list.current.style.position = "relative";
    }
  };

  useEffect(() => {
    subgs(COMMENTS_OPEN, observeComments);
    return () => unsgs(COMMENTS_OPEN, observeComments);
  }, []);

  return (
    <ul ref={list} id="playlist-viewer-list" className="grid gap-xs">
      {searchedItems.map((item, i) => (
        <Item
          {...item}
          handleShareItem={handleShareItem}
          playlistId={playlistId}
          key={i}
        />
      ))}
    </ul>
  );
};

const handleSelect = (e) => sgs(ACTIVE_ITEM_ID, e.target.closest("li").id);

const Item = ({ id, label, type, url, views, playlistId, handleShareItem }) => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [repeating, setRepeating] = useState(false);
  const [commentsOpen, setCommentsOpen] = usegs(COMMENTS_OPEN);

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
              className="material-icons"
            >
              comment
            </i>
          )}
        </div>
      )}
      {commentsOpen && (
        <CommentSection
          targetType={type}
          targetId={playlistId}
          playlistId={playlistId}
        />
      )}
    </li>
  );
};
