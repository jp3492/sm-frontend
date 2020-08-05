import React from "react";
import "./Hint.scss";
import { usegs, ugs } from "../utils/rxGlobal";

const HINTS = "HINTS";

export const showHint = (msg) => {
  ugs(HINTS, hints => ([...hints, msg]));
  setTimeout(() => {
    ugs(HINTS, hints => hints.filter((h) => h !== msg));
  }, 3000);
};

const closeHint = (e) => {
  const msg = e.target.closest("li").id;
  ugs(HINTS, hints => hints.filter((h) => h !== msg));
};

export const Hint = () => {
  const [hints] = usegs(HINTS, []);

  if (hints.length === 0) {
    return null;
  }

  return (
    <div className="hint">
      <ul className="grid">
        {hints.map((h) => (
          <li
            className="rounded shadow-m bg-grey-light aligned-grid pd-1311"
            id={h}
          >
            {h}
            <i onClick={closeHint} className="material-icons">
              close
            </i>
          </li>
        ))}
      </ul>
    </div>
  );
};
