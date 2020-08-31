import React from "react";
import "./LoadingIndicators.scss";

export const LoadingSpinner = ({ color }: any) => (
  <div className="loading-spinner">
    <svg className="circular">
      <circle
        data-color={color}
        className="path"
        fill="none"
        r="20"
        cx="50"
        cy="50"
        stroke-width="3"
        stroke-miterlimit="10"
      />
    </svg>
  </div>
);

export const LoadingBar = ({ color }: any) => (
  <div data-color={color} className="loading-bar"></div>
);
