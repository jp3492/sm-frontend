import React, { useState } from "react";

export const Videos = ({ selectedVideo, otherVideos, selectedVideoIndex }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="sequencer_header-videos">
      <div>
        {!selectedVideo ? (
          <>
            <span></span>
            <label>Loading Video...</label>
          </>
        ) : (
          <>
            <span>{selectedVideoIndex + 1}</span>
            <label>{selectedVideo.label}</label>
            {otherVideos.length !== 0 && (
              <i onClick={() => setOpen(!open)} className="material-icons">
                {open ? "keyboard_arrow_up" : "keyboard_arrow_down"}
              </i>
            )}
          </>
        )}
      </div>
      {open && (
        <ul>
          {otherVideos.map((v, i) => (
            <li key={i} id={v.id}>
              <span>{i}</span>
              <label>{v.label}</label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
