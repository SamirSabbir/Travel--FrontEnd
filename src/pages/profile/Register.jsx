import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);

    //for preview select image
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("user Info", formData);
    console.log("selected Profile pic:", profilePic);

    if (formData.role === "hr") {
      alert("HR registered. awaiting admin approval");
      navigate("/pending");
    } else {
      alert("employee registered successfully");
      navigate("/login");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Register
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full border rounded px-3 py-2"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border rounded px-3 py-2"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="w-full border rounded px-3 py-2"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Role</label>
            <select
              name="role"
              className="w-full border rounded px-3 py-2"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
              required
            />
            {preview && (
              <img
                src={preview}
                alt="Profile Preview"
                className="mt-3 rounded-full h-20 w-20 object-cover mx-auto"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
