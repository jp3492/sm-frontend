import React from "react";
import "./Roadmap.scss";

import { LandingHeader, LandingFooter } from "./Landing";
import { sgs } from "../utils/rxGlobal";
import { MODAL } from "../components/Modal";

const steps = [
  {
    time: "Q3/4 2020",
    bullets: [
      {
        label: "Closed Beta Testing",
        content:
          "Testing by several users in different fields. Users are invite and request only. Bug fixes, feature enrichment and UI polishing."
      }
    ]
  },
  {
    time: "Q1 2021",
    bullets: [
      {
        label: "Launche Open Beta",
        content:
          "Add open signup for limited amount of users and improve system for scalability."
      },
      {
        label: "Implement payment and monetizing strategy."
      }
    ]
  },
  {
    time: "Q2 2021",
    bullets: [
      {
        label: "Implement developer portal",
        content:
          "Open up Viden backend and provide frontend UI components to build time-based video software."
      }
    ]
  },
  {
    time: "Q3 2021",
    bullets: [
      {
        label: "Collaborative cloud platform",
        content:
          "We want to create a platform for teams, enterprises and institutions to collaborate and work with streamable content."
      }
    ]
  }
];

export const Roadmap = () => {
  const handleSupport = () =>
    sgs(MODAL, {
      component: "REQUEST_SUPPORT"
    });
  return (
    <div className="roadmap grid grid-tr-m1mm">
      <LandingHeader />
      <section className="public-content || cl-content-icon || grid">
        <h2 className="pd-1">Roadmap</h2>
        <div className="steps grid ">
          {steps.map((step, i) => (
            <div key={i} data-time={step.time} className="step flow-1">
              {step.bullets.map((bullet, i) => (
                <span key={i}>
                  <h3>{bullet.label}</h3>
                  {!!bullet.content && <p>{bullet.content}</p>}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>
      <section className="grid place-i-c">
        <button
          className="shadow-m pd-2 bg-pri-d size-14 cl-text-icon rounded"
          onClick={handleSupport}
        >
          Want to support this project?
        </button>
      </section>
      <LandingFooter />
    </div>
  );
};
