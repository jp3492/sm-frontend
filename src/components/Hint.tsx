import React from "react";
import "./Hint.scss";
import { useGlobalState, setGlobalState } from "react-global-state-hook";

export const HINT = "HINT";

export const closeHint = () => {
  setGlobalState(HINT, null);
};

export const Hint = () => {
  const [hint, setHint] = useGlobalState(HINT, null);

  if (hint === null) {
    return null;
  }

  const handleClick = (e) => {
    if (e.target.classList.contains("hint")) {
      setHint(null);
    }
  };

  return (
    <div onClick={handleClick} className="hint">
      {hint}
      <i onClick={closeHint} className="material-icons">
        close
      </i>
    </div>
  );
};
