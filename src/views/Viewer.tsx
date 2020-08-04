import React, { useState, useEffect } from "react";
import "./Viewer.scss";

import { PlaylistViewer } from "../components/Viewer/PlaylistViewer";
import { VideoViewer } from "../components/Viewer/VideoViewer";
import { SequenceViewer } from "../components/Viewer/SequenceViewer";
import { request } from "../utils/request";

export const Viewer = ({
  match: {
    params: { type, id }
  }
}) => {
  const [item, setItem] = useState();

  const getItem = async () => {
    if (type === "playlist") {
      const playlist = await getPlaylist(id);
      setItem(playlist);
    } else if (type === "video") {
      const video = await getVideo(id);
      setItem(video);
    } else {
      const sequence = await getSequence(id);
      setItem(sequence);
    }
  };

  useEffect(() => {
    if (type && id) {
      getItem();
    } else {
      alert("Type and Id needs to be provided: /video/someid323423");
    }
  }, [type, id]);

  useEffect(() => {
    console.log(item);
  }, [item]);

  return (
    <div className="viewer grid overflow-h">
      {!item ? (
        <div className="centered-grid bg-grey-dark">Loading...</div>
      ) : type === "playlist" ? (
        <PlaylistViewer {...item} />
      ) : type === "video" ? (
        <VideoViewer video={item} />
      ) : (
        <SequenceViewer sequence={item} />
      )}
    </div>
  );
};

// Have these request locally to not conflict with other states and request handlers
// Viewer should always work completely independent
// Will move to own app later
const getPlaylist = async (id) => {
  try {
    const res = await request("viewer", "/playlist/" + id);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
const getVideo = async (id) => {
  try {
    const res = await request("viewer", "/video/" + id);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
const getSequence = async (id) => {
  try {
    const res = await request("viewer", "/sequence/" + id);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
