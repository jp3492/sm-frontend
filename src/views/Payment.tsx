import React, { useEffect } from "react";
import { getClientToken } from "../stores/payment";

export const Payment = () => {
  useEffect(() => {
    getClientToken();
  }, []);
  return <div className="payment"></div>;
};
