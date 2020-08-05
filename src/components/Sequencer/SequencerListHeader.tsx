import React, { useState, useEffect } from "react";
import { FILTERED_SEQUENCES } from "../../stores/sequences";
import { sgs } from "../../utils/rxGlobal";

export const SequencerListHeader = ({ sequences }) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const filtered = sequences.filter((s) =>
      s.label.toLowerCase().includes(search.toLowerCase())
    );
    sgs(FILTERED_SEQUENCES, filtered);
  }, [search, sequences]);

  return (
    <div className="sequencer_list-header grid grid-tc-1m shadow-s z1">
      <input
        className="bg-grey-light"
        type="text"
        placeholder="Search sequences..."
        onChange={({ target: { value } }) => setSearch(value)}
        value={search}
      />
      <i className="material-icons pd-005">filter_list</i>
    </div>
  );
};
