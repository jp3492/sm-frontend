import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./List.scss";
import { PLAYLIST_ITEMS } from "../../stores/playlist_items";
import {
  PLAYLIST_OPEN,
  ACTIVE_PLAYLIST,
  PLAYLISTS,
  patchPlaylist
} from "../../stores/playlists";
import { VIDEOS } from "../../stores/videos";
import { Player, PLAYER_ITEM } from "./Player";
import { ListActions } from "./ListActions";
import { ListSelection } from "./ListSelection";
import { ListList } from "./ListList";
import { DIRECTORY_TYPES } from "../../stores/folder";
import { SEQUENCES } from "../../stores/sequences";
import { itemsToPlaylistItems } from "../../utils/itemsToPlaylistItems";
import { usegs, sgs, ggs } from "../../utils/rxGlobal";
import { DIRECTORY_SORTED_SEQUENCES } from "./Directory";

export const SELECTED_LIST_ITEMS = "SELECTED_LIST_ITEMS";

export const Playlist = () => {
  const [open] = usegs(PLAYLIST_OPEN);
  const [items, setItems] = usegs(PLAYLIST_ITEMS);
  const [videos] = usegs(VIDEOS);
  const [sequences] = usegs(SEQUENCES);
  const [playlists] = usegs(PLAYLISTS);
  const [selectedItems, setSelectedItems] = usegs(SELECTED_LIST_ITEMS, []);
  const [activePlaylist, setActivePlaylist] = usegs(ACTIVE_PLAYLIST);
  const [search, setSearch] = useState("");

  const playlist = useMemo(() => {
    return playlists.find((p) => p.id === activePlaylist);
  }, [activePlaylist, playlists]);

  useEffect(() => {
    // In case a playlist is set
    // Load all videos and sequences from that playlist into the list
    if (playlist) {
      const pItems = playlist.items.map((i) => {
        const [type, id] = i.split(":");
        const item = (type === DIRECTORY_TYPES.VIDEO ? videos : sequences).find(
          (i) => i.id === id
        );
        return { type, ...item };
      });
      setItems(pItems);
      setSelectedItems([]);
    }
  }, [playlist, sequences, videos, setItems, setSelectedItems]);

  const filteredItems = useMemo(() => {
    return items.filter(
      (i) =>
        i.type !== DIRECTORY_TYPES.PLAYLIST &&
        i.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const addSequences = useCallback(
    (ids) => {
      const sortedSequences = ggs(DIRECTORY_SORTED_SEQUENCES);
      const newSeqs = sortedSequences
        .filter((s) => ids.includes(s.id))
        .filter((s) => !items.find((i) => i.id === s.id));
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
    },
    [
      sequences,
      items,
      activePlaylist,
      playlist,
      selectedItems,
      setSelectedItems
    ]
  );

  const addVideos = useCallback(
    (ids) => {
      const newVids = videos
        .filter((v) => ids.includes(v.id))
        .filter((v) => !items.find((i) => i.id === v.id));
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
    },
    [videos, items, activePlaylist, playlist, selectedItems, setSelectedItems]
  );

  const addPlaylists = useCallback(
    (ids) => {
      const listItems = playlists
        .filter((p) => ids.includes(p.id))
        .reduce(
          (prev, curr) => Array.from(new Set([...prev, ...curr.items])),
          []
        );

      const newItems = listItems
        .filter((i) => {
          const [type, id] = i.split(":");
          return !items.find((v) => v.type === type && v.id === id);
        })
        .map((i) => {
          const [type, id] = i.split(":");
          return (type === DIRECTORY_TYPES.VIDEO ? videos : sequences).find(
            (i) => i.id === id
          );
        });

      const itemsToAdd = Array.from(new Set([...items, ...newItems]));

      if (activePlaylist && (ids.length > 1 || ids[0] !== activePlaylist)) {
        setActivePlaylist();
        setSelectedItems(itemsToAdd.map((i) => i.id));
      }
      setItems(itemsToAdd);
    },
    [
      playlists,
      items,
      setItems,
      activePlaylist,
      setActivePlaylist,
      playlist,
      selectedItems,
      setSelectedItems
    ]
  );

  const addVideoToPlaylist = useCallback(
    (ids) => {
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
    },
    [items, videos, playlist]
  );

  const addSequenceToPlaylist = useCallback(
    (ids) => {
      const sequenceIds = items
        .filter((i) => i.type === DIRECTORY_TYPES.SEQUENCE)
        .map((i) => i.id);
      const sortedSequences = ggs(DIRECTORY_SORTED_SEQUENCES);
      const newSequences = sortedSequences
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
    },
    [items, sequences, playlist]
  );

  const addPlaylistsToPlaylist = useCallback(
    (ids) => {
      const draggedPlaylists = playlists.filter((p) => ids.includes(p.id));
      const draggedItemIds = draggedPlaylists.reduce((prev, curr) => {
        return Array.from(new Set([...prev, ...curr.items]));
      }, []);
      const newDraggedItemIds = Array.from(
        new Set([...playlist.items, ...draggedItemIds])
      );
      if (newDraggedItemIds.length > playlist.items.length) {
        patchPlaylist({
          ...playlist,
          items: newDraggedItemIds
        });
      } else {
        console.log("No New Items to add");
      }
    },
    [playlists, playlist]
  );

  const handleDrop = useCallback(
    (e) => {
      const { ids, type } = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (playlist) {
        if (type === DIRECTORY_TYPES.VIDEO) {
          addVideoToPlaylist(ids);
        } else if (type === DIRECTORY_TYPES.SEQUENCE) {
          addSequenceToPlaylist(ids);
        } else if (type === DIRECTORY_TYPES.PLAYLIST) {
          addPlaylistsToPlaylist(ids);
        }
      } else {
        if (type === DIRECTORY_TYPES.VIDEO) {
          addVideos(ids);
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
    },
    [
      addVideoToPlaylist,
      addSequenceToPlaylist,
      addPlaylistsToPlaylist,
      addVideos,
      addSequences,
      setActivePlaylist,
      addPlaylists
    ]
  );

  const arrangeItems = useCallback(
    (arrangedItems) => {
      if (playlist) {
        patchPlaylist({
          ...playlist,
          items: itemsToPlaylistItems(arrangedItems)
        });
      } else {
        setItems(arrangedItems);
      }
    },
    [playlist]
  );

  const handleClose = useCallback(() => {
    setActivePlaylist();
    sgs(PLAYER_ITEM, undefined);
    setItems([]);
  }, [setActivePlaylist, setItems]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`playlist ${open ? "open" : ""} grid grid-tr-1m`}
    >
      <div className="playlist_header stretched-grid overflow-h grid-tr-m1">
        <div className="stretched-grid bg-white">
          <h4 className="aligned-grid grid-tc-m1m gap-m pd-05">
            <i className="material-icons">queue_music</i>
            {!playlist ? "Playlist" : playlist.label}
            {items.length !== 0 && (
              <i onClick={handleClose} className="material-icons">
                close
              </i>
            )}
          </h4>
          {items.length !== 0 && (
            <div className="stretched-grid">
              <input
                type="text"
                placeholder="Search Playlist..."
                value={search}
                onChange={({ target: { value } }) => setSearch(value)}
              />
            </div>
          )}
        </div>
        <ListList
          items={items}
          selectedItems={selectedItems}
          filteredItems={filteredItems}
          setSelectedItems={setSelectedItems}
          arrangeItems={arrangeItems}
        />
      </div>

      <div className="playlist_controls grid gap-xs z1">
        {items.length !== 0 && (
          <>
            {selectedItems.length !== 0 && (
              <ListSelection
                activePlaylist={activePlaylist}
                items={items}
                setItems={setItems}
                selectedItems={selectedItems}
                playlist={playlist}
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
