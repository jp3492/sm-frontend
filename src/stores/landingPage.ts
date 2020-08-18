import { request } from "./../utils/request";
import { sgs } from "./../utils/rxGlobal";
export const FEATURED_PLAYLISTS = "FEATURED_PLAYLISTS";

sgs(FEATURED_PLAYLISTS, []);

export const getFeaturedPlaylists = async () => {
  try {
    const res = await request("landingPage", "/featured");
    const data = await res.json();
    sgs(FEATURED_PLAYLISTS, data);
  } catch (error) {
    console.log(error);
  }
};
