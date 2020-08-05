import React, { useMemo } from "react";
import { usegs } from "../../utils/rxGlobal";

export const MenuFolderCount = ({
  type,
  folderId
}: {
  type: string;
  folderId?: string;
}) => {
  // need to change this when updating to rx-global
  const [items] = usegs(`${type}S`);

  const count = useMemo(
    () =>
      items.filter((i) => (folderId ? i.folder === folderId : !i.folder))
        .length,
    [items, folderId]
  );

  return <small>({count})</small>;
};
