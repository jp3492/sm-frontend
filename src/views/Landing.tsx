import React from "react";
import "./Landing.scss";
import { AUTH } from "../services/auth";
import { Link } from "react-router-dom";
import { usegs } from "../utils/rxGlobal";

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

const tutorial = require("../assets/tutorial.png");
const music = require("../assets/music.svg");
const sports = require("../assets/sports.png");
const media = require("../assets/media.svg");
const social = require("../assets/social.svg");
const code = require("../assets/code.svg");
const network = require("../assets/network.svg");

export const Landing = () => {
  const [auth] = usegs(AUTH);

  return (
    <div className="landing gap-l">
      <header className="centered-grid grid-tc-1mm l-gap-l pd-01 s-gap-l">
        <h1 className="js-s">
          Viden <small>Beta</small>
        </h1>
        <nav className="centered-grid grid-ac-m grid-af-c l-gap-l s-gap-l">
          <a href="#how-to">How it works</a>
          <a href="#use-cases">Use cases</a>
          <a href="#pricing">Pricing</a>
        </nav>
        {auth ? (
          <Link to="/dashboard">Dashboard</Link>
        ) : (
          <Link to="/auth">Login</Link>
        )}
      </header>
      <section className="intro-section">
        <h2>
          A new Dimension <br />
          for Online Streaming
        </h2>
        <h3>
          Viden is a platform to work and interact with streamable videos
          online. Our goal is it to help users, create and share content in new
          ways.
        </h3>
        <div>
          <img src={network} height="100px" alt="online network icon" />
          <h4>Barrier-free Support</h4>
          <p>
            You can use any video of the supported platforms as well as any HLS
            or DASH supported streaming service.
          </p>
        </div>
        <ul>
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
      <section id="how-to" className="how-to-section">
        <h4>How it works?</h4>
        <p>
          The example below is a playlist created with Viden. The playlist
          contains multiple videos from several platforms as well as single
          sequences of those videos. It is embedded on this website as normal
          iFrame.
          <a
            target="_blank"
            href="https://viden.pro/viewer/playlist/oT89LOtv67j2EVYEag2P"
          >
            Watch playlist in full here.
          </a>
        </p>
        <div>
          <iframe
            src="https://viden.pro/viewer/playlist/oT89LOtv67j2EVYEag2P"
            title="embedded instruction playlist on how this here works!"
          />
        </div>
      </section>
      <section id="use-cases" className="use-cases-section">
        <h4>Use Cases</h4>
        <div>
          <p>
            <h5>Tutorials and instructions:</h5>
            <img
              src={tutorial}
              alt="tutorials and instructions"
              height="80px"
            />
            <span>
              Create playlists with videos and sequences for any step-by-step
              tutorial. Cooking videos, how-to guides or educational playlists
              can easily be created and shared online. We also enable an embed
              functionality for anything you have created on Viden.
            </span>
          </p>
          <p>
            <h5>Music:</h5>
            <img src={music} height="80px" alt="music" />
            <span>
              Create music playlists with videos from multiple platforms for
              personal use or to share online. In case you want to add certain
              songs from a concert or a set, you can simply disect it as a
              sequence and use it in your playlist.
            </span>
          </p>
          <p>
            <h5>(e)Sports:</h5>
            <img src={sports} height="80px" alt="sports" />
            <span>
              Viden provides a simple to use solution for time based video
              analysis. Tag sequences, create playlists and highlights for your
              analysis and share them with your staff or players. Live-streams
              can be used just like any other video!
            </span>
          </p>
          <p>
            <h5>Media:</h5>
            <img src={media} width="100%" alt="media" />
            <span>
              Collaborate with your team and use Viden to easily share video
              content back and forth. In the future we hope to integrate a
              collborative team functionality, which enables teams and
              enterprises to enhance their communication and content creation.
            </span>
          </p>
          <p>
            <h5>Social:</h5>
            <img src={social} height="80px" alt="music" />

            <span>
              Want to share a small snippet of a video with your friends or a
              playlists with funny moments? Videns ultimate goal is it to
              manage, create and share streaming content as user friendly as
              possible.
            </span>
          </p>

          <p>
            <h5>Development*:</h5>
            <img src={code} height="80px" alt="music" />
            <span>
              *Coming in the future. We want to open up out api and platform for
              developers. Providing a simple API and UI, we hope to enable
              developers to create time-based video software and elevate this
              platform to the next level.
            </span>
          </p>
        </div>
      </section>
      <section id="pricing" className="pricing-section">
        <h4>
          Pricing <small>Coming soon</small>
        </h4>
        <p>
          Our goal is to create a sustainable and productive workplace as well
          as service to our users. Creating a solid and representable community,
          should be a major focus for all new social media platforms. Therefore
          we intend to eliminate the need for advertising through user data and
          create a fair pricing model.
          <br />
          <br />
          By restricting sharing capabilities to a paid account, we intend to
          ensure higher quality of our community. We hope to prevent some of the
          commong social media issues while attracting people with professional
          purpose.
        </p>
        <div></div>
      </section>
      <footer>
        <div>
          <h2>Viden</h2>
          <Link to="/impressum">Imprint</Link>
          <Link to="/datenschutz">Data & Privacy</Link>
        </div>
      </footer>
    </div>
  );
};
