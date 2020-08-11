import React, { useState, useMemo } from "react";
import { usegs } from "../utils/rxGlobal";
import { PLAYLISTS } from "../stores/playlists";

export const SelectPlaylist = ({ closeModal }) => {
  const [playlists] = usegs(PLAYLISTS);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const handleSelect = (e) => {
    const id = e.target.closest("li").id;
    setSelected(id);
  };

  const handleSubmit = () => closeModal(selected);

  const searchedPlaylists = useMemo(() => {
    if (!!search) {
      return playlists;
    }
    return playlists.filter((p) =>
      p.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [playlists, search]);

  return (
    <div>
      <input
        type="text"
        name="search"
        alt="search palylists"
        value={search}
        onChange={({ target: { value } }) => setSearch(value)}
      />
      <ul>
        {searchedPlaylists.map((p, i) => (
          <li id={p.id} key={i} onClick={handleSelect}>
            <i className="material-icons">
              {selected === p.id ? "check_box" : "check_box_outline_blank"}
            </i>
            {p.label}
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Select</button>
    </div>
  );
};
