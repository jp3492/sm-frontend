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

const network = require("../assets/network.svg");

const useCases = [
  {
    title: "Tutorials and instructions",
    image: require("../assets/tutorial.png"),
    height: "80px",
    alt: "tutorials and instructions",
    content:
      "Create playlists with videos and sequences for any step-by-step tutorial. Cooking videos, how-to guides or educational playlists can easily be created and shared online. We also enable an embed functionality for anything you have created on Viden.",
    exampleUrl: "http://viden.pro/viewer/playlist/9xZoPlkWuoeAyBYjUB3V"
  },
  {
    title: "Music",
    image: require("../assets/music.svg"),
    height: "80px",
    alt: "music",
    content:
      "Create music playlists with videos from multiple platforms for personal use or to share online. In case you want to add certain songs from a concert or a set, you can simply disect it as a sequence and use it in your playlist.",
    exampleUrl: "http://viden.pro/viewer/playlist/QyPnXoXJBmofOW8fy3O3"
  },
  {
    title: "(e)Sports",
    image: require("../assets/sports.png"),
    height: "80px",
    alt: "sports and esports",
    content:
      "Viden provides a simple to use solution for time based video analysis. Tag sequences, create playlists and highlights for your analysis and share them with your staff or players. Live-streams can be used just like any other video!",
    exampleUrl: "http://viden.pro/viewer/playlist/5nwBbxBXsSkEFzCPV194"
  },
  {
    title: "Media",
    image: require("../assets/media.svg"),
    height: "80px",
    alt: "media",
    content:
      "Collaborate with your team and use Viden to easily share video content back and forth. In the future we hope to integrate a collborative team functionality, which enables teams and enterprises to enhance their communication and content creation.",
    exampleUrl: ""
  },
  {
    title: "Social",
    image: require("../assets/social.svg"),
    height: "80px",
    alt: "social",
    content:
      "Want to share a small snippet of a video with your friends or a playlists with funny moments? Videns ultimate goal is it to manage, create and share streaming content as user friendly as possible.",
    exampleUrl: ""
  },
  {
    title: "Development*",
    image: require("../assets/code.svg"),
    height: "80px",
    alt: "development",
    content:
      "*Coming in the future. We want to open up out api and platform for developers. Providing a simple API and UI, we hope to enable developers to create time-based video software and elevate this platform to the next level.",
    exampleUrl: ""
  }
];

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
          {/* <a href="#pricing">Pricing</a> */}
          <a href="#whats-next">Whats next?</a>
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
        <div>
          <div className="take-links rounded pd-1">
            <i className="material-icons">play_circle_outline</i>
            <p>Copy link/url of supported videos.</p>
          </div>
          <div className="rounded pd-1">
            <i className="material-icons">folder</i>
            <p>Organize with a simple drag & drop file/folder system.</p>
          </div>
          <div className="rounded pd-1">
            <i className="material-icons sequence-icon">open_in_full</i>
            <p>Set time based tags and disect videos into sequences.</p>
          </div>
          <div className="rounded pd-1">
            <i className="material-icons">playlist_play</i>
            <p>Create playlists with videos and/or sequences.</p>
          </div>
          <div className="rounded pd-1">
            <i className="material-icons">share</i>
            <p>Share any video, sequence or playlist via link</p>
          </div>
          <div className="rounded pd-1">
            <i className="material-icons">code</i>
            <p>Embed playlist- and sequence viewer into your website</p>
          </div>
        </div>
      </section>
      <section id="use-cases" className="use-cases-section">
        <h4>Use Cases</h4>
        <div>{useCases.map(UseCase)}</div>
      </section>
      {/* <section id="pricing" className="pricing-section">
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
      </section> */}
      <section id="whats-next" className="whats-next">
        <h4>Our Plans</h4>
        <span>
          <h5>'Add a new dimension to online streaming'</h5>
          <p>
            Our ultimate goal is it to make every video thats streamable online
            as interactive and useable as possible and support content creation
            in general.
          </p>
        </span>
        <span>
          <h5>Therefore we have following stepstones in mind:</h5>
          <p>
            <i className="material-icons">check_box</i>
            Create basic functionalities for users to organize, create and share
            content.
          </p>
          <p>
            <i className="material-icons">check_box_outline_blank</i>
            Develop a cloud for professionals and teams to collaborate on
            content creation and effectively work with streamable media.
          </p>
          <p>
            <i className="material-icons">check_box_outline_blank</i>
            Open up our API for developers to build time-based video software.
            Examples: 'Sports analysis', 'Video based AI learning', 'Educational
            video platforms', 'Video surveilance', ...
          </p>
        </span>
        <span>
          <h5>Interested in supporting this project?</h5>
          <p>
            Please reach out to me personally for cooperation or potential jobs:{" "}
          </p>
          <a href="mailto:contact@jpmarks.dev">Send me an Email.</a>
        </span>
      </section>
      <footer>
        <div>
          <h2>Viden</h2>
          {/* <Link to="/impressum">Imprint</Link>
          <Link to="/datenschutz">Data & Privacy</Link> */}
        </div>
      </footer>
    </div>
  );
};

const UseCase = ({ title, image, height, alt, content, exampleUrl }) => (
  <p className="use-case">
    <h5>{title}</h5>
    <img src={image} height={height} alt={alt} />
    <span>{content}</span>
    {!!exampleUrl && (
      <a
        className="pd-051 rounded button-icon"
        href={exampleUrl}
        target="_blank"
      >
        <span>View Example</span>
        <i className="material-icons">open_in_new</i>
      </a>
    )}
  </p>
);
