import { SEQUENCES } from "./sequences";
import { request } from "./../utils/request";
import { setGlobalState, getGlobalState } from "react-global-state-hook";

export const VIDEOS = "VIDEOS";

setGlobalState(VIDEOS, []);

export const moveVideos = async ({ folderId, ids, type }) => {
  try {
    await request("videos", `/moveTo/${folderId || "root"}`, {
      method: "POST",
      body: JSON.stringify({ ids, type })
    });
    const videos = getGlobalState(VIDEOS);
    setGlobalState(
      VIDEOS,
      videos.map(({ folder, ...p }) => {
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
  } catch (error) {
    console.log(error);
  }
};

export const getVideo = async (id) => {
  try {
    const res = await request("videos", "/" + id);
    const data = await res.json();

    setGlobalState(VIDEOS, [data.video]);
    setGlobalState(SEQUENCES, data.sequences);
  } catch (error) {
    console.log(error);
  }
};

export const getVideos = async () => {
  try {
    const res = await request("videos");
    const data = await res.json();
    setGlobalState(VIDEOS, data);
  } catch (error) {
    console.log(error);
  }
};

export const postVideo = async (values) => {
  try {
    const res = await request("videos", "", {
      method: "POST",
      body: JSON.stringify(values)
    });
    const id = await res.text();
    const videos = getGlobalState(VIDEOS);
    setGlobalState(VIDEOS, [...videos, { id, ...values }]);
  } catch (error) {
    console.log(error);
  }
};

export const patchVideo = async ({ id, ...values }) => {
  try {
    await request("videos", "/" + id, {
      method: "PATCH",
      body: JSON.stringify(values)
    });
    const videos = getGlobalState(VIDEOS);
    setGlobalState(
      VIDEOS,
      videos.map((v) => (v.id === id ? { id, ...values } : v))
    );
  } catch (error) {
    console.log(error);
  }
};

export const deleteVideo = async (id) => {
  try {
    await request("videos", "/" + id, {
      method: "DELETE"
    });
    const videos = getGlobalState(VIDEOS);
    setGlobalState(
      VIDEOS,
      videos.filter((v) => v.id !== id)
    );
  } catch (error) {
    console.log(error);
  }
};
