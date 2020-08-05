import { sgs, ugs } from './../utils/rxGlobal';
import { showHint } from "./../components/Hint";
import { SEQUENCES } from "./sequences";
import { request } from "./../utils/request";

export const VIDEOS = "VIDEOS";

sgs(VIDEOS, []);

export const moveVideos = async ({ folderId, ids, type }) => {
  try {
    await request("videos", `/moveTo/${folderId || "root"}`, {
      method: "POST",
      body: JSON.stringify({ ids, type })
    });
    ugs(VIDEOS, videos => videos.map(({ folder, ...p }) => {
      if (ids.includes(p.id)) {
        const addFolder = folderId === "root" ? {} : { folder: folderId };
        return {
          ...p,
          ...addFolder
        };
      } else {
        return { ...p, folder };
      }
    }));
    showHint("Successfully moved Videos.");
  } catch (error) {
    console.log(error);
  }
};

export const getVideo = async (id) => {
  try {
    const res = await request("videos", "/" + id);
    const data = await res.json();
    sgs(VIDEOS, [data.video]);
    sgs(SEQUENCES, data.sequences);
  } catch (error) {
    console.log(error);
  }
};

export const getVideos = async () => {
  try {
    const res = await request("videos");
    const data = await res.json();
    sgs(VIDEOS, data);
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
    ugs(VIDEOS, videos => ([...videos, { id, ...values }]));
    showHint(`Created new Video: "${values.label}".`);
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
    ugs(VIDEOS, videos => videos.map((v) => (v.id === id ? { id, ...v, ...values } : v)));
    showHint(`Videos "${values.label}" successfully updated.`);
  } catch (error) {
    console.log(error);
  }
};

export const deleteVideo = async (id) => {
  try {
    await request("videos", "/" + id, {
      method: "DELETE"
    });
    ugs(VIDEOS, videos => videos.filter((v) => v.id !== id));
    showHint("Video deleted successfully.");
  } catch (error) {
    console.log(error);
  }
};
