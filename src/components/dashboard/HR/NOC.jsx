import React, { useState } from "react";

const NOC = () => {
  const [formData, setFormData] = useState({
    name: "",
    passport: "",
    joiningDate: "",
    position: "",
    country: "",
    visitFrom: "",
    visitTo: "",
    purpose: "",
    email: "",
    requestDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Saving NOC:", formData);
    // API call to save as draft
  };

  const handleSend = () => {
    console.log("Sending NOC:", formData);
    // API call to send request
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 border border-gray-300">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Trip & Travel</h1>
        <p className="text-gray-500">No Objection Certificate</p>
      </div>

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
          placeholder="Employee Name"
        />
        <input
          type="text"
          name="passport"
          value={formData.passport}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Passport No"
        />
        <input
          type="date"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Position"
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Destination Country"
        />
        <input
          type="date"
          name="visitFrom"
          value={formData.visitFrom}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          name="visitTo"
          value={formData.visitTo}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <select
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Purpose</option>
          <option value="Business">Business</option>
          <option value="Tourism">Tourism</option>
          <option value="Medical">Medical</option>
        </select>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Email"
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
            {formData.passport || "---------"}
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
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Save
        </button> */}
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default NOC;
