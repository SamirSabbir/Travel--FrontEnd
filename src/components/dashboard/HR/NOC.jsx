import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const NOC = () => {
  const user = JSON.parse(Cookies.get("user") || "{}");
  const [formData, setFormData] = useState({
    name: user?.name,
    passportNumber: "",
    joiningDate: "",
    position: user?.role || "",
    country: "",
    visitFrom: "",
    visitTo: "",
    purpose: "",
    email: user?.email || "",
    requestDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.post("/noc", {
        ...formData,
        status: "draft", // Indicate this is a draft
      });

      console.log("Saved as draft:", response.data);
      toast.success("NOC saved as draft successfully!");
    } catch (err) {
      console.error("Error saving draft:", err);
      setError("Failed to save as draft. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    try {
      setLoading(true);
      setError("");

      // Basic validation
      if (
        !formData.name ||
        !formData.passportNumber ||
        !formData.position ||
        !formData.country ||
        !formData.visitFrom ||
        !formData.visitTo ||
        !formData.purpose ||
        !formData.email
      ) {
        setError("Please fill in all required fields");
        return;
      }

      const response = await axios.post("/noc", {
        ...formData,
        status: "sent", // Indicate this is being sent
      });

      console.log("NOC sent:", response.data);
      toast.success("NOC sent successfully!");

      // Reset form after successful submission if needed
      setFormData({
        name: "",
        passportNumber: "",
        joiningDate: "",
        position: user?.role || "",
        country: "",
        visitFrom: "",
        visitTo: "",
        purpose: "",
        email: user?.email || "",
        requestDate: "",
      });
    } catch (err) {
      console.error("Error sending NOC:", err);
      setError("Failed to send NOC. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      requestDate: currentDate,
    }));
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 border border-gray-300">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Trip & Travel</h1>
        <p className="text-gray-500">No Objection Certificate</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form Inputs */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="date"
          name="requestDate"
          value={formData.requestDate}
          onChange={handleChange}
          className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
          placeholder="Request Date"
        />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
          placeholder="Employee Name*"
          required
        />
        <input
          type="text"
          name="passportNumber"
          value={formData.passportNumber}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Passport No*"
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Joining Date
          </label>
          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
          // placeholder="Position*"
          // required
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Destination Country*"
          required
        />
        <input
          type="date"
          name="visitFrom"
          value={formData.visitFrom}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Visit From*"
          required
        />
        <input
          type="date"
          name="visitTo"
          value={formData.visitTo}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Visit To*"
          required
        />
        <select
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select Purpose*</option>
          <option value="Business">Business</option>
          <option value="Tourism">Tourism</option>
          <option value="Medical">Medical</option>
        </select>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
          // placeholder="Email*"
          // required
        />
      </div>

      {/* Certificate Preview */}
      <div className="border p-6 rounded-lg bg-gray-50 text-sm leading-relaxed mb-6">
        <p className="text-right">{formData.requestDate || "Date"}</p>
        <p className="font-bold">PRIVATE & CONFIDENTIAL</p>
        <p>To whom it may concern,</p>
        <p className="mt-2 font-semibold">
          Re: {formData.name || "Employee Name"}
        </p>

        <p className="mt-4">
          This is to certify that{" "}
          <span className="font-medium">
            {formData.name || "Employee Name"}
          </span>
          , bearing passport no{" "}
          <span className="font-medium">
            {formData.passportNumber || "---------"}
          </span>
          , has been working in Trip & Travel since{" "}
          <span className="font-medium">
            {formData.joiningDate || "Joining Date"}
          </span>
          . He is an employee of our organization and is currently working as{" "}
          <span className="font-medium">{formData.position || "Position"}</span>
          .
        </p>

        <p className="mt-2">
          He intends to visit{" "}
          <span className="font-medium">{formData.country || "Country"}</span>{" "}
          from{" "}
          <span className="font-medium">
            {formData.visitFrom || "Start Date"}
          </span>{" "}
          to{" "}
          <span className="font-medium">{formData.visitTo || "End Date"}</span>{" "}
          for{" "}
          <span className="font-medium">{formData.purpose || "Purpose"}</span>.
        </p>

        <p className="mt-6">Yours sincerely,</p>
        <p className="mt-2 font-semibold">{formData.name || "Employee Name"}</p>
        <p className="mt-1">{formData.email || "email@example.com"}</p>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        {/* <button
          onClick={handleSave}
          disabled={loading}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Save as Draft"}
        </button> */}
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:bg-blue-400"
        >
          {loading ? "Processing..." : "Request"}
        </button>
      </div>
    </div>
  );
};

export default NOC;
