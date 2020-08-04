import { setGlobalState } from "react-global-state-hook";
import { getGlobalState } from "react-global-state-hook";
import { request } from "../utils/request";

export const SEQUENCES = "SEQUENCES";
export const FILTERED_SEQUENCES = "FILTERED_SEQUENCES";
export const SELECTED_SEQUENCES = "SELECTED_SEQUENCES";
export const SEQUENCER_TARGET = "SEQUENCER_TARGET";
export const EDITING_SEQUENCE = "EDITING_SEQUENCE";

setGlobalState(SEQUENCES, []);
setGlobalState(FILTERED_SEQUENCES, []);
setGlobalState(SELECTED_SEQUENCES, []);
setGlobalState(SEQUENCER_TARGET, null);
setGlobalState(EDITING_SEQUENCE, null);

export const moveSequences = async ({ folderId, ids, type }) => {
  try {
    await request("sequences", `/moveTo/${folderId || "root"}`, {
      method: "POST",
      body: JSON.stringify({ ids, type })
    });
    const sequences = getGlobalState(SEQUENCES);
    setGlobalState(
      SEQUENCES,
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
    setGlobalState(SEQUENCES, data);
  } catch (error) {
    console.log(error);
  }
};

export const postSequence = async (body) => {
  try {
    let sequences = getGlobalState(SEQUENCES);
    setGlobalState(SEQUENCES, [...sequences, body]);
    const res = await request("sequences", "", {
      method: "POST",
      body: JSON.stringify({
        ...body,
        start: Number(body.start),
        stop: Number(body.stop)
      })
    });
    const id = await res.text();
    sequences = getGlobalState(SEQUENCES);
    setGlobalState(
      SEQUENCES,
      sequences.map((i) => {
        if (!i.id && JSON.stringify(i) === JSON.stringify(body)) {
          return { ...i, id };
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
    const sequences = getGlobalState(SEQUENCES);
    setGlobalState(
      SEQUENCES,
      sequences.map((s) => (s.id === id ? { ...body, id } : s))
    );
  } catch (error) {
    console.log(error);
  }
};

export const deleteSequences = async (targetId) => {
  try {
    const sequences = getGlobalState(SEQUENCES);
    setGlobalState(
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
      const folders = getGlobalState(SEQUENCES);
      setGlobalState(
        SEQUENCES,
        folders.filter(
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
