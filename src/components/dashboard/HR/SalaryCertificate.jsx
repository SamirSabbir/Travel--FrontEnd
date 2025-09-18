import React, { useState } from "react";

const SalaryCertificate = () => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    joiningDate: "",
    monthlySalary: "",
    requestDate: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Call your API here (Save as draft or create request)
    console.log("Saving certificate:", formData);
  };

  const handleSend = () => {
    // API call for sending certificate (approved flow)
    console.log("Sending certificate:", formData);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 border border-gray-300">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Trip & Travel</h1>
        <p className="text-gray-500">Salary Certificate</p>
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
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Position"
        />
        <input
          type="date"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="monthlySalary"
          value={formData.monthlySalary}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Monthly Salary"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Employee Email"
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

export default SalaryCertificate;
