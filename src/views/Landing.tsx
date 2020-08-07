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

export const Landing = () => {
  const [auth] = usegs(AUTH);

  return (
    <div className="landing gap-l">
      <header className="centered-grid grid-tc-1mm l-gap-l pd-01 s-gap-l">
        <h2 className="js-s">Viden</h2>
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
        <h4>
          Viden is a platform that provides tools to work and interact with
          streamed videos. Our goal is it to add a new dimension to online
          streaming and help users to create and share content in new ways.
        </h4>
        <label>Supported platforms</label>
        <div>
          <ul>
            {Object.keys(platforms).map((key) => (
              <li key={key}>
                <img src={platforms[key]} alt={key} height="30px" />
              </li>
            ))}
            {/* <li>... HLS and DASH are also supported.</li> */}
          </ul>
        </div>
        <span>
          Want to use your own streaming service? HLS and DASH are also
          supported.
        </span>
      </section>
      <section id="how-to" className="how-to-section">
        <h4>How it works?</h4>
        <p>
          <label>1</label>
          <span>
            Copy any video link on the internet from any supported platform.
          </span>
        </p>
        <p>
          <label>2</label>
          <span>Save that link in your dashboard.</span>
        </p>
        <p>
          <label>3</label>
          <span>Drag and drop videos into playlists.</span>
        </p>
        <p>
          <label>4</label>
          <span>Create folders and organize your content.</span>
        </p>
        <p>
          <label>5</label>
          <span>
            You want only part of a video? No problem. Just extract the desired
            sequence (it's like magic 🙂).
            <br />
            <br />
            !Any sequence and video can be used in a playlist!
          </span>
        </p>
        <p>
          <label>6</label>
          <span>
            Share any playlist, video or sequence with your friends or collegues
            via link.
          </span>
        </p>
        <div></div>
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
              analysis at very low cost. Tag sequences, create playlists and
              highlights for your analysis and share them with your staff or
              players. Live-streams can be used just like any other video!
            </span>
          </p>
          <p>
            <h5>Media:</h5>
            <img src={media} height="80px" alt="media" />
            <span>
              Collaborate with your team and use Viden to easily share video
              content back and forth. In the future we hope to integrate a
              collborative team functionality, which enables teams and
              enterprises to enhance their communication and content creation.
            </span>
          </p>
          <p>
            <h5>Social:</h5>
            <img src={social} height="60px" width="80px" alt="music" />

            <span>
              Want to share a small snippet of a video with your friends or a
              playlists with funny moments or simply organize your favorite
              online video content? Videns ultimate goal is it to manage, create
              and share streaming content as easily and user friendly as
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
        <h4>Pricing</h4>
        <p>
          Our goal is to create a sustainable and productive workplace as well
          as service to our users. Therefore we intend to have a good balance
          between utility- and value based pricing. We believe in fair pricing
          and transparent use of data.
          <br />
          <br />
          By restricting sharing capabilities to a paid account, we intend to
          ensure higher quality of our community. Free social media platforms
          tend to run into issues the bigger the user base gets. We hope to
          prevent some of these issues while attracting people with professional
          purpose.
        </p>
        <span>
          By default, a signed up user has <b>free</b> access to all
          functionalities, but sharing capabilities are restricted.
        </span>
        <div>
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
              {/* <p>Full access to all basic functionalities.</p>
              <p>
                Content (videos, sequences, playlists) is sharable online via
                link.
              </p>
              <p>Content can be embedded on your website.</p> */}
              <p>Privately share and edit content within your team.</p>
              <p>Commenting functonality on all your content.</p>
              <p>Integration with private video servers.</p>
            </div>
            <span>Coming in the future</span>
          </div>

          <div>
            <h5>
              <i className="material-icons">code</i>Developer
            </h5>
            <div>
              <p>API access to all content related endpoints.</p>
              <p>Extended embed functionalities and configuration.</p>
              <p>
                Drop-in UIs for frontend development. (JS, React, Vue, Angular,
                Svelte)
              </p>
              <p>Create and manage accounts for your own users.</p>
            </div>
            <span>Coming in the future</span>
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
