import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Videos } from "./Videos";
import { DIRECTORY_TYPES, FOLDERS } from "../../stores/folder";
import { useGlobalState, setGlobalState } from "react-global-state-hook";
import { MODAL } from "../Modal";

export const SEQUENCER_TARGET_FOLDER = "SEQUENCER_TARGET_FOLDER";

export const SequencerHeader = ({
  type,
  selectedVideo,
  otherVideos,
  selectedVideoIndex
}) => {
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

  return (
    <div className="sequencer_header">
      <Link to="/dashboard">
        <i className="material-icons">home</i>
      </Link>
      {type === DIRECTORY_TYPES.VIDEO ? (
        <div className="sequencer_header-info">
          {!selectedVideo ? "Loading Video..." : selectedVideo.label}
        </div>
      ) : (
        <>
          <div className="sequencer_header-info">Project Name</div>
          <Videos
            selectedVideo={selectedVideo}
            otherVideos={otherVideos}
            selectedVideoIndex={selectedVideoIndex}
          />
        </>
      )}
      <button onClick={handleSelectFolder}>
        <i className="material-icons">folder</i>
        {!targetFolder ? "Root Folder" : targetFolder.label}
      </button>
    </div>
  );
};
