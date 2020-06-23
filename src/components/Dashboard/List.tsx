import React, { useState, useEffect, useMemo } from "react";
import "./List.scss";
import { useGlobalState, setGlobalState } from "react-global-state-hook";
import { PLAYLIST_ITEMS } from "../../stores/playlist_items";
import {
  PLAYLIST_OPEN,
  ACTIVE_PLAYLIST,
  PLAYLISTS,
  patchPlaylist
} from "../../stores/playlists";
import { VIDEOS } from "../../stores/videos";
import { MODAL } from "../Modal";
import { Player, PLAYER_ITEM } from "./Player";
import { ListSearch } from "./ListSearch";
import { ListActions } from "./ListActions";
import { ListSelection } from "./ListSelection";
import { ListList } from "./ListList";
import { DIRECTORY_TYPES } from "../../stores/folder";
import { SEQUENCES } from "../../stores/sequences";

export const SELECTED_LIST_ITEMS = "SELECTED_LIST_ITEMS";

export const Playlist = () => {
  const [open] = useGlobalState(PLAYLIST_OPEN);
  const [items, setItems] = useGlobalState(PLAYLIST_ITEMS);
  const [videos] = useGlobalState(VIDEOS);
  const [sequences] = useGlobalState(SEQUENCES);
  const [playlists] = useGlobalState(PLAYLISTS);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useGlobalState(
    SELECTED_LIST_ITEMS,
    []
  );
  const [activePlaylist, setActivePlaylist] = useGlobalState(ACTIVE_PLAYLIST);

  const playlist = useMemo(() => {
    return playlists.find((p) => p.id === activePlaylist);
  }, [activePlaylist, playlists]);

  useEffect(() => {
    if (playlist) {
      const videoIds = playlist.items
        .filter((i) => i.split(":")[0] === DIRECTORY_TYPES.VIDEO)
        .map((i) => i.split(":")[1]);
      const vids = videos
        .filter((v) => videoIds.includes(v.id))
        .map((v) => ({ type: DIRECTORY_TYPES.VIDEO, ...v }));

      const sequenceIds = playlist.items
        .filter((i) => i.split(":")[0] === DIRECTORY_TYPES.SEQUENCE)
        .map((i) => i.split(":")[1]);
      const seqs = sequences
        .filter((s) => sequenceIds.includes(s.id))
        .map((s) => ({ type: DIRECTORY_TYPES.SEQUENCE, ...s }));

      setItems([...vids, ...seqs]);
      setSelectedItems([]);
    }
  }, [playlist, sequences, videos, setItems, setSelectedItems]);

  useEffect(() => {
    setFilteredItems(items.filter((i) => i.type !== DIRECTORY_TYPES.PLAYLIST));
  }, [items]);

  const handleDrop = (e) => {
    const { ids, type } = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (playlist) {
      if (type === DIRECTORY_TYPES.VIDEO) {
        const videoIds = items
          .filter((i) => i.type === DIRECTORY_TYPES.VIDEO)
          .map((i) => i.id);
        const newVideos = videos
          .filter((v) => ids.includes(v.id) && !videoIds.includes(v.id))
          .map((v) => `VIDEO:${v.id}`);
        if (newVideos.length === 0) {
          alert("All Videos already exist in Playlist");
        } else {
          patchPlaylist({
            ...playlist,
            items: [...playlist.items, ...newVideos]
          });
        }
      } else if (type === DIRECTORY_TYPES.SEQUENCE) {
        const sequenceIds = items
          .filter((i) => i.type === DIRECTORY_TYPES.SEQUENCE)
          .map((i) => i.id);
        const newSequences = sequences
          .filter((s) => ids.includes(s.id) && !sequenceIds.includes(s.id))
          .map((s) => `SEQUENCE:${s.id}`);
        if (newSequences.length === 0) {
          alert("All sequences already exist in playlist");
        } else {
          patchPlaylist({
            ...playlist,
            items: [...playlist.items, ...newSequences]
          });
        }
      }
    } else {
      if (type === DIRECTORY_TYPES.VIDEO) {
        addVideos(ids);
        // addVideo(id);
      } else if (type === DIRECTORY_TYPES.SEQUENCE) {
        addSequences(ids);
      } else if (type === DIRECTORY_TYPES.PLAYLIST) {
        if (ids.length === 1 && items.length === 0) {
          setActivePlaylist(ids[0]);
        } else {
          addPlaylists(ids);
        }
      }
    }
  };

  const addSequences = (ids) => {
    const seqs = sequences.filter((s) => ids.includes(s.id));
    const newSeqs = seqs.filter((s) => !items.find((i) => i.id === s.id));
    if (newSeqs.length === 0) {
      alert("Sequences already exist in playlist");
    } else if (activePlaylist) {
      patchPlaylist({
        ...playlist,
        items: [...items, ...newSeqs].map((i) => `${i.type}:${i.id}`)
      });
    } else {
      setItems([
        ...items,
        ...newSeqs.map((s) => ({ type: DIRECTORY_TYPES.SEQUENCE, ...s }))
      ]);
      setSelectedItems([...selectedItems, ...newSeqs.map((s) => s.id)]);
    }
  };

  const addVideos = (ids) => {
    const vids = videos.filter((v) => ids.includes(v.id));
    const newVids = vids.filter((v) => !items.find((i) => i.id === v.id));
    if (newVids.length === 0) {
      alert("Videos already in list");
    } else if (activePlaylist) {
      // here the format "type:id" needs to be sent to backend
      patchPlaylist({
        ...playlist,
        items: [...items, ...newVids].map((i) => `${i.type}:${i.id}`)
      });
    } else {
      // here we keep the given format
      // onle when sent to backend convert to item: ["type:id"]
      setItems([
        ...items,
        ...newVids.map((v) => ({ type: DIRECTORY_TYPES.VIDEO, ...v }))
      ]);
      setSelectedItems([...selectedItems, ...newVids.map((v) => v.id)]);
    }
  };

  const addPlaylists = (ids) => {
    const lists = playlists.filter((p) => ids.includes(p.id));
    const listItems = lists.reduce(
      // @ts-ignore
      (prev, curr) => [...new Set([...prev, ...curr.items])],
      []
    );

    const newItems = listItems
      .filter((i) => {
        const [type, id] = i.split(":");
        return !items.find((v) => v.type === type && v.id === id);
      })
      .map((i) => {
        const [type, id] = i.split(":");
        return { type, id };
      });

    const newVideos = newItems
      .filter((i) => i.type === DIRECTORY_TYPES.VIDEO)
      .map((i) => i.id)
      .map((id) => videos.find((v) => v.id === id));

    const newSequences = newItems
      .filter((i) => i.type === DIRECTORY_TYPES.SEQUENCE)
      .map((i) => i.id)
      .map((id) => sequences.find((s) => s.id === id));

    const itemsToAdd = [...items, ...newVideos, ...newSequences];

    if ([...newVideos, ...newSequences].length === 0) {
      return alert("All videos and sequences already in playlist");
    }
    if (activePlaylist && (ids.length > 1 || ids[0] !== activePlaylist)) {
      setActivePlaylist();
      setSelectedItems(itemsToAdd.map((i) => i.id));
    }
    setItems(itemsToAdd);
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    const id = e.target.closest("li").id;
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSave = () => {
    const selection = items
      .filter((i) => selectedItems.includes(i.id))
      .map((i) => `${i.type}:${i.id}`);
    setGlobalState(MODAL, {
      component: DIRECTORY_TYPES.PLAYLIST,
      props: {
        items: selection
      }
    });
  };

  const handleClose = () => {
    setActivePlaylist();
    setGlobalState(PLAYER_ITEM, undefined);
    setItems([]);
  };

  const handleDelete = () => {
    const updatedItems = items
      .filter((i) => !selectedItems.includes(i.id))
      .map((i) => `${i.type}:${i.id}`);

    patchPlaylist({ ...playlist, items: updatedItems });
  };

  const handleRemove = () =>
    setItems(items.filter((i) => !selectedItems.includes(i.id)));

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`playlist ${open ? "open" : ""}`}
    >
      <div className="playlist_header">
        <div>
          <h4>
            <i className="material-icons">queue_music</i>
            {!playlist ? "No Playlist active" : playlist.label}
            {items.length !== 0 && (
              <i onClick={handleClose} className="material-icons">
                close
              </i>
            )}
          </h4>
          {items.length !== 0 && <ListSearch />}
        </div>
        <ListList
          items={items}
          selectedItems={selectedItems}
          filteredItems={filteredItems}
          handleSelect={handleSelect}
        />
      </div>

      <div className="playlist_controls">
        {items.length !== 0 && (
          <>
            {selectedItems.length !== 0 && (
              <ListSelection
                activePlaylist={activePlaylist}
                handleDelete={handleDelete}
                handleRemove={handleRemove}
                handleSave={handleSave}
              />
            )}
            <ListActions items={items} />
          </>
        )}
      </div>
      <Player />
    </div>
  );
};
