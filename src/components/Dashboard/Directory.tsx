import React, { useState, useMemo, useEffect } from "react";
import "./Directory.scss";
import { Path } from "./Path";
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
import { usegs, sgs } from "../../utils/rxGlobal";

export const DIRECTORY_SORTED_SEQUENCES = "DIRECTORY_SORTED_SEQUENCES";

sgs(DIRECTORY_SORTED_SEQUENCES, []);

const onDragOver = (e) => {
  e.stopPropagation();
  e.preventDefault();
};

export const handleShare = (type, id, label?) => {
  sgs(MODAL, {
    component: "share",
    props: { type, id, label }
  });
};

export const Directory = () => {
  const [videos] = usegs(VIDEOS);
  const [playlists] = usegs(PLAYLISTS);
  const [sequences] = usegs(SEQUENCES);

  const [selectedDirectory] = usegs(SELECTED_DIRECTORY);
  const [selectedFolder] = usegs(SELECTED_FOLDER);

  const [selectedPlaylists, setSelectedPlaylists]: any = useState([]);
  const [selectedVideos, setSelectedVideos]: any = useState([]);
  const [selectedSequences, setSelectedSequences]: any = useState([]);

  const [search, setSearch] = useState("");

  const [labelSort, setLabelSort] = useState({
    SEQUENCE: null,
    VIDEO: null,
    PLAYLIST: null
  });

  const [timeSort, setTimeSort] = useState("asc");

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
      sgs(MODAL, {
        component: "video",
        props: video
      });
    } else if (selectedDirectory === DIRECTORY_TYPES.PLAYLIST) {
      const playlist = playlists.find((p) => p.id === id);
      sgs(MODAL, {
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
    sgs(MODAL, {
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

  const handleTimeSort = () => setTimeSort(timeSort === "asc" ? "desc" : "asc");

  const sortedItems = useMemo(() => {
    let copy = [...items];
    const sort = labelSort[selectedDirectory];
    if (sort === "asc") {
      copy = copy.sort((a, b) => {
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
      copy = copy.sort((a, b) => {
        var nameA = a.label.toUpperCase(); // ignore upper and lowercase
        var nameB = b.label.toUpperCase(); // ignore upper and lowercase
        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }

        return 0;
      });
    }
    if (timeSort === "asc") {
      copy = copy.sort((a, b) => a.start - b.start);
    } else {
      copy = copy.sort((a, b) => b.start - a.start);
    }
    sgs(DIRECTORY_SORTED_SEQUENCES, copy);
    return copy;
  }, [labelSort, timeSort, items, selectedDirectory]);

  const onDragStart = (e) => {
    const type = DIRECTORY_TYPES[e.target.closest("li").classList[0]];
    const itemId = e.target.closest("li").id;
    const ids =
      type === DIRECTORY_TYPES.VIDEO
        ? [...selectedVideos, itemId]
        : type === DIRECTORY_TYPES.PLAYLIST
        ? [...selectedPlaylists, itemId]
        : [...selectedSequences, itemId];
    console.log(ids);
    console.log(sortedItems);

    const sortedIds = sortedItems
      .filter((item) => ids.includes(item.id))
      .map((item) => item.id);
    console.log(sortedIds);

    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ ids: sortedIds, type })
    );
    // Now this will break every drop event
  };

  const searchedItems = useMemo(() => {
    if (!search) {
      return sortedItems;
    } else {
      return sortedItems.filter((i) =>
        i.label.toLowerCase().includes(search.toLowerCase())
      );
    }
  }, [sortedItems, search]);

  const handleSelectAll = () => {
    const [targetSelection, setSelection] =
      selectedDirectory === DIRECTORY_TYPES.PLAYLIST
        ? [selectedPlaylists, setSelectedPlaylists]
        : selectedDirectory === DIRECTORY_TYPES.VIDEO
        ? [selectedVideos, setSelectedVideos]
        : [selectedSequences, setSelectedSequences];

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
      <div className="directory_header aligned-grid grid-tc-mm1m cgap-m rgap-s bg-grey-light">
        <button className="aligned-grid pd-01" onClick={handleAdd}>
          <i className="material-icons">add</i>
          Folder
        </button>
        <div className="grid aligned-grid grid-af-c cgap-m pd-01">
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
          {selectedDirectory === DIRECTORY_TYPES.SEQUENCE && (
            <span className="grid gap-s" onClick={handleTimeSort}>
              Time
              <i className="material-icons">
                {timeSort === "asc" ? "expand_less" : "expand_more"}
              </i>
            </span>
          )}
        </div>
        <div>
          <input
            type="text"
            value={search}
            onChange={({ target: { value } }) => setSearch(value)}
            placeholder="Search files.."
          />
        </div>
        <div className="grid grid-tc-mm gap-m">
          <label>Select all:</label>
          <i className="material-icons" onClick={handleSelectAll}>
            {allSelected ? "check_box" : "check_box_outline_blank"}
          </i>
        </div>
      </div>
      <ul className="directory_items grid gap-xs">
        {searchedItems.length === 0 ? (
          <li className="no-item">No item in directory.</li>
        ) : (
          searchedItems.map((item, index) => {
            const selected = (selectedDirectory === DIRECTORY_TYPES.PLAYLIST
              ? selectedPlaylists
              : selectedDirectory === DIRECTORY_TYPES.VIDEO
              ? selectedVideos
              : selectedSequences
            ).includes(item.id);

            return (
              <DirectoryItem
                key={index}
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
          })
        )}
      </ul>
    </div>
  );
};
