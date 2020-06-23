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

export const Dashboard = () => {
  useEffect(() => {
    getFolders();
    getVideos();
    getPlaylists();
    getSequences();
  }, []);
  return (
    <div className="dashboard">
      <Header />
      <Menu />
      <Directory />
      <Playlist />
      <Hint />
    </div>
  );
};
