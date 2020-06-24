import React, { useEffect, useState, useMemo } from "react";
import "./Sequencer.scss";
import { useGlobalState } from "react-global-state-hook";
// import { PROJECTS } from "../stores/projects";
import { VIDEOS, getVideo } from "../stores/videos";
import { SEQUENCER_TARGET, SEQUENCES } from "../stores/sequences";
import { PLAYLISTS, getPlaylist } from "../stores/playlists";
import { Tagger } from "../components/Sequencer/Tagger";
import { postSequence } from "../stores/sequences";
import { SequencerListHeader } from "../components/Sequencer/SequencerListHeader";
import { SequencerList } from "../components/Sequencer/SequencerList";
import { SequencerHeader } from "../components/Sequencer/SequencerHeader";
import { SequencerVideo } from "../components/Sequencer/SequencerVideo";
import { SequencerControls } from "../components/Sequencer/SequencerControls";
import { SequencerActions } from "../components/Sequencer/SequencerActions";
// import { closeModal } from "../components/Modal";
import { DIRECTORY_TYPES, getFolders } from "../stores/folder";

export const PLAYER_PROGRESS = "PLAYER_PROGRESS";

export const Sequencer = ({
  match: {
    params: { type, id }
  }
}) => {
  // const [projects] = useGlobalState(PROJECTS);
  const [playlists] = useGlobalState(PLAYLISTS);
  const [videos] = useGlobalState(VIDEOS);
  const [sequences] = useGlobalState(SEQUENCES);

  const [target, setTarget]: any = useGlobalState(SEQUENCER_TARGET);
  const [selectedVideoIndex] = useState(0);

  useEffect(() => {
    getFolders();
  }, []);

  useEffect(() => {
    if (type === DIRECTORY_TYPES.VIDEO.toLowerCase()) {
      const video = videos.find((v) => v.id === id);
      if (video) {
        setTarget({ type, ...video });
      } else {
        getVideo(id);
      }
    } else if (type === DIRECTORY_TYPES.PLAYLIST) {
      const playlist = playlists.find((p) => p.id === id);
      if (playlist) {
        setTarget({ type, ...playlist });
      } else {
        getPlaylist(id);
      }
    } else if (type === "project") {
    }
  }, [type, id, videos, playlists, setTarget]);

  const selectedVideo = useMemo(() => {
    return videos.find((v) => v.id === id);
  }, [videos, id]);

  const otherVideos = useMemo(() => {
    return videos.filter((v) => v.id !== selectedVideo.id);
  }, [selectedVideo, videos]);

  const handleSubmit = ({ start, stop, label }) => {
    // if in video mode, post sequence without referencing it anywhere
    if (type === DIRECTORY_TYPES.VIDEO.toLowerCase()) {
      postSequence({
        videoId: target.id,
        start,
        stop,
        label,
        url: target.url
      });
    }
  };

  const videoSequences = useMemo(() => {
    if (target) {
      return sequences.filter((s) => s.videoId === target.id);
    }
    return [];
  }, [sequences, target]);
  console.log(videoSequences);

  return (
    <div className="sequencer">
      <SequencerHeader
        type={type}
        selectedVideo={selectedVideo}
        otherVideos={otherVideos}
        selectedVideoIndex={selectedVideoIndex}
      />
      <SequencerVideo selectedVideo={selectedVideo} />
      <div className="sequencer_list">
        <SequencerListHeader sequences={sequences} />
        <SequencerList sequences={videoSequences} />
        <SequencerActions />
        <Tagger onSubmit={handleSubmit} />
        <SequencerControls />
      </div>
    </div>
  );
};
