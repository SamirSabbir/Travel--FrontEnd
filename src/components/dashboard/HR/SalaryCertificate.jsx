import React, { useState } from "react";
import axios from "../../../api/axios";
import Cookies from "js-cookie"; 
const SalaryCertificate = () => {
   const user = JSON.parse(Cookies.get("user") || "{}");

  const [formData, setFormData] = useState({
    name: "",
    position: user?.role || "",
    joiningDate: "",
    monthlySalary: "",
    requestDate: "",
    email: user?.email || "",
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
      
      const response = await axios.post("/salaryCertificate", {
        ...formData,
        status: "draft" // Indicate this is a draft
      });
      
      console.log("Saved as draft:", response.data);
      alert("Salary certificate saved as draft successfully!");
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
      if (!formData.name || !formData.position || !formData.monthlySalary || !formData.email) {
        setError("Please fill in all required fields");
        return;
      }
      
      const response = await axios.post("/salaryCertificate", {
        ...formData,
        status: "sent" // Indicate this is being sent
      });
      
      console.log("Certificate sent:", response.data);
      alert("Salary certificate sent successfully!");
      
      // Reset form after successful submission if needed
      setFormData({
        name: "",
        position: user?.role,
        joiningDate: "",
        monthlySalary: "",
        requestDate: "",
        email: user?.email || "",
      });
    } catch (err) {
      console.error("Error sending certificate:", err);
      setError("Failed to send certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 border border-gray-300">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Trip & Travel</h1>
        <p className="text-gray-500">Salary Certificate</p>
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
          className="border p-2 rounded w-full"
          placeholder="Request Date"
        />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Employee Name*"
          required
        />
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
          // placeholder="Position*"
          required
        />
        <input
          type="date"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Joining Date"
        />
        <input
          type="number"
          name="monthlySalary"
          value={formData.monthlySalary}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Monthly Salary*"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
          // placeholder="Employee Email*"
        />
      </div>

      {/* Certificate Preview */}
      <div className="border p-6 rounded-lg bg-gray-50 text-sm leading-relaxed mb-6">
        <p className="text-right">{formData.requestDate || "Date"}</p>
        <p className="font-bold">PRIVATE & CONFIDENTIAL</p>
        <p>To whom it may concern,</p>
        <p className="mt-2 font-semibold">Re: {formData.name || "Employee Name"}</p>

        <p className="mt-4">
          Further to your recent reference enquiry, I can confirm that{" "}
          <span className="font-medium">{formData.name || "Employee Name"}</span>{" "}
          is a regular full-time employee at Trip & Travel.
        </p>

        <p className="mt-2">
          {formData.name || "Employee Name"} is employed as a{" "}
          <span className="font-medium">{formData.position || "Position"}</span>{" "}
          with Trip & Travel on{" "}
          <span className="font-medium">{formData.joiningDate || "Joining Date"}</span>. 
          Additionally, I can confirm that my monthly salary is{" "}
          <span className="font-medium">Tk {formData.monthlySalary || "----"}</span>.
        </p>

        <p className="mt-2">
          The above information is given in the strictest confidence and with no
          liability accepted by the company or any of our employees. This
          information should not be divulged to any third party.
        </p>

        <p className="mt-2">
          Should you require any further information, please do not hesitate to
          contact me via email {formData.email || "email@example.com"}.
        </p>

        <p className="mt-6">Yours sincerely,</p>
        <p className="mt-2 font-semibold">{formData.name || "Employee Name"}</p>
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
          {loading ? "Processing..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default SalaryCertificate;