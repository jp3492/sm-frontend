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
import { DirectoryPlaylist } from "./DirectoryPlaylist";
import { DirectoryVideo } from "./DirectoryVideo";
// import { SEQUENCER_VIDEOS } from "../../stores/projects";
import { DirectorySequence } from "./DirectorySequence";
import { SEQUENCES } from "../../stores/sequences";

const onDragOver = (e) => {
  e.stopPropagation();
  e.preventDefault();
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

  // const hanleSequencer = (e) => {
  //   const id = e.target.closest("li").id;
  //   if (selectedDirectory === DIRECTORY_TYPES.VIDEO) {
  //     const video = videos.find((f) => f.id === id);
  //     setGlobalState(SEQUENCER_VIDEOS, [id]);
  //   } else if (selectedDirectory === DIRECTORY_TYPES.PLAYLIST) {
  //     const playlist = playlists.find((p) => p.id === id);
  //     setGlobalState(MODAL, {
  //       component: "playlist",
  //       props: playlist
  //     });
  //   } else {
  //   }
  // };

  const handleAdd = () => {
    setGlobalState(MODAL, {
      component: "folder",
      props: {
        directory: selectedDirectory,
        folder: selectedFolder
      }
    });
  };

  return (
    <div className="directory">
      <Path />
      <button onClick={handleAdd}>
        <i className="material-icons">add</i>
        Folder
      </button>
      <ul className="directory_items">
        {items.map((item, index) => {
          if (selectedDirectory === DIRECTORY_TYPES.PLAYLIST) {
            const selected = selectedPlaylists.includes(item.id);
            return (
              <DirectoryPlaylist
                key={index}
                {...item}
                handleSelect={handleSelect}
                handleEdit={handleEdit}
                selected={selected}
                onDragOver={onDragOver}
                onDragStart={onDragStart}
                handleDrop={handleDrop}
              />
            );
          } else if (selectedDirectory === DIRECTORY_TYPES.VIDEO) {
            const selected = selectedVideos.includes(item.id);
            return (
              <DirectoryVideo
                key={index}
                {...item}
                handleSelect={handleSelect}
                handleEdit={handleEdit}
                selected={selected}
                onDragOver={onDragOver}
                onDragStart={onDragStart}
                handleDrop={handleDrop}
              />
            );
          } else if (selectedDirectory === DIRECTORY_TYPES.SEQUENCE) {
            const selected = selectedSequences.includes(item.id);
            return (
              <DirectorySequence
                key={index}
                {...item}
                handleSelect={handleSelect}
                handleEdit={handleEdit}
                selected={selected}
                onDragOver={onDragOver}
                onDragStart={onDragStart}
                handleDrop={handleDrop}
              />
            );
          } else {
            return null;
          }
        })}
      </ul>
    </div>
  );
};
