import React, { useState, useEffect } from "react";
import "./Viewer.scss";

import { PlaylistViewer } from "../components/Viewer/PlaylistViewer";
import { SequenceViewer } from "../components/Viewer/SequenceViewer";
import { request } from "../utils/request";
import { DIRECTORY_TYPES } from "../stores/folder";

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

  const loadingText =
    type.toUpperCase() === DIRECTORY_TYPES.PLAYLIST
      ? `Loading Playlist...`
      : `Loading Sequence...`;

  return (
    <div className="viewer grid overflow-h">
      {!item ? (
        <div className="centered-grid bg-grey-dark cl-white">{loadingText}</div>
      ) : type === "playlist" ? (
        <PlaylistViewer {...item} />
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
