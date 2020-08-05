import React, { useMemo } from "react";
import { Link } from "react-router-dom";

import { FOLDERS } from "../../stores/folder";
import { MODAL } from "../Modal";
import { usegs, sgs } from "../../utils/rxGlobal";

export const SEQUENCER_TARGET_FOLDER = "SEQUENCER_TARGET_FOLDER";

export const SequencerHeader = ({ selectedVideo }) => {
  const [targetFolderId, setTargetFolderId] = usegs(
    SEQUENCER_TARGET_FOLDER,
    null
  );
  const [folders] = usegs(FOLDERS);

  const targetFolder = useMemo(() => {
    return folders.find((f) => f.id === targetFolderId);
  }, [targetFolderId, folders]);

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
