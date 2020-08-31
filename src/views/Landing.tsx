import React, { useState, useMemo } from "react";
import "./Landing.scss";
import { AUTH } from "../services/auth";
import { Link } from "react-router-dom";
import { usegs, sgs } from "../utils/rxGlobal";
import {
  getFeaturedPlaylists,
  FEATURED_PLAYLISTS
} from "../stores/landingPage";
import ReactPlayer from "react-player";
import { MODAL } from "../components/Modal";
import { LoadingSpinner } from "../components/LoadingIndicators";

export const platforms = {
  youtube: require("../assets/youtube.svg"),
  soundcloud: require("../assets/soundcloud.png"),
  twitch: require("../assets/twitch.svg"),
  dropbox: require("../assets/dropbox.png"),
  vimeo: require("../assets/vimeo.svg"),
  streamable: require("../assets/streamable.png"),
  wistia: require("../assets/wistia.svg"),
  dailymotion: require("../assets/dailymotion.svg"),
  vidyard: require("../assets/vidyard.svg")
};

const network = require("../assets/network.svg");

const Landing = ({ history: { push } }) => {
  const [featuredPlaylists] = usegs(FEATURED_PLAYLISTS);
  const [loading, setLoading] = useState(false);

  const initialGet = async () => {
    setLoading(true);
    await getFeaturedPlaylists();
    setLoading(false);
  };

  useMemo(() => initialGet(), []);

  return (
    <div className="landing || flow-2">
      <LandingHeader push={push} />
      <section className="public-content || intro-section || pd-2 || grid grid-tc-m1 grid-tr-11m gap-24 || cl-content-icon">
        <h2 className="align-e || size-25 || pd-0020">
          A new Way for
          <br />
          Online Streaming
        </h2>
        <h3 className="weight-500">
          Viden is a platform to work and interact with streamable videos
          online. Our goal is it to help users, create and share content in new
          ways.
        </h3>
        <div className="grid grid-tc-m1 gap-02 || pd-1">
          <img src={network} height="100px" alt="online network icon" />
          <h4 className="size-14">Barrier-free Support</h4>
          <p>
            You can use any video of the supported platforms as well as any HLS
            or DASH supported streaming service.
          </p>
        </div>
        <ul className="grid justify-e justify-i-e pd-24">
          {Object.keys(platforms).map((key) => (
            <li key={key}>
              <img
                src={platforms[key]}
                alt={key}
                height={key === "soundcloud" ? "40px" : "30px"}
              />
            </li>
          ))}
        </ul>
      </section>
      <section
        id="featured"
        className="public-content || featured-section || cl-content-icon || grid gap-l"
      >
        <h4 className="cl-text-icon || size-18">Featured</h4>
        <ul className="grid gap-l">
          {loading ? (
            <LoadingSpinner />
          ) : (
            featuredPlaylists.map(FeaturedPlaylists)
          )}
        </ul>
      </section>
      <LandingFooter />
    </div>
  );
};

const FeaturedPlaylists = ({ items, label, id, preview }) => {
  return (
    <li key={id} className="featured-playlist" id={id}>
      <Link className="grid" to={`/viewer/playlist/${id}`}>
        <div>
          <ReactPlayer
            url={preview}
            light={true}
            controls={false}
            height="100%"
            width="auto"
          />
        </div>
        <label className="pd-05">{label}</label>
        <p className="pd-005">{`${items.length} Highlights`}</p>
      </Link>
    </li>
  );
};

export const LandingFooter = () => (
  <footer className="bg-acc-d || shadow-xl || pd-21 || cl-content-icon">
    <div className="grid grid-af-c align-i-c grid-ac-m gap-1">
      <h2>Viden</h2>
      <Link to="/impressum">Imprint</Link>
      <Link to="/datenschutz">Data & Privacy</Link>
    </div>
  </footer>
);

export const LandingHeader = ({ isLanding = true, push }: any) => {
  const [auth] = usegs(AUTH);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(false);
  };

  const handleLogin = () =>
    sgs(MODAL, {
      component: "AUTH",
      props: { push, type: "login" }
    });

  return (
    <header className="grid align-i-c grid-tc-1m gap-l || pd-01 || cl-content-icon ">
      <Link to="/">
        <h1>
          Viden <small className="size-s">Beta</small>
        </h1>
      </Link>
      <button onClick={() => setOpen(!open)}>
        <i className="material-icons">menu</i>
      </button>
      <nav
        data-open={open}
        className="grid grid-ac-m grid-af-c gap-l"
        onClick={handleClick}
      >
        {!!isLanding && <a href="#featured">Featured</a>}
        <Link to="/roadmap">Roadmap</Link>
        {auth ? (
          <Link to="/dashboard">Dashboard</Link>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
      </nav>
    </header>
  );
};

export default Landing;
