import React from "react";
import "./Landing.scss";
import { useGlobalState } from "react-global-state-hook";
import { AUTH } from "../services/auth";
import { Link } from "react-router-dom";

const platforms = {
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

export const Landing = () => {
  const [auth] = useGlobalState(AUTH);

  return (
    <div className="landing gap-l">
      <header className="centered-grid grid-tc-1mm gap-l pd-01">
        <h2 className="js-s">Viden</h2>
        <nav className="centered-grid grid-ac-m grid-af-c gap-l">
          <a>How it works</a>
          <a>Use cases</a>
          <a>Pricing</a>
        </nav>
        {auth ? (
          <Link to="/dashboard">Dashboard</Link>
        ) : (
          <Link to="/auth/login">Login</Link>
        )}
      </header>
      <section>
        <h4>
          Viden is an online platform to manage streaming videos from multiple
          sources, disect them into sequences, create playlists and share
          content.
        </h4>
        <div>
          <ul>
            {Object.keys(platforms).map((key) => (
              <li key={key}>
                <img src={platforms[key]} alt={key} height="30px" />
              </li>
            ))}
            <li>... HLS and DASH are also supported.</li>
          </ul>
        </div>
      </section>
      <section className="how-to-section">
        <h4>How it works?</h4>
        <p>
          <label>1</label>
          <span>
            Copy a video link from YouTube, Twitch, Dropbox and others.
            <br />! No video is saved on this platform. We only save a reference
            to videos via url and interact with the sources provided player!
          </span>
        </p>
        <p>
          <label>2</label>
          <span>
            Go to your Viden dashboard and save the link into your directory.
          </span>
        </p>
        <p>
          <label>3</label>
          <span>
            You can create folders and organize your videos, playlists and
            sequences. We provide an easy to use, drag & drop UI with a standard
            folder system.
          </span>
        </p>
        <p>
          <label>4</label>
          <span>
            Creating playlists is as easy as dropping videos onto the playlist
            panel. Once saved you can share (if enabled) your playlists as well
            as videos via link online.
          </span>
        </p>
        <p>
          <label>5</label>
          <span>
            One of the main functionalities of Viden is to disect and tag
            sequences. You can set a start and stop tag on every video as well
            as a comment. Sequences can be shared and used in playlists, just
            like any video.
          </span>
        </p>
        <div></div>
      </section>
      <section className="use-cases-section">
        <h4>Use Cases</h4>
        <div>
          <p>
            <h5>Tutorials and instructions:</h5>
            <span>
              Create playlists with videos and sequences for any step-by-step
              tutorial. Cooking videos, how-to guides or educational playlists
              can easily be created and shared online. We also enable an embed
              functionality for anything you have created on Viden.
            </span>
          </p>
          <p>
            <h5>Music:</h5>
            <span>
              Create music playlists with videos from multiple platforms for
              personal use or to share online. In case you want to add certain
              songs from a concert or a set, you can simply disect it as a
              sequence and use it in your playlist.
            </span>
          </p>
          <p>
            <h5>(e)Sports:</h5>
            <span>
              Viden provides a simple to use solution for time based video
              analysis at very low cost. Tag sequences, create playlists and
              highlights for your analysis and share them with your staff or
              players. Live-streams can be used just like any other video!
            </span>
          </p>
          <p>
            <h5>Media:</h5>
            <span>
              Collaborate with your team and use Viden to easily share video
              content back and forth. In the future we hope to integrate a
              collborative team functionality, which enables teams and
              enterprises to enhance their communication and content creation.
            </span>
          </p>
          <p>
            <h5>Social:</h5>
            <span>
              Want to share a small snippet of a video with your friends or a
              playlists with funny moments or simply organize your favorite
              online video content? Videns ultimate goal is it to manage, create
              and share streaming content as easily and user friendly as
              possible.
            </span>
          </p>
        </div>
        <div></div>
      </section>
      <section className="pricing-section">
        <h4>Pricing</h4>
        <p>
          Our goal is to create a sustainable and productive workplace as well
          as service to our users. Therefore we are trying to have a good
          balance between utility- and value based pricing. We believe in fair
          pricing and transparent use of data.
        </p>
        <div>
          <div>
            <h5>
              <i className="material-icons">person</i>Private
            </h5>
            <div>
              <p>Default setting when signing up.</p>
              <p>Full access to all basic functionalities.</p>
              <p>No functionality to share your content.</p>
            </div>
            <span>Free</span>
          </div>

          <div>
            <h5>
              <i className="material-icons">share</i>Social
            </h5>
            <div>
              <p>Full access to all basic functionalities.</p>
              <p>
                Content (videos, sequences, playlists) is sharable online via
                link.
              </p>
              <p>Content can be embedded on your website.</p>
            </div>
            <span>1€ / month</span>
          </div>

          <div>
            <h5>
              <i className="material-icons">people</i>Team/Enterprise
            </h5>
            <div>
              <p>Full access to all basic functionalities.</p>
              <p>
                Content (videos, sequences, playlists) is sharable online via
                link.
              </p>
              <p>Content can be embedded on your website.</p>
              <p>Privately share and edit content within your team.</p>
              <p>Commenting functonality on all your content.</p>
            </div>
            <span>Coming soon</span>
          </div>
        </div>
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
