import { sgs, ugs } from "./../utils/rxGlobal";
import { request } from "./../utils/request";

export const getComments = async ({ type, typeId, targetType, targetId }) => {
  try {
    const path =
      type === "playlist"
        ? `/comment/${type}/${typeId}/${targetType.toLowerCase()}/${targetId}`
        : `/comment/${type}/${typeId}`;
    const res = await request("viewer", path);
    const data = await res.json();
    const stateId = `COMMENTS_${type === "playlist" ? targetId : typeId}`;
    sgs(stateId, data);
  } catch (error) {
    console.log(error);
  }
};

export const postComment = async ({
  type,
  typeId,
  targetType,
  targetId,
  content
}) => {
  try {
    const path =
      type === "playlist"
        ? `/comment/${type}/${typeId}/${targetType}/${targetId}`
        : `/comment/${type}/${typeId}`;
    const res = await request("viewer", path, {
      method: "POST",
      body: JSON.stringify({
        content
      })
    });
    const id = await res.text();
    const stateId = `COMMENTS_${type === "playlist" ? targetId : typeId}`;
    ugs(stateId, (comments) => [
      { type, typeId, targetType, targetId, content, id },
      ...comments
    ]);
  } catch (error) {
    console.log(error);
  }
};
