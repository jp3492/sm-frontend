import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo
} from "react";
import ReactPlayer from "react-player";

import { platforms } from "../../views/Landing";
import { getPlatformFromUrl } from "../../utils/getPlatformFromUrl";
import { CommentSection } from "./CommentSection";

export const SequenceViewer = ({ sequence, query }) => {
  const [playing, setPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [open, setOpen] = useState(true);

  const { originId, originLabel } = query;

  const originLink =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/viewer/playlist/" + originId
      : "https://viden.pro/viewer/playlist/" + originId;

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

  const platform = useMemo(() => platforms[getPlatformFromUrl(sequence.url)], [
    sequence
  ]);

  return (
    <div className="sequence_viewer">
      <div className="players">
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
      <div className="viewer_list" data-open={open}>
        <div className="viewer_list-header">
          <img src={platform} height="20px" alt="platform" />
          <h3>{sequence.videoLabel}</h3>
        </div>
        <div className="viewer_list-sequence grid grid-tc-m1 c-gap-m pd-05 align-i-c">
          <i className="material-icons sequence-icon">open_in_full</i>
          <b>{sequence.label}</b>
          <i className="material-icons">access_time</i>
          <small>{`${sequence.start} - ${sequence.stop}`}</small>
        </div>

        <CommentSection
          playlistId={originId}
          targetType="sequence"
          targetId={sequence.id}
        />
        <div className="panel">
          <i
            className="material-icons"
            onClick={() => {
              setPlaying(false);
              setOpen(!open);
            }}
          >
            {open ? "chevron_right" : "chevron_left"}
          </i>
          <i className="material-icons">{playing ? "pause" : "play_arrow"}</i>

          <i className="material-icons" onClick={handleReplay}>
            replay
          </i>
          <i className="material-icons">repeat_one</i>
          <i className="material-icons">open_in_new</i>
          <i className="material-icons">share</i>
        </div>
      </div>
    </div>
  );
};
