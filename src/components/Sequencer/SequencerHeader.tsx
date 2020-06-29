import React, { useMemo } from "react";
import { Link } from "react-router-dom";

import { FOLDERS } from "../../stores/folder";
import { useGlobalState, setGlobalState } from "react-global-state-hook";
import { MODAL } from "../Modal";

export const SEQUENCER_TARGET_FOLDER = "SEQUENCER_TARGET_FOLDER";

export const SequencerHeader = ({ selectedVideo }) => {
  const [targetFolderId, setTargetFolderId] = useGlobalState(
    SEQUENCER_TARGET_FOLDER,
    null
  );
  const [folders] = useGlobalState(FOLDERS);

  const targetFolder = useMemo(() => {
    return folders.find((f) => f.id === targetFolderId);
  }, [targetFolderId, folders]);

  const handleSelectFolder = () => {
    setGlobalState(MODAL, {
      component: "selectFolder",
      props: {
        onSelect: (id) => setTargetFolderId(id)
      }
    });
  };

  const handleEdit = () => {
    setGlobalState(MODAL, {
      component: "video",
      props: selectedVideo
    });
  };

  return (
    <div className="sequencer_header aligned-grid grid-tc-m1m z2 gap-m">
      <Link to="/dashboard" className="pd-01 centered-grid">
        <i className="material-icons">home</i>
      </Link>
      <div className="sequencer_header-info aligned-grid grid-tc-1m">
        {!selectedVideo ? "Loading Video..." : selectedVideo.label}
        <i onClick={handleEdit} className="material-icons">
          more_vert
        </i>
      </div>
      <button className="pd-01 bg-grey" onClick={handleSelectFolder}>
        <i className="material-icons">folder</i>
        {!targetFolder ? "Root Folder" : targetFolder.label}
      </button>
    </div>
  );
};
