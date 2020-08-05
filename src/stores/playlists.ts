import { sgs, ugs } from './../utils/rxGlobal';
import { VIDEOS } from "./videos";
import { showHint } from "./../components/Hint";
import { request } from "../utils/request";

export const PLAYLISTS = "PLAYLISTS";
export const PLAYLIST_OPEN = "PLAYLIST_OPEN";
export const ACTIVE_PLAYLIST = "ACTIVE_PLAYLIST";

sgs(PLAYLISTS, []);
sgs(PLAYLIST_OPEN, true);
sgs(ACTIVE_PLAYLIST, null);

export const movePlaylists = async ({ folderId, ids, type }) => {
  try {
    await request("playlists", `/moveTo/${folderId || "root"}`, {
      method: "POST",
      body: JSON.stringify({ ids, type })
    });
    ugs(PLAYLISTS, playlists => playlists.map(({ folder, ...p }) => {
      if (ids.includes(p.id)) {
        const addFolder = folderId === "root" ? {} : { folder: folderId };
        return {
          ...p,
          ...addFolder
        };
      }
      return { ...p, folder };
    }));
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
    sgs(VIDEOS, data.videos);
    sgs(PLAYLISTS, [data.playlist]);
  } catch (error) {
    console.log(error);
  }
};

export const getPlaylists = async () => {
  try {
    const res = await request("playlists");
    const data = await res.json();
    sgs(PLAYLISTS, data);
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
    ugs(PLAYLISTS, playlists => ([...playlists, { id, ...values }]));
    sgs(ACTIVE_PLAYLIST, id);
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
    ugs(PLAYLISTS, playlists => playlists.map((v) => (v.id === id ? { id, ...v, ...values } : v)))
    showHint(`Playlist "${values.label}" updated successfully.`);
  } catch (error) {
    console.log(error);
  }
};

export const deletePlaylist = async (id) => {
  try {
    await request("playlists", "/" + id, { method: "DELETE" });
    ugs(PLAYLISTS, playlists => playlists.filter((f) => f.id !== id));
    showHint(`Playlist deleted successfully.`);
  } catch (error) {
    console.log(error);
  }
};
