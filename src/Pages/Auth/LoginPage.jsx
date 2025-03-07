import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";

const LoginPage = () => {
  const { login } = useContext(AppContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log("reached here");
    e.preventDefault();
    setErrorMsg(false); // Reset error before login attempt
    try {
      const userData = await login(credentials.email, credentials.password);
      console.log(userData);
    } catch (error) {
      setErrorMsg(true);
      console.error("Login failed:", error);
    }
  };

  return (
    <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
      <div className="md:w-1/3 max-w-sm">
        <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          alt="Sample image"
        />
      </div>
      <div className="md:w-1/3 max-w-sm">
        <form onSubmit={handleSubmit}>
          <div className="my-5 flex items-center before:mt-0.5 before:flex-1 after:mt-0.5 after:flex-1">
            <p className="mx-4 mb-0 text-center font-semibold text-slate-500">
              You're not logged in !!!
            </p>
          </div>
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
            type="text"
            name="email"
            placeholder="Email Address"
            value={credentials.email}
            onChange={handleChange}
          />
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />
          {errorMsg && (
            <p className="text-red-400 mt-4 text-sm text-center">
              Username or Password didn't match
            </p>
          )}
          <div className="text-center md:text-left">
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
              type="submit"
            >
              Login
            </button>
          </div>
          <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
            Don&apos;t have an account?{" "}
            <a
              className="text-red-600 hover:underline hover:underline-offset-4"
              href="/register"
            >
              Register
            </a>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
