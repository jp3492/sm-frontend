import React from "react";
import "./Hint.scss";
import {
  useGlobalState,
  setGlobalState,
  getGlobalState
} from "react-global-state-hook";

const HINTS = "HINTS";

export const showHint = (msg) => {
  const hints = getGlobalState(HINTS);
  setGlobalState(HINTS, [...hints, msg]);
  setTimeout(() => {
    const hints = getGlobalState(HINTS);
    setGlobalState(
      HINTS,
      hints.filter((h) => h !== msg)
    );
  }, 3000);
};

const closeHint = (e) => {
  const msg = e.target.closest("li").id;
  const hints = getGlobalState(HINTS);
  setGlobalState(
    HINTS,
    hints.filter((h) => h !== msg)
  );
};

export const Hint = () => {
  const [hints] = useGlobalState(HINTS, []);

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
