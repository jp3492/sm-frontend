import { getFolder } from "./folder";
import { sgs, ggs, ugs } from "./../utils/rxGlobal";

import { request } from "../utils/request";

export const SEQUENCES = "SEQUENCES";
export const FILTERED_SEQUENCES = "FILTERED_SEQUENCES";
export const SELECTED_SEQUENCES = "SELECTED_SEQUENCES";
export const SEQUENCER_TARGET = "SEQUENCER_TARGET";
export const EDITING_SEQUENCE = "EDITING_SEQUENCE";

sgs(SEQUENCES, []);
sgs(FILTERED_SEQUENCES, []);
sgs(SELECTED_SEQUENCES, []);
sgs(SEQUENCER_TARGET, null);
sgs(EDITING_SEQUENCE, null);

export const moveSequences = async ({ folderId, ids, type }) => {
  try {
    await request("sequences", `/moveTo/${folderId || "root"}`, {
      method: "POST",
      body: JSON.stringify({ ids, type })
    });
    ugs(SEQUENCES, (sequences) =>
      sequences.map(({ folder, ...p }) => {
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

export const getSequences = async () => {
  try {
    const res = await request("sequences");
    const data = await res.json();
    sgs(SEQUENCES, data);
  } catch (error) {
    console.log(error);
  }
};

export const postSequence = async (body) => {
  try {
    ugs(SEQUENCES, (sequences) => [...sequences, body]);
    const res = await request("sequences", "", {
      method: "POST",
      body: JSON.stringify({
        ...body,
        start: Number(body.start),
        stop: Number(body.stop)
      })
    });
    const { sequenceId, newFolderId } = await res.json();
    if (newFolderId) {
      await getFolder(newFolderId);
    }
    ugs(SEQUENCES, (sequences) =>
      sequences.map((i) => {
        if (!i.id && JSON.stringify(i) === JSON.stringify(body)) {
          // folderId still needs to be added
          // the reason it shows up in the dashboard is because it makes a request to all sequences
          // is better to check the getAll methods in Dashboard
          return { ...i, id: sequenceId };
        }
        return i;
      })
    );
  } catch (error) {
    console.log(error);
  }
};

export const patchSequence = async ({ id, ...body }) => {
  try {
    await request("sequences", "/" + id, {
      method: "PATCH",
      body: JSON.stringify(body)
    });
    ugs(SEQUENCES, (sequences) =>
      sequences.map((s) => (s.id === id ? { ...body, id } : s))
    );
  } catch (error) {
    console.log(error);
  }
};

export const deleteSequences = async (targetId) => {
  try {
    const sequences = ggs(SEQUENCES);
    sgs(
      SEQUENCES,
      sequences.map(({ id, ...sequence }) => {
        if (id === targetId) {
          return sequence;
        }
        return { id, ...sequence };
      })
    );
    const { id: sequenceId, ...body } = sequences.find(
      (s) => s.id === targetId
    );
    const res = await request("sequences", "/" + targetId, {
      method: "DELETE"
    });
    if (res.status != 403) {
      ugs(SEQUENCES, (sequences) =>
        sequences.filter(
          (f) => f.id && JSON.stringify(f) !== JSON.stringify(body)
        )
      );
    } else {
      alert(
        "Sequences not deletable. At least one sequence is existing in at least one of your Playlist"
      );
    }
  } catch (error) {
    console.log(error);
  }
};
