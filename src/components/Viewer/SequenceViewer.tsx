import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo
} from "react";
import ReactPlayer from "react-player";

import { platforms } from "../../views/Landing";

export const SequenceViewer = ({ sequence }) => {
  const [playing, setPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [open, setOpen] = useState(true);

  const player: any = useRef();
  const ref = (p) => (player.current = p);

  const handleReady = useCallback(() => setPlayerReady(true), []);

  useEffect(() => {
    if (playerReady) {
      player.current.seekTo(sequence.start, "seconds");
    }
  }, [playerReady]);

  const handleReplay = useCallback(() => {
    player.current.seekTo(sequence.start, "seconds");
    setPlaying(true);
  }, [sequence]);

  const handleProgress = useCallback(
    ({ playedSeconds }) => {
      if (sequence.stop && playedSeconds >= sequence.stop) {
        setPlaying(false);
      }
    },
    [sequence]
  );

  const handlePlay = useCallback(() => {
    if (playerReady) setPlaying(true);
  }, [playerReady]);

  const handlePause = useCallback(() => setPlaying(false), []);

  const platform = useMemo(() => platforms[sequence.url.split(".")[1]], [
    sequence
  ]);

  return (
    <div className="sequence_viewer">
      {open ? (
        !playing && (
          <div className="info">
            <div>
              <div>
                <img src={platform} height="20px" alt="platform" />
                <h5>{sequence.videoLabel}</h5>
                <i className="material-icons" onClick={() => setOpen(false)}>
                  chevron_right
                </i>
              </div>
              <p>"{sequence.label}"</p>
              {playerReady && (
                <button onClick={handleReplay}>
                  <i className="material-icons">replay</i>
                  Replay
                </button>
              )}
              <button onClick={handlePlay}>
                {!playerReady ? (
                  "Loading..."
                ) : (
                  <>
                    <i className="material-icons">play_arrow</i>
                    Play
                  </>
                )}
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="panel bg-grey">
          <i
            className="material-icons pd-05"
            onClick={() => {
              setPlaying(false);
              setOpen(true);
            }}
          >
            chevron_left
          </i>
          <i
            className="material-icons pd-05"
            onClick={() => setPlaying(!playing)}
          >
            {playing ? "pause" : "play_arrow"}
          </i>
          <i className="material-icons pd-05" onClick={handleReplay}>
            replay
          </i>
        </div>
      )}
      <ReactPlayer
        className={"player_viewer"}
        height="100%"
        width="100%"
        playing={playing}
        ref={ref}
        url={sequence.url}
        onPause={handlePause}
        onReady={handleReady}
        onProgress={handleProgress}
      />
    </div>
  );
};
