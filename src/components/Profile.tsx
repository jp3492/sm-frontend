import React from "react";
import "./Profile.scss";
import { logout } from "../services/auth";
import { useHistory } from "react-router-dom";

export const Profile = ({ closeModal }) => {
  const { push } = useHistory();

  const handleLogout = async () => {
    await logout();
    push("/auth/login");
    closeModal();
  };

  return (
    <div className="centered-grid pd-2 bg-white">
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
