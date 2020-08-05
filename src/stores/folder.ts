import { request } from "../utils/request";
import { sgs, ugs } from "../utils/rxGlobal";

export const FOLDERS = "FOLDERS";
export const SELECTED_FOLDER = "SELECTED_FOLDER";
export const OPEN_FOLDERS = "OPEN_FOLDERS";

export const SELECTED_FOLDER_VIDEO = "SELECTED_FOLDER_VIDEO";
export const SELECTED_FOLDER_PLAYLIST = "SELECTED_FOLDER_PLAYLIST";
export const SELECTED_FOLDER_SEQUENCE = "SELECTED_FOLDER_SEQUENCE";

export const SELECTED_DIRECTORY = "SELECTED_DIRECTORY";
export const DIRECTORY_TYPES = {
  PLAYLIST: "PLAYLIST",
  VIDEO: "VIDEO",
  SEQUENCE: "SEQUENCE"
};

sgs(FOLDERS, []);
sgs(OPEN_FOLDERS, []);

sgs(SELECTED_DIRECTORY, DIRECTORY_TYPES.PLAYLIST);

export const getFolders: any = async () => {
  try {
    const res = await request("folders");
    const data = await res.json();
    sgs(FOLDERS, data);
  } catch (error) {
    console.log(error);
  }
};

export const postFolder = async (body) => {
  try {
    const res = await request("folders", "", {
      method: "POST",
      body: JSON.stringify(body)
    });
    const id = await res.text();
    // const folders = getGlobalState(FOLDERS);
    // setGlobalState(FOLDERS, [...folders, { ...body, id }]);
    ugs(FOLDERS, folders => ([...folders, { ...body, id }]));
  } catch (error) {
    console.log(error);
  }
};

export const patchFolder = async ({ id, ...body }) => {
  try {
    await request("folders", "/" + id, {
      method: "PATCH",
      body: JSON.stringify(body)
    });
    ugs(FOLDERS, folders => {
      let newFolder = { ...body, id, folder: body.folder };
      if (body.folder === "root") {
        delete newFolder.folder;
      }
      return folders.map(({ folder, ...f }) =>
        f.id === id ? { ...f, ...newFolder } : { ...f, folder }
      )
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteFolder = async (id) => {
  try {
    await request("folders", "/" + id, { method: "DELETE" });
    ugs(FOLDERS, folders => folders.filter((f) => f.id !== id));
  } catch (error) {
    console.log(error);
  }
};
