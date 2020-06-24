import React, { useState, useEffect } from "react";
import "./Viewer.scss";
import { PlaylistViewer } from "../components/Viewer/PlaylistViewer";
import { VideoViewer } from "../components/Viewer/VideoViewer";
import { SequenceViewer } from "../components/Viewer/SequenceViewer";
import { request } from "../utils/request";
import { Playlist } from "../forms/Playlist";

export const Viewer = ({
  match: {
    params: { type, id }
  }
}) => {
  const [item, setItem] = useState();

  useEffect(() => {
    if (type && id) {
      getItem();
    } else {
      alert("Type and Id needs to be provided: /video/someid323423");
    }
  }, [type, id]);

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

  return (
    <div className="viewer">
      {!item ? (
        <div>Loading...</div>
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
