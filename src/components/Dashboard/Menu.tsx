import React from "react";
import "./Menu.scss";

import { useGlobalState } from "react-global-state-hook";
import { DIRECTORY_TYPES, FOLDERS } from "../../stores/folder";
import { MenuItem } from "./MenuItem";

export const MENU_OPEN = "MENU_OPEN";

export const Menu = () => {
  const [folders] = useGlobalState(FOLDERS);
  const [menuOpen] = useGlobalState(MENU_OPEN, true);

  return (
    <div className={`menu ${menuOpen ? "open" : ""}`}>
      <MenuItem directory={DIRECTORY_TYPES.PLAYLIST} folders={folders} />
      <MenuItem directory={DIRECTORY_TYPES.VIDEO} folders={folders} />
      <MenuItem directory={DIRECTORY_TYPES.SEQUENCE} folders={folders} />
    </div>
  );
};