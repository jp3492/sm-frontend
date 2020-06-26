import React, { useCallback } from "react";

import ReactPlayer from "react-player";

import {
  setGlobalState,
  useGlobalState,
  getGlobalState
} from "react-global-state-hook";
import { PLAYER_PROGRESS } from "../../views/Sequencer";

export const SEQUENCER_PLAYER = "SEQUENCER_PLAYER";
export const SEQUENCER_PLAYER_PLAYING = "SEQUENCER_PLAYER_PLAYING";
export const SEQUENCER_PLAYING_SEQUENCES = "SEQUENCER_PLAYING_SEQUENCES";

setGlobalState(SEQUENCER_PLAYER, { ready: false, player: null });
setGlobalState(SEQUENCER_PLAYING_SEQUENCES, []);

export const SequencerVideo = ({ selectedVideo, sequences }) => {
  const [playing] = useGlobalState(SEQUENCER_PLAYER_PLAYING, false);

  const handleProgress = useCallback(
    (progress) => {
      const playedSeconds = Number(progress.playedSeconds.toFixed(2));
      setGlobalState(PLAYER_PROGRESS, {
        playedSeconds
      });
      const playingSequences = sequences
        .filter(
          ({ start, stop }) => start <= playedSeconds && stop >= playedSeconds
        )
        .map((s) => s.id);
      setGlobalState(SEQUENCER_PLAYING_SEQUENCES, playingSequences);
    },
    [sequences]
  );

  console.log(playing);

  const ref = (p) => {
    const playerState = getGlobalState(SEQUENCER_PLAYER);
    setGlobalState(SEQUENCER_PLAYER, { ...playerState, player: p });
  };

  const handleReady = () => {
    const playerState = getGlobalState(SEQUENCER_PLAYER);
    setGlobalState(SEQUENCER_PLAYER, { ...playerState, ready: true });
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
