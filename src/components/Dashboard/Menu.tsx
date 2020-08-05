import React from "react";
import "./Menu.scss";

import { DIRECTORY_TYPES, FOLDERS } from "../../stores/folder";
import { MenuItem } from "./MenuItem";
import { usegs } from "../../utils/rxGlobal";

export const MENU_OPEN = "MENU_OPEN";

export const Menu = () => {
  const [folders] = usegs(FOLDERS);
  const [menuOpen] = usegs(MENU_OPEN, true);

  return (
    <div
      className={`menu ${
        menuOpen ? "open" : ""
      } overflow-h bg-grey-light gap-s grid`}
    >
      <h3 className="aligned-grid pd-005">Directory</h3>
      <MenuItem directory={DIRECTORY_TYPES.PLAYLIST} folders={folders} />
      <MenuItem directory={DIRECTORY_TYPES.VIDEO} folders={folders} />
      <MenuItem directory={DIRECTORY_TYPES.SEQUENCE} folders={folders} />
    </div>
  );
};
