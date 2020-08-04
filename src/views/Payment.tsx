import React, { useEffect, useState, useRef } from "react";
import { getClientToken } from "../stores/payment";
import BraintreeWebDropIn from "braintree-web-drop-in";

export const Payment = () => {
  const [token, setToken]: [string, Function] = useState("");

  const container: any = useRef(null);

  useEffect(() => {
    getClientToken().then((t) => setToken(t));
  }, []);

  useEffect(() => {
    createUi();
  }, [token]);

  const createUi = async () => {
    try {
      await BraintreeWebDropIn.create({
        authorization: token,
        container: container.current
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="payment">
      <div ref={container}></div>
    </div>
  );
};
