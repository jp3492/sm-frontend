import React, { useState } from "react";
import { request } from "../utils/request";

export const RequestAccess = ({ closeModal }) => {
  const [values, setValues] = useState({ email: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await request("users", "/requestAccess", {
        method: "POST",
        body: JSON.stringify(values)
      });
    } catch (error) {
      alert("Email already in use");
    }
    closeModal();
  };

  const handleChange = ({ target: { name, value } }) =>
    setValues({ ...values, [name]: value });

  return (
    <form
      onSubmit={handleSubmit}
      className="request-access pd-1 grid gap-m bg-grey"
    >
      <h2>Tell us about you and your purpose.</h2>
      <p>
        We will review your request and grant you access once approved. Upon
        approval you will receive your login password via email. Please make
        sure to change your initial password after first login.
      </p>
      <input
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        placeholder="myemail@internet.com"
        alt="enter email address"
      />
      <textarea
        name="text"
        value={values.text}
        onChange={handleChange}
        placeholder="Write us about you and why you want to try our platform? :)"
      />
      <button
        disabled={loading}
        type="submit"
        className="bg-primary cl-white rounded pd-1010"
      >
        Submit
      </button>
    </form>
  );
};
