import { Button, Input, message } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("formdata is ", formData);
    if (
      formData.fullname == "" ||
      formData.email == "" ||
      formData.password == "" ||
      formData.confirmPassword == ""
    ) {
      setError("Email or Password or Confirm Password could not be null.");
      return;
    }
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/;
    if (!pattern.test(formData["email"])) {
      setEmailError("Invalid email format");
      return;
    }

    if (formData["password"] !== formData["confirmPassword"]) {
      setError("Password does't match.");
    }

    try {
      const response = await fetch(
        "https://localhost:7299/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        message.error(data.message);
      } else {
        setSuccessMsg(data.message);
        message.success(data.message);
      }
      console.log("register response is ", data);
      navigate("/login");
    } catch (err) {
      message.error("Something went wrong. Please try again.");
    }
  };
  return (
    <>
      <div className="flex flex-col items-center m-32">
        <Title level={3}>Register</Title>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        {successMsg && (
          <p className="bg-green-300 p-3 mb-3 rounded-2xl">{successMsg}</p>
        )}
        <form onSubmit={handleSubmit} className="w-96">
          <div className="flex flex-col">
            <Input
              type="text"
              placeholder="Fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              style={{ marginBottom: 10 }}
            />
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

            <Input.Password
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
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
              to="/login"
              className=" text-blue-500
         border-b-blue-500"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
