import React, { useState } from "react";

import ReactPlayer from "react-player";

import { setGlobalState } from "react-global-state-hook";
import { PLAYER_PROGRESS } from "../../views/Sequencer";

const handleProgress = (progress) =>
  setGlobalState(PLAYER_PROGRESS, {
    playedSeconds: progress.playedSeconds.toFixed(2)
  });

export const SequencerVideo = ({ selectedVideo }) => {
  const [playing] = useState(false);
  const [player, setPlayer]: any = useState();

  const ref = (player) => setPlayer(player);

  const handleReady = () => {
    if (player) {
    }
  };

  return (
    <div className="sequencer_video">
      {selectedVideo ? (
        <ReactPlayer
          className={"player"}
          height="100%"
          width="auto"
          pip={true}
          playing={playing}
          ref={ref}
          url={selectedVideo.url}
          onReady={handleReady}
          progressInterval={100}
          onProgress={handleProgress}
          controls={true}
        />
      ) : (
        "Loading Video"
      )}
    </div>
  );
};
