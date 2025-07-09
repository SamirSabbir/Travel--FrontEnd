import React, { useState } from "react";

const Sales = ({ userRole }) => {
  // Dummy leads list
  const leads = [
    { id: 1, name: "Alice", phone: "01711-123456" },
    { id: 2, name: "Bob", phone: "01822-654321" },
  ];

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    country: "",
    description: "",
    lastCallDate: "",
    followUpDate: "",
    duePayment: "",
  });

  // List of sales entries
  const [salesRecords, setSalesRecords] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRecord = {
      id: salesRecords.length + 1,
      customer: selectedCustomer,
      ...formData,
    };

    setSalesRecords((prev) => [...prev, newRecord]);

    // Reset form
    setSelectedCustomer(null);
    setFormData({
      country: "",
      description: "",
      lastCallDate: "",
      followUpDate: "",
      duePayment: "",
    });

    alert("Sales info submitted!");
  };

  if (userRole === "admin") {
    return (
      <div className="text-red-500 text-center mt-10 text-lg font-semibold">
        ❌ Admin is not authorized to manage sales.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Sales</h2>

      {/* Select Customer */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Select a Customer</h3>
        <ul className="bg-white border rounded divide-y max-w-md">
          {leads.map((lead) => (
            <li
              key={lead.id}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                selectedCustomer?.id === lead.id ? "bg-blue-100 font-semibold" : ""
              }`}
              onClick={() => setSelectedCustomer(lead)}
            >
              {lead.name} - {lead.phone}
            </li>
          ))}
        </ul>
      </div>

      {/* Sales Input Form */}
      {selectedCustomer && (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mb-10">
          <div>
            <label className="block font-semibold mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Last Call Date</label>
            <input
              type="date"
              name="lastCallDate"
              value={formData.lastCallDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Follow-up Call Date</label>
            <input
              type="date"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Due Payment</label>
            <input
              type="number"
              name="duePayment"
              value={formData.duePayment}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Sales Info
          </button>
        </form>
      )}

      {/* Sales Record List */}
      {salesRecords.length > 0 && (
        <div className="mt-6 max-w-3xl">
          <h3 className="text-lg font-semibold mb-4">Submitted Sales Records</h3>
          <div className="space-y-4">
            {salesRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white p-4 rounded shadow border"
              >
                <p className="font-semibold text-blue-600">
                  {record.customer.name} ({record.customer.phone})
                </p>
                <p><strong>Country:</strong> {record.country}</p>
                <p><strong>Description:</strong> {record.description}</p>
                <p><strong>Last Call Date:</strong> {record.lastCallDate}</p>
                <p><strong>Follow-up Call:</strong> {record.followUpDate}</p>
                <p><strong>Due Payment:</strong> ${record.duePayment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
