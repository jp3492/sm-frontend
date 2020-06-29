import React, { useState, useMemo } from "react";
import "./Directory.scss";
import { Path } from "./Path";
import { useGlobalState, setGlobalState } from "react-global-state-hook";
import { VIDEOS } from "../../stores/videos";
import {
  SELECTED_DIRECTORY,
  SELECTED_FOLDER,
  DIRECTORY_TYPES
} from "../../stores/folder";
import { PLAYLISTS, patchPlaylist } from "../../stores/playlists";
import { MODAL } from "../Modal";
import { SEQUENCES } from "../../stores/sequences";
import { DirectoryItem } from "./DirectoryItem";

const onDragOver = (e) => {
  e.stopPropagation();
  e.preventDefault();
};

export const handleShare = (type, id) => {
  setGlobalState(MODAL, {
    component: "share",
    props: { type, id }
  });
};

export const Directory = () => {
  const [videos] = useGlobalState(VIDEOS);
  const [playlists] = useGlobalState(PLAYLISTS);
  const [sequences] = useGlobalState(SEQUENCES);

  const [selectedDirectory] = useGlobalState(SELECTED_DIRECTORY);
  const [selectedFolder] = useGlobalState(SELECTED_FOLDER);

  const [selectedPlaylists, setSelectedPlaylists]: any = useState([]);
  const [selectedVideos, setSelectedVideos]: any = useState([]);
  const [selectedSequences, setSelectedSequences]: any = useState([]);

  const [labelSort, setLabelSort] = useState({
    SEQUENCE: null,
    VIDEO: null,
    PLAYLIST: null
  });

  const items = useMemo(() => {
    if (selectedDirectory === DIRECTORY_TYPES.VIDEO) {
      return videos.filter((v) =>
        !selectedFolder ? !v.folder : v.folder === selectedFolder
      );
    } else if (selectedDirectory === DIRECTORY_TYPES.SEQUENCE) {
      return sequences.filter((s) =>
        !selectedFolder ? !s.folder : s.folder === selectedFolder
      );
    } else {
      return playlists.filter((p) =>
        !selectedFolder ? !p.folder : p.folder === selectedFolder
      );
    }
  }, [selectedDirectory, videos, playlists, selectedFolder, sequences]);

  const onDragStart = (e) => {
    const type = DIRECTORY_TYPES[e.target.closest("li").classList[0]];
    const itemId = e.target.closest("li").id;
    const ids =
      type === DIRECTORY_TYPES.VIDEO
        ? [...selectedVideos, itemId]
        : type === DIRECTORY_TYPES.PLAYLIST
        ? [...selectedPlaylists, itemId]
        : [...selectedSequences, itemId];

    e.dataTransfer.setData("text/plain", JSON.stringify({ ids, type }));
    // Now this will break every drop event
  };

  const handleDrop = (e) => {
    const id = e.target.closest("li").id;
    const { ids, type } = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (type === "list") {
      const playlist = playlists.find((p) => p.id === id);
      const urls = videos.filter((v) => ids.includes(v.id)).map((v) => v.url);
      // @ts-ignore
      const newUrls = [...new Set([...playlist.urls, ...urls])];
      patchPlaylist({ ...playlist, urls: newUrls });
    }
  };

  const handleSelect = (e) => {
    const id = e.target.closest("li").id;
    if (selectedDirectory === DIRECTORY_TYPES.VIDEO) {
      if (selectedVideos.includes(id)) {
        setSelectedVideos(selectedVideos.filter((v) => v !== id));
      } else {
        setSelectedVideos([...selectedVideos, id]);
      }
    } else if (selectedDirectory === DIRECTORY_TYPES.PLAYLIST) {
      if (selectedPlaylists.includes(id)) {
        setSelectedPlaylists(selectedPlaylists.filter((p) => p !== id));
      } else {
        setSelectedPlaylists([...selectedPlaylists, id]);
      }
    } else if (selectedDirectory === DIRECTORY_TYPES.SEQUENCE) {
      if (selectedSequences.includes(id)) {
        setSelectedSequences(selectedSequences.filter((s) => s !== id));
      } else {
        setSelectedSequences([...selectedSequences, id]);
      }
    }
  };

  const handleEdit = (e) => {
    const id = e.target.closest("li").id;
    if (selectedDirectory === DIRECTORY_TYPES.VIDEO) {
      const video = videos.find((f) => f.id === id);
      setGlobalState(MODAL, {
        component: "video",
        props: video
      });
    } else if (selectedDirectory === DIRECTORY_TYPES.PLAYLIST) {
      const playlist = playlists.find((p) => p.id === id);
      setGlobalState(MODAL, {
        component: "playlist",
        props: playlist
      });
    } else if (selectedDirectory === DIRECTORY_TYPES.SEQUENCE) {
      alert(
        "Sequences cant be edited. Open the corresponding video or project in the sequencer and edit sequence there"
      );
    }
  };

  const handleAdd = () => {
    setGlobalState(MODAL, {
      component: "folder",
      props: {
        directory: selectedDirectory,
        folder: selectedFolder
      }
    });
  };

  const handleSort = () => {
    const sort = labelSort[selectedDirectory];
    const to = !sort ? "asc" : sort === "asc" ? "desc" : null;
    setLabelSort({
      ...labelSort,
      [selectedDirectory]: to
    });
  };

  const sortedItems = useMemo(() => {
    const copy = [...items];
    const sort = labelSort[selectedDirectory];
    if (!sort) {
      return copy;
    } else if (sort === "asc") {
      return copy.sort((a, b) => {
        var nameA = a.label.toUpperCase(); // ignore upper and lowercase
        var nameB = b.label.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
    } else {
      return copy.sort((a, b) => {
        var nameA = a.label.toUpperCase(); // ignore upper and lowercase
        var nameB = b.label.toUpperCase(); // ignore upper and lowercase
        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
    }
  }, [labelSort, items, selectedDirectory]);

  const handleSelectAll = () => {
    const [targetSelection, setSelection] =
      selectedDirectory === DIRECTORY_TYPES.PLAYLIST
        ? [selectedPlaylists, setSelectedPlaylists]
        : selectedDirectory === DIRECTORY_TYPES.VIDEO
        ? [selectedVideos, setSelectedVideos]
        : [selectedSequences, setSelectedSequences];
    console.log({ targetSelection, setSelection });

    const localSelection = targetSelection.filter((id) =>
      items.find((i) => i.id === id)
    );
    if (localSelection.length !== items.length) {
      setSelection(
        Array.from(new Set([...targetSelection, ...items.map((i) => i.id)]))
      );
    } else {
      setSelection(
        targetSelection.filter((id) => !localSelection.includes(id))
      );
    }
  };

  const allSelected = useMemo(() => {
    if (items.length === 0) {
      return false;
    }
    const targetSelection =
      selectedDirectory === DIRECTORY_TYPES.PLAYLIST
        ? selectedPlaylists
        : selectedDirectory === DIRECTORY_TYPES.VIDEO
        ? selectedVideos
        : selectedSequences;

    const localSelection = targetSelection.filter((id) =>
      items.find((i) => i.id === id)
    );
    return localSelection.length === items.length;
  }, [
    items,
    selectedDirectory,
    selectedPlaylists,
    selectedVideos,
    selectedSequences
  ]);

  return (
    <div className="directory grid gap-s overflow-a grid-tr-mm1 bg-grey-light">
      <Path />
      <div className="directory_header aligned-grid grid-tc-m1m gap-m bg-grey-light">
        <button className="aligned-grid pd-01" onClick={handleAdd}>
          <i className="material-icons">add</i>
          Folder
        </button>
        <div className="grid gap-m">
          <label>Sort by:</label>
          <span className="grid gap-s" onClick={handleSort}>
            Label
            <i className="material-icons">
              {!labelSort[selectedDirectory]
                ? "unfold_more"
                : labelSort[selectedDirectory] === "desc"
                ? "expand_less"
                : "expand_more"}
            </i>
          </span>
        </div>
        <div className="grid gap-m">
          <label>Select all:</label>
          <i className="material-icons" onClick={handleSelectAll}>
            {allSelected ? "check_box" : "check_box_outline_blank"}
          </i>
        </div>
      </div>
      <ul className="directory_items grid gap-xs">
        {sortedItems.map((item, index) => {
          const selected = (selectedDirectory === DIRECTORY_TYPES.PLAYLIST
            ? selectedPlaylists
            : selectedDirectory === DIRECTORY_TYPES.VIDEO
            ? selectedVideos
            : selectedSequences
          ).includes(item.id);

          return (
            <DirectoryItem
              key={item.id}
              {...item}
              type={selectedDirectory}
              handleSelect={handleSelect}
              handleEdit={handleEdit}
              selected={selected}
              onDragOver={onDragOver}
              onDragStart={onDragStart}
              handleDrop={handleDrop}
              onShare={handleShare}
            />
          );
        })}
      </ul>
    </div>
  );
};
