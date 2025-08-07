import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { FiEye, FiEyeOff } from "react-icons/fi";

// JWT decoding function
const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch (e) {
    return null;
  }
};

const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post("/auth/login", formData);

      // Store the token in cookie with expiration (matches JWT expiry)
      const decodedToken = decodeJWT(response.data.data.token);
      console.log("Decoded Token:", decodedToken); // Debugging

      const userRole =
        decodedToken.role ||
        decodedToken.userRole ||
        decodedToken.UserRole ||
        "employee";

      const expires = new Date(decodedToken.exp * 1000); // Convert JWT exp (seconds) to Date

      Cookies.set("token", response.data.data.token, {
        expires,
        // eslint-disable-next-line no-undef
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Store basic user info in cookie (optional)
      Cookies.set(
        "user",
        JSON.stringify({
          name:
            decodedToken.name ||
            decodedToken.userName ||
            formData.email.split("@")[0],
          role: userRole,
          email: decodedToken.email || formData.email,
        }),
        {
          expires,
          // eslint-disable-next-line no-undef
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        }
      );

      toast.success("Login successful");

      // Redirect based on user role
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f5f7fa]">
      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-[#0F4F55] to-[#0c3d42] p-12">
        <div className="max-w-md text-white">
          <h1 className="text-5xl font-bold mb-6">Trip and Travel</h1>
          <p className="text-xl opacity-90">
            Your journey begins here. Explore the world with us.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <ToastContainer position="top-center" autoClose={3000} />
          <div className="bg-white p-8 rounded-xl shadow-2xl border border-[#e0e6ed] transform transition-all duration-300 hover:shadow-3xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#0F4F55]">Welcome Back</h2>
              <p className="text-[#6b7280] mt-2">
                Please enter your credentials to login
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e0e6ed] focus:outline-none focus:ring-2 focus:ring-[#0F4F55] focus:border-transparent transition"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e0e6ed] focus:outline-none focus:ring-2 focus:ring-[#0F4F55] focus:border-transparent transition pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                  isSubmitting
                    ? "bg-[#9ca3af] cursor-not-allowed"
                    : "bg-[#0F4F55] hover:bg-[#0c3d42]"
                } transition`}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#6b7280]">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-[#0F4F55] font-medium hover:underline focus:outline-none"
                >
                  Register
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;