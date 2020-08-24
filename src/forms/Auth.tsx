import React, { useState } from "react";
import "./Auth.scss";

import { login } from "../services/auth";
import { sgs } from "../utils/rxGlobal";
import { MODAL } from "../components/Modal";

export const Auth = ({ type, closeModal }) => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = ({ target: { name, value } }) =>
    setValues({ ...values, [name]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (type === "login") {
      try {
        await login(values);
      } catch (error) {
        setError("Email or password are incorrect.");
      } finally {
        closeModal();
      }
    }
    // else {
    //   try {
    //     await register(values);
    //     push("/auth/login");
    //   } catch (error) {
    //     setError("Failed to register");
    //   } finally {
    //     setLoading(false);
    //   }
    // }
  };

  const handleAccess = () =>
    sgs(MODAL, {
      component: "REQUEST_ACCESS"
    });

  return (
    <form
      className="auth-form || bg-acc || rounded || grid gap-m || pd-1 || shadow-m"
      onSubmit={handleSubmit}
    >
      <h2 className="cl-text-icon || text-align-c || pd-05">
        {type.capitalize()}
      </h2>
      <label className="form-field || bg-white || cl-text-sec">
        Email
        <input
          className="bg-white"
          type="email"
          value={values.email}
          onChange={handleChange}
          name="email"
          placeholder='"something@web.com"'
          alt="enter your email"
        />
      </label>
      <label className="form-field || bg-white || cl-text-sec">
        Password
        <input
          type="password"
          placeholder="Aa-1****"
          alt="enter your password"
          value={values.password}
          onChange={handleChange}
          name="password"
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button
        className="rounded || bg-pri || pd-1010 || cl-text-icon"
        disabled={loading}
        type="submit"
      >
        {loading ? "Submitting.." : "Submit"}
      </button>
      {/* <Link to={type === "login" ? "/auth/register" : "/auth/login"}>
          {type === "login" ? "Register here" : "Login here"}
        </Link> */}
      <span className="cl-text-icon text-align-c" onClick={handleAccess}>
        Request access here
      </span>
    </form>
  );
};
