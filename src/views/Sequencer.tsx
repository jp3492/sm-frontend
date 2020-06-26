import React, { useEffect, useMemo } from "react";
import "../components/Sequencer/Sequencer.scss";

import { useGlobalState, setGlobalState } from "react-global-state-hook";

import { VIDEOS, getVideo } from "../stores/videos";
import { SEQUENCES } from "../stores/sequences";
import { Tagger } from "../components/Sequencer/Tagger";
import { SequencerListHeader } from "../components/Sequencer/SequencerListHeader";
import { SequencerList } from "../components/Sequencer/SequencerList";
import { SequencerHeader } from "../components/Sequencer/SequencerHeader";
import { SequencerVideo } from "../components/Sequencer/SequencerVideo";
import { SequencerControls } from "../components/Sequencer/SequencerControls";
import { SequencerActions } from "../components/Sequencer/SequencerActions";
import { getFolders } from "../stores/folder";

export const PLAYER_PROGRESS = "PLAYER_PROGRESS";

const KEY_EVENTS = {
  0: "play",
  10: "tag",
  127: "tagback",
  37: "rewind",
  38: "back",
  39: "forward",
  40: "next"
};

const handleKeyPress = (e) => {
  const key = e.keyCode;
  const ctrl = e.ctrlKey;
  if (ctrl) {
    if (KEY_EVENTS[key]) {
      const event = new CustomEvent("controls", { detail: KEY_EVENTS[key] });
      document.dispatchEvent(event);
    }
  }
};

export const SEQUENCER_VIDEO = "SEQUENCER_VIDEO";

export const Sequencer = ({
  match: {
    params: { id }
  },
  location: { search }
}) => {
  const [videos] = useGlobalState(VIDEOS);
  const [sequences] = useGlobalState(SEQUENCES);

  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [id]);

  const sequenceId = useMemo(() => {
    return search
      .slice(1, search.length)
      .split("&")
      .filter((q) => q.split("=")[0] === "sequenceId")
      .map((q) => q.split("=")[1])
      .find((_, i) => i === 0);
  }, [search]);

  useEffect(() => {
    getFolders();
  }, []);

  useEffect(() => {
    if (!videos.find((v) => v.id === id)) {
      getVideo(id);
    }
  }, [id, videos]);

  const selectedVideo = useMemo(() => videos.find((v) => v.id === id), [
    videos,
    id
  ]);

  useEffect(() => setGlobalState(SEQUENCER_VIDEO, selectedVideo), [
    selectedVideo
  ]);

  const videoSequences = useMemo(() => {
    if (selectedVideo) {
      return sequences.filter((s) => s.videoId === selectedVideo.id);
    }
    return [];
  }, [sequences, selectedVideo]);

  return (
    <div className="sequencer">
      <SequencerHeader selectedVideo={selectedVideo} />
      <SequencerVideo
        sequences={videoSequences}
        selectedVideo={selectedVideo}
      />
      <div className="sequencer_list">
        <SequencerListHeader sequences={videoSequences} />
        <SequencerList sequences={videoSequences} sequenceId={sequenceId} />
        <SequencerActions />
        <Tagger />
        <SequencerControls />
      </div>
    </div>
  );
};
