import { VIDEOS } from "./videos";
import { showHint } from "./../components/Hint";
import { request } from "../utils/request";
import { setGlobalState, getGlobalState } from "react-global-state-hook";

export const PLAYLISTS = "PLAYLISTS";
export const PLAYLIST_OPEN = "PLAYLIST_OPEN";
export const ACTIVE_PLAYLIST = "ACTIVE_PLAYLIST";

setGlobalState(PLAYLISTS, []);
setGlobalState(PLAYLIST_OPEN, true);
setGlobalState(ACTIVE_PLAYLIST, null);

export const movePlaylists = async ({ folderId, ids, type }) => {
  try {
    await request("playlists", `/moveTo/${folderId || "root"}`, {
      method: "POST",
      body: JSON.stringify({ ids, type })
    });
    const playlists = getGlobalState(PLAYLISTS);
    setGlobalState(
      PLAYLISTS,
      playlists.map(({ folder, ...p }) => {
        if (ids.includes(p.id)) {
          const addFolder = folderId === "root" ? {} : { folder: folderId };
          return {
            ...p,
            ...addFolder
          };
        } else {
          return { ...p, folder };
        }
      })
    );
    showHint(`Successfully moved playlists.`);
  } catch (error) {
    console.log(error);
  }
};

// this is only used
export const getPlaylist = async (id) => {
  try {
    const res = await request("playlists", "/" + id);
    const data = await res.json();
    // playlist should either exist because when the user loads the app it gets all users objects
    // otherwise the user is directly put to the sequencer and the certain object needs to be fetched and added to store
    setGlobalState(VIDEOS, data.videos);
    setGlobalState(PLAYLISTS, [data.playlist]);
  } catch (error) {
    console.log(error);
  }
};

export const getPlaylists = async () => {
  try {
    const res = await request("playlists");
    const data = await res.json();
    setGlobalState(PLAYLISTS, data);
  } catch (error) {
    console.log(error);
  }
};

export const postPlaylist = async (values) => {
  try {
    const res = await request("playlists", "", {
      method: "POST",
      body: JSON.stringify(values)
    });
    const id = await res.text();
    const playlists = getGlobalState(PLAYLISTS);
    setGlobalState(PLAYLISTS, [...playlists, { id, ...values }]);
    setGlobalState(ACTIVE_PLAYLIST, id);
    showHint(`Created new playlist "${values.label}".`);
  } catch (error) {
    console.log(error);
  }
};

export const patchPlaylist = async ({ id, ...values }) => {
  try {
    await request("playlists", "/" + id, {
      method: "PATCH",
      body: JSON.stringify(values)
    });
    const playlists = getGlobalState(PLAYLISTS);
    setGlobalState(
      PLAYLISTS,
      playlists.map((v) => (v.id === id ? { id, ...values } : v))
    );
    showHint(`Playlist "${values.label}" updated successfully.`);
  } catch (error) {
    console.log(error);
  }
};

export const deletePlaylist = async (id) => {
  try {
    await request("playlists", "/" + id, { method: "DELETE" });
    const playlists = getGlobalState(PLAYLISTS);
    setGlobalState(
      PLAYLISTS,
      playlists.filter((f) => f.id !== id)
    );
    showHint(`Playlist deleted successfully.`);
  } catch (error) {
    console.log(error);
  }
};
