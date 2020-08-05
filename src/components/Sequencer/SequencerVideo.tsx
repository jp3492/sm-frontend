import React, { useCallback, useEffect } from "react";
import ReactPlayer from "react-player";

import { PLAYER_PROGRESS } from "../../views/Sequencer";
import { sgs, usegs, ggs, ugs } from "../../utils/rxGlobal";

export const SEQUENCER_PLAYER = "SEQUENCER_PLAYER";
export const SEQUENCER_PLAYER_PLAYING = "SEQUENCER_PLAYER_PLAYING";
export const SEQUENCER_PLAYING_SEQUENCES = "SEQUENCER_PLAYING_SEQUENCES";
export const SEQUENCER_PLAYER_PLAYBACK_RATE = "SEQUENCER_PLAYER_PLAYBACK_RATE";

sgs(SEQUENCER_PLAYER, { ready: false, player: null });
sgs(SEQUENCER_PLAYING_SEQUENCES, []);
sgs(SEQUENCER_PLAYER_PLAYBACK_RATE, 1);

export const SequencerVideo = ({ selectedVideo, sequences }) => {
  const [playing, setPlaying] = usegs(SEQUENCER_PLAYER_PLAYING, false);
  const [playbackRate, setPlaybackRate] = usegs(
    SEQUENCER_PLAYER_PLAYBACK_RATE
  );

  useEffect(() => {
    document.addEventListener("controls", handleControls);
    return () => document.removeEventListener("controls", handleControls);
  }, []);

  const handleControls = useCallback(
    (e) => {
      const event = e.detail;
      if (event === "playback") {
        setPlaybackRate(playbackRate === 1 ? 0.5 : 1);
      }
    },
    [playbackRate]
  );

  const handleProgress = useCallback(
    (progress) => {
      const playedSeconds = Number(progress.playedSeconds.toFixed(2));
      sgs(PLAYER_PROGRESS, {
        playedSeconds
      });
      const playingSequences = sequences
        .filter(
          ({ start, stop }) => start <= playedSeconds && stop >= playedSeconds
        )
        .map((s) => s.id);
      sgs(SEQUENCER_PLAYING_SEQUENCES, playingSequences);
    },
    [sequences]
  );

  const ref = useCallback((p) => {
    ugs(SEQUENCER_PLAYER, playerState => ({ ...playerState, player: p }));
  }, []);

  const handleReady = useCallback(() => {
    ugs(SEQUENCER_PLAYER, playerState => ({ ...playerState, ready: true }))
  }, []);

  const handlePause = useCallback(() => setPlaying(false), []);
  const handlePlay = useCallback(() => setPlaying(true), []);

  return (
    <div className="sequencer_video">
      {selectedVideo ? (
        <ReactPlayer
          className={"player"}
          height="100%"
          width="auto"
          pip={true}
          playing={playing}
          playbackRate={playbackRate}
          ref={ref}
          url={selectedVideo.url}
          onReady={handleReady}
          onPlay={handlePlay}
          onPause={handlePause}
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
