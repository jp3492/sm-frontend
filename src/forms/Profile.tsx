import React, { useState, useEffect } from "react";
import { logout } from "../services/auth";
import { patchProfile, PROFILE } from "../stores/profile";
import { usegs } from "../utils/rxGlobal";

let interval;

export const Profile = ({ closeModal }) => {
  const [profile] = usegs(PROFILE, null);
  const [name, setName] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name);
    }
  }, []);

  useEffect(() => {
    clearInterval(interval);
    if (!!name) {
      interval = setTimeout(() => patchProfile({ name }), 500);
    }
  }, [name]);

  const handleLogout = async () => {
    await logout();
    closeModal();
  };

  return (
    <form>
      <div className="form-header">
        <h2>Your Profile</h2>
      </div>
      <div className="form-body">
        <label>
          Name
          <input
            type="text"
            alt="your name"
            value={name}
            onChange={({ target: { value } }) => setName(value)}
            placeholder="Add you name"
            name="name"
          />
        </label>
        <button
          onClick={handleLogout}
          className="pd-051 bg-pri rounded cl-text-icon"
        >
          Logout
        </button>
      </div>
    </form>
  );
};
