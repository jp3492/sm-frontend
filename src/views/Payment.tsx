import React, { useEffect, useState, useRef } from "react";
import { getClientToken } from "../stores/payment";

export const Payment = () => {
  const [token, setToken]: [string, Function] = useState("");

  const container: any = useRef(null);

  useEffect(() => {
    getClientToken().then((t) => setToken(t));
  }, []);

  useEffect(() => {}, [token]);

  return (
    <div className="payment">
      <div ref={container}></div>
    </div>
  );
};
