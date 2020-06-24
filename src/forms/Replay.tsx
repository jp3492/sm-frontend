import React from "react";

export const Replay = ({ closeModal, onReplay }) => {
  const handleReplay = () => {
    onReplay();
    closeModal();
  };
  // can add feedback textfield
  // when logged in add save button
  // if not logged in show login button with info text
  // that you could save this if you were logged in

  return (
    <form className="viewer_modal">
      <button type="button" onClick={handleReplay}>
        <i className="material-icons">replay</i>
        Replay
      </button>
    </form>
  );
};
