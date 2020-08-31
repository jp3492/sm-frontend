import React, { useState, useEffect } from "react";
import "./CommentSection.scss";

import { usegs, sgs } from "../../utils/rxGlobal";
import { AUTH } from "../../services/auth";
import { getComments, postComment, deleteComment } from "../../stores/comment";
import { MODAL } from "../Modal";
import { timestampToTimePassed } from "../../utils/timestampToTimePassed";
import { onClickOutside } from "../../utils/clickOutside";
import { LoadingBar } from "../LoadingIndicators";

const handleLogin = () =>
  sgs(MODAL, {
    component: "AUTH",
    props: { type: "login" }
  });

export const CommentSection = ({
  targetType, // sequence || video
  targetId,
  playlistId, // if comment is in playlist
  stateId = `COMMENTS_${targetId}`
}: {
  targetType: "sequence" | "video";
  targetId: string;
  playlistId?: string;
  stateId?: string;
}) => {
  const [auth] = usegs(AUTH);
  const [comments] = usegs(stateId, []);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const get = async () => {
    setLoading(true);
    await getComments({
      targetType,
      targetId,
      playlistId
    });
    setLoading(false);
  };

  useEffect(() => {
    get();
    // this prevents the comments from being kept
    // return () => {
    //   cgs(stateId);
    // };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setComment("");
    await postComment({
      targetType,
      targetId,
      playlistId,
      content: comment
    });
    setLoading(false);
  };

  return (
    <div className="comment-section">
      {auth ? (
        <form onSubmit={handleSubmit} className="pd-05 grid gap-s grid-tc-1m">
          <textarea
            placeholder="Write a comment.."
            value={comment}
            onChange={({ target: { value } }) => setComment(value)}
          ></textarea>
          <button type="submit" className="align-e">
            <i className="material-icons">send</i>
          </button>
        </form>
      ) : (
        <div className="text-align-c">
          <button onClick={handleLogin} className="cl-text-pri">
            <b>Login to comment.</b>
          </button>
        </div>
      )}
      {loading && <LoadingBar />}
      <ul className="pd-05 grid gap-s">
        {comments.length === 0 ? (
          <li className="pd-05 text-align-c">Be the first to comment!</li>
        ) : (
          comments.map((c, i) => (
            <li key={i} id={c.id} className="comment rounded pd-05 grid gap-s">
              <div>
                <small>{c.userName}</small>
                <p>{c.content}</p>
                <span>{timestampToTimePassed(c.timestamp)}</span>
              </div>
              <CommentOptions
                id={c.id}
                stateId={stateId}
                setLoading={setLoading}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

const CommentOptions = ({ id, stateId, setLoading: setParentLoading }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setParentLoading(true);
    await deleteComment(id, stateId);
    setLoading(false);
    setParentLoading(false);
  };

  useEffect(() => {
    if (open) {
      onClickOutside(".comment_options-actions", () => setOpen(false));
    }
  }, [open]);

  return (
    <div className="comment_options">
      <i onClick={() => setOpen(!open)} className="material-icons">
        more_vert
      </i>
      {open && (
        <div className="comment_options-actions">
          {loading ? (
            <div>Deleting Comment...</div>
          ) : (
            <div onClick={handleDelete}>
              <label>Delete Comment</label>
              <i className="material-icons">delete</i>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
