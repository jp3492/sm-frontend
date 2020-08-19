import React, { useState, useEffect, useMemo } from "react";
import "./Viewer.scss";

import { PlaylistViewer, PV_ITEMS } from "../components/Viewer/PlaylistViewer";
import { SequenceViewer } from "../components/Viewer/SequenceViewer";
import { request } from "../utils/request";
import { DIRECTORY_TYPES } from "../stores/folder";
import { searchToQuery } from "../utils/searchToQuery";
import { rgss, ugs } from "../utils/rxGlobal";
import {
  PV_PLAYERS,
  ACTIVE_ITEM_ID,
  ACTIVE_URL,
  PV_PLAYING
} from "../components/Viewer/PlaylistViewer";

export const Viewer = ({
  match: {
    params: { type, id }
  },
  location: { search }
}) => {
  const [item, setItem] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    incrementView(type, id);
    return () => {
      rgss([PV_PLAYERS, ACTIVE_ITEM_ID, ACTIVE_URL, PV_PLAYING, PV_ITEMS]);
    };
  }, []);

  const query = useMemo(() => (search ? searchToQuery(search) : {}), [search]);

  const getItem = async () => {
    if (type === "playlist") {
      const playlist = await getPlaylist(id);
      setItem(playlist);
    } else {
      const sequence = await getSequence(id);
      setItem(sequence);
    }
    setLoading(false);
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
      {!item || loading ? (
        <div className="centered-grid bg-grey-dark cl-white">{loadingText}</div>
      ) : type === "playlist" ? (
        <PlaylistViewer {...item} query={query} />
      ) : (
        <SequenceViewer sequence={item} query={query} />
      )}
    </div>
  );
};

export const incrementView = async (type, id) => {
  try {
    await request("viewer", `/count/${type.toLowerCase()}/${id}`, {
      method: "PATCH"
    });
    ugs(PV_ITEMS, (items) =>
      items.map((i) => (i.id === id ? { ...i, views: (i.views || 0) + 1 } : i))
    );
  } catch (error) {
    console.log(error);
  }
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
