import React from "react";
import { Link } from "react-router-dom";

import { MODAL } from "../Modal";
import { sgs } from "../../utils/rxGlobal";

export const SEQUENCER_TARGET_FOLDER = "SEQUENCER_TARGET_FOLDER";

export const SequencerHeader = ({ selectedVideo }) => {
  const handleEdit = () => {
    sgs(MODAL, {
      component: "video",
      props: selectedVideo
    });
  };

  return (
    <div className="sequencer_header aligned-grid grid-tc-m1m z2 gap-m">
      <Link to="/dashboard" className="pd-01 centered-grid">
        <i className="material-icons">home</i>
      </Link>
      <div className="sequencer_header-info aligned-grid grid-tc-m1m gap-m">
        <i className="material-icons">ondemand_video</i>
        {!selectedVideo ? "Loading Video..." : selectedVideo.label}
        <i onClick={handleEdit} className="material-icons">
          more_vert
        </i>
      </div>
    </div>
  );
};
