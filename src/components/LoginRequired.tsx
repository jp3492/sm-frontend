import React from "react";
import { usegs } from "../utils/rxGlobal";
import { AUTH } from "../services/auth";

export const LoginRequired = () => {
  const [auth] = usegs(AUTH);

  return <div></div>;
};
