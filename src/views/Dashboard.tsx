import React, { useEffect } from "react";
import "./Dashboard.scss";

import { Header } from "../components/Dashboard/DashboardHeader";
import { Menu } from "../components/Dashboard/Menu";
import { Directory } from "../components/Dashboard/Directory";
import { Playlist } from "../components/Dashboard/List";
import { getFolders } from "../stores/folder";
import { getVideos } from "../stores/videos";
import { getPlaylists } from "../stores/playlists";
import { Hint } from "../components/Hint";
import { getSequences } from "../stores/sequences";
import { sgs, usegs } from "../utils/rxGlobal";
import { getProfile } from "../stores/profile";

export const INITIALIZED = "INITIALIZED";

const getUserData: any = async () => {
  await Promise.all([
    getFolders(),
    getVideos(),
    getPlaylists(),
    getSequences()
  ]);
  sgs(INITIALIZED, true);
};

const Dashboard = ({ history: { push } }) => {
  const [initialized] = usegs(INITIALIZED, false);

  useEffect(() => {
    getUserData();
    getProfile();
  }, []);

  return initialized ? (
    <div
      className={`dashboard grid grid-tr-m1 grid-tc-m1m gap-s overflow-h cl-content-sec`}
    >
      <Header push={push} />
      <Menu />
      <Directory />
      <Playlist />
      <Hint />
    </div>
  ) : (
    <div className="dashboard-loading centered-grid || cl-content-sec">
      <b>Loading User Data...</b>
    </div>
  );
};

export default Dashboard;
