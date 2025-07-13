import React, { useState } from "react";

const fieldMap = {
  "Air Ticket": [
    { name: "airline", label: "Airline Name" },
    { name: "ticketNumber", label: "Ticket Number" },
    { name: "passenger", label: "Passenger Name" },
  ],
  "Visa Processing": [
    { name: "visaType", label: "Visa Type" },
    { name: "applicationId", label: "Application ID" },
  ],
  Hotel: [
    { name: "hotelName", label: "Hotel Name" },
    { name: "checkinDate", label: "Check-in Date", type: "date" },
    { name: "nights", label: "Number of Nights", type: "number" },
  ],
  Transport: [
    { name: "vehicleType", label: "Vehicle Type" },
    { name: "pickupLocation", label: "Pickup Location" },
  ],
  "Appointment Date": [
    { name: "date", label: "Date", type: "date" },
    { name: "time", label: "Time", type: "time" },
  ],
  Package: [
    { name: "packageName", label: "Package Name" },
    { name: "price", label: "Price", type: "number" },
  ],
  Country: [
    { name: "countryName", label: "Country Name" },
    { name: "visaCategory", label: "Visa Category" },
  ],
  "Airport Code": [
    { name: "airportName", label: "Airport Name" },
    { name: "code", label: "Airport Code" },
  ],
};

const Invoice = ({ userRole }) => {
  const options = Object.keys(fieldMap);

  const [selectedType, setSelectedType] = useState("Air Ticket");
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [invoices, setInvoices] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newInvoice = {
      type: selectedType,
      fileName: file?.name || "No File",
      fields: { ...formData },
    };
    setInvoices((prev) => [...prev, newInvoice]);
    setFile(null);
    setFormData({});
    alert("Invoice saved!");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Invoice Upload</h2>

      {/* Dropdown */}
      <div className="mb-4 max-w-md">
        <label className="block font-medium mb-1">Select Type</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        {/* Upload */}
        <div>
          <label className="block font-medium mb-1">Upload File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
            className="w-full"
            required
          />
        </div>

        {/* Dynamic Inputs */}
        {fieldMap[selectedType].map(({ name, label, type = "text" }) => (
          <div key={name}>
            <label className="block font-medium mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Invoice
        </button>
      </form>

      {/* Display Submitted Invoices */}
      {invoices.length > 0 && (
        <div className="mt-10 max-w-4xl">
          <h3 className="text-lg font-semibold mb-4">Submitted Invoices</h3>
          <div className="space-y-6">
            {invoices.map((inv, i) => (
              <div
                key={i}
                className="bg-white border rounded shadow p-4"
              >
                <p className="font-bold text-blue-600 mb-1">
                  {i + 1}. Type: {inv.type}
                </p>
                <p><strong>File:</strong> {inv.fileName}</p>
                <ul className="ml-4 mt-2 list-disc text-sm">
                  {Object.entries(inv.fields).map(([key, val]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {val}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
