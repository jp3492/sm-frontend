import React, { useState } from "react";
import "./Auth.scss";
import { Link } from "react-router-dom";

import { register, login } from "../services/auth";

export const Auth = ({
  match: {
    params: { type }
  },
  history: { push }
}) => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log(error);

  const handleChange = ({ target: { name, value } }) =>
    setValues({ ...values, [name]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (type === "login") {
      try {
        await login(values);
        push("/dashboard");
      } catch (error) {
        setError("Auth Failed");
        push("/auth/login");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await register(values);
        push("/auth/login");
      } catch (error) {
        setError("Failed to register");
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <main className="auth">
      <form onSubmit={handleSubmit}>
        <h2>{type.capitalize()}</h2>
        <label className="form-field">
          Email
          <input
            type="email"
            value={values.email}
            onChange={handleChange}
            name="email"
            placeholder='"something@web.com"'
            alt="enter your email"
          />
        </label>
        <label className="form-field">
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
        <button disabled={loading} type="submit">
          {loading ? "Submitting.." : "Submit"}
        </button>
        <Link to={type === "login" ? "/auth/register" : "/auth/login"}>
          {type === "login" ? "Register" : "Login"}
        </Link>
      </form>
    </main>
  );
};
