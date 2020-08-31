import React, { useState, useEffect } from "react";
import { logout } from "../services/auth";
import { patchProfile, PROFILE } from "../stores/profile";
import { usegs } from "../utils/rxGlobal";
import { LoadingBar } from "../components/LoadingIndicators";

let interval;

export const Profile = ({ closeModal }) => {
  const [profile] = usegs(PROFILE, null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
    }
  }, []);

  const updateProfile = async (name) => {
    setLoading(true);
    await patchProfile({ name });
    setLoading(false);
  };

  useEffect(() => {
    clearInterval(interval);
    if (!!name && name !== profile.name) {
      interval = setTimeout(() => updateProfile(name), 500);
    }
  }, [name, profile]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
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
        {loading ? <LoadingBar /> : <div style={{ height: "3px" }}></div>}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="pd-051 bg-pri rounded cl-text-icon"
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </form>
  );
};
