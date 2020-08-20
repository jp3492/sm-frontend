import { sgs } from "./../utils/rxGlobal";
import { request } from "./../utils/request";

export const PROFILE = "PROFILE";

export const patchProfile = async (values) => {
  try {
    await request("users", "/profile", {
      method: "PATCH",
      body: JSON.stringify(values)
    });
    sgs(PROFILE, values);
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async () => {
  try {
    const res = await request("users", "/profile");
    const data = await res.json();
    sgs(PROFILE, data);
  } catch (error) {
    console.log(error);
  }
};
