import React, { useEffect } from "react";

export const ErrorPage404 = ({ history: { push } }) => {
  useEffect(() => {
    push("/");
  }, []);
  return <div>404: Page Not Found</div>;
};
