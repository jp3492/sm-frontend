import { PROFILE } from "./profile";
import { sgs, ugs, ggs } from "./../utils/rxGlobal";
import { request } from "./../utils/request";

export const deleteComment = async (id, stateId) => {
  try {
    await request("viewer", `/comment/${id}`, { method: "DELETE" });
    ugs(stateId, (comments) => comments.filter((c) => c.id !== id));
  } catch (error) {
    console.log(error);
  }
};

export const getComments = async ({ targetType, targetId, playlistId }) => {
  try {
    const path = playlistId
      ? `/comment/${targetType}/${targetId}/${playlistId}`
      : `/comment/${targetType}/${targetId}`;
    const res = await request("viewer", path);
    const { comments } = await res.json();
    const stateId = `COMMENTS_${targetId}`;
    sgs(stateId, comments);
  } catch (error) {
    console.log(error);
  }
};

export const postComment = async ({
  targetType,
  targetId,
  playlistId,
  content
}) => {
  try {
    const path = playlistId
      ? `/comment/${targetType}/${targetId}/${playlistId}`
      : `/comment/${targetType}/${targetId}`;
    const res = await request("viewer", path, {
      method: "POST",
      body: JSON.stringify({
        content
      })
    });
    const id = await res.text();
    const stateId = `COMMENTS_${targetId}`;
    ugs(stateId, (comments) => [
      {
        targetType,
        targetId,
        playlistId,
        content,
        id,
        timestamp: Date.now(),
        userName: ggs(PROFILE).name
      },
      ...comments
    ]);
  } catch (error) {
    console.log(error);
  }
};
