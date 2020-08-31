import React, { useEffect, useMemo } from "react";
import "../components/Sequencer/Sequencer.scss";

import { VIDEOS, getVideo } from "../stores/videos";
import { SEQUENCES } from "../stores/sequences";
import { Tagger } from "../components/Sequencer/Tagger";
import { SequencerListHeader } from "../components/Sequencer/SequencerListHeader";
import { SequencerList } from "../components/Sequencer/SequencerList";
import { SequencerHeader } from "../components/Sequencer/SequencerHeader";
import { SequencerVideo } from "../components/Sequencer/SequencerVideo";
// import { SequencerControls } from "../components/Sequencer/SequencerControls";
import { SequencerActions } from "../components/Sequencer/SequencerActions";
import { getFolders } from "../stores/folder";
import { usegs, sgs } from "../utils/rxGlobal";
import { getPlaylists } from "../stores/playlists";

export const PLAYER_PROGRESS = "PLAYER_PROGRESS";
export const SEQUENCER_VIDEO = "SEQUENCER_VIDEO";

const CTRL_EVENTS = {
  0: "play",
  10: "tag",
  38: "back",
  40: "next",
  67: "close",
  66: "edit",
  88: "playback"
};

const CTRL_ALT_EVENTS = {
  37: "rewind",
  39: "forward",
  65: "fasttagging",
  8: "tagback"
};

const handleKeyPress = (e) => {
  const isMac = navigator.platform.includes("Mac");
  if (isMac) {
  } else {
    const key = e.keyCode;
    const ctrl = e.ctrlKey;
    const alt = e.altKey;

    if (ctrl && CTRL_EVENTS[key]) {
      const event = new CustomEvent("controls", { detail: CTRL_EVENTS[key] });
      document.dispatchEvent(event);
    } else if (ctrl && alt && CTRL_ALT_EVENTS[key]) {
      const event = new CustomEvent("controls", {
        detail: CTRL_ALT_EVENTS[key]
      });
      document.dispatchEvent(event);
    }
  }
};

const Sequencer = ({
  match: {
    params: { id }
  },
  location: { search }
}) => {
  const [videos] = usegs(VIDEOS);
  const [sequences] = usegs(SEQUENCES);

  useEffect(() => {
    getFolders();
    getPlaylists();
  }, []);

  useEffect(() => {
    // listen to keyboard shortcuts
    // Maybe move this to aservice like script?
    document.addEventListener("keypress", handleKeyPress);
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [id]);

  useEffect(() => {
    // Only get the video if its not existing in videos
    // Makes this view independent of Dashboard
    if (!videos.find((v) => v.id === id)) {
      getVideo(id);
    }
  }, [id, videos]);

  const sequenceId = useMemo(() => {
    // In case a initial sequence is set as query params
    // This sequence needs to be selected and played from the beginning
    return search
      .slice(1, search.length)
      .split("&")
      .filter((q) => q.split("=")[0] === "sequenceId")
      .map((q) => q.split("=")[1])
      .find((_, i) => i === 0);
  }, [search]);

  const selectedVideo = useMemo(() => videos.find((v) => v.id === id), [
    videos,
    id
  ]);

  useEffect(() => sgs(SEQUENCER_VIDEO, selectedVideo), [selectedVideo]);

  const videoSequences = useMemo(() => {
    if (selectedVideo) {
      return sequences.filter((s) => s.videoId === selectedVideo.id);
    }
    return [];
  }, [sequences, selectedVideo]);

  return (
    <div className="dashboard-loading sequencer overflow-h grid grid-tc-1m grid-tr-m1 bg-grey-light">
      <SequencerHeader selectedVideo={selectedVideo} />
      <SequencerVideo
        sequences={videoSequences}
        selectedVideo={selectedVideo}
      />
      <div className="sequencer_list grid grid-tr-m1mm">
        <SequencerListHeader sequences={videoSequences} />
        <SequencerList sequences={videoSequences} sequenceId={sequenceId} />
        <SequencerActions />
        <Tagger />
        {/* <SequencerControls /> */}
      </div>
    </div>
  );
};

export default Sequencer;
