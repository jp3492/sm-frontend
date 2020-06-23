import React from "react";
import "./Landing.scss";

export const Landing = () => {
  return (
    <div className="landing">
      <header>
        <div>
          <h1>viden</h1>
          <p>All about streaming.</p>
        </div>
        <button>Login</button>
      </header>
      <div className="left"></div>
      <ul>
        <LiItems />
      </ul>
      <div className="right">
        <div>
          <i className="material-icons">folder</i>
          <h2>Manage</h2>
          <p>
            Keep structured folders to organize and manage video and audio
            streams.
          </p>
        </div>
        <div>
          <i className="material-icons">folder</i>
          <h2>Analyze</h2>
          <p>
            Keep structured folders to organize and manage video and audio
            streams.
          </p>
        </div>
        <div>
          <i className="material-icons">share</i>
          <h2>Present</h2>
          <p>
            Keep structured folders to organize and manage video and audio
            streams.
          </p>
        </div>
      </div>
    </div>
  );
};

const LiItems = () => {
  return (
    <>
      <li></li>
      <li></li>
    </>
  );
};
