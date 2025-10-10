import { Button, Input, message } from "antd";
import Title from "antd/es/typography/Title";
import { use, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router-dom";
import Register from "./Register";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email == "" && formData.password == "") {
      setError("Both email and password are required.");
      return;
    }

    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/;
    if (!pattern.test(formData["email"])) {
      setEmailError("Invalid email format");
      return;
    }

    // calling API
    try {
      const response = await fetch("https://localhost:7299/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Server response is ", data);
      if (!response.ok) {
        setError(data.message);
        message.error(data.message);
      } else {
        setSuccessMsg(data.message);
        localStorage.setItem("jwtToken", data.token);

        navigate("/home");
      }
    } catch (err) {
      message.error(err);
    }
  };
  return (
    <>
      <div className="flex flex-col items-center m-48">
        <Title level={1}>Your Blog Resource</Title>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        {successMsg && (
          <p className="bg-green-300 p-3 mb-3 rounded-2xl">{successMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="w-96">
          <div className="flex flex-col">
            <Input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ marginBottom: 10 }}
            />
            {emailError && (
              <p className="text-red-500 mb-5 self-start">{emailError}</p>
            )}

            <Input.Password
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ marginBottom: 10 }}
            />
            <Button type="primary" onClick={handleSubmit} block>
              Submit
            </Button>
          </div>
        </form>
        <div className="mt-3">
          <div>
            Don't you have an account?{" "}
            <Link
              to="/register"
              className=" text-blue-500
               border-b-blue-500"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
