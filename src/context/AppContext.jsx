import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && !user) {
      setUser(JSON.parse(storedUser));
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8001/auth/authenticate",
        { email, password }
      );
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));

      if (response.data.roles === "STUDENT") navigate("/student");
      if (response.data.roles === "INSTRUCTOR") navigate("/instructor");
      if (response.data.roles === "ADMIN") navigate("/admin");
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid email or password");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <AppContext.Provider
      value={{ user, login, logout, isDarkMode, toggleDarkMode }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
