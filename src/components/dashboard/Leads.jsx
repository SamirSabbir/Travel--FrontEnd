import React, { useState } from "react";

const Leads = ({ userRole }) => {
  const [leads, setLeads] = useState([
    { id: 1, name: "Alice", phone: "01711-123456" },
    { id: 2, name: "Bob", phone: "01822-654321" },
  ]);

  const [formData, setFormData] = useState({ name: "", phone: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddLead = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setLeads((prev) => [
      ...prev,
      { id: prev.length + 1, name: formData.name, phone: formData.phone },
    ]);

    setFormData({ name: "", phone: "" });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Leads</h2>

      {/* Admin Only: Add Form */}
      {userRole === "admin" && (
        <form onSubmit={handleAddLead} className="mb-6 space-y-3 max-w-md">
          <div>
            <label className="block font-semibold mb-1">Customer Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Lead
          </button>
        </form>
      )}

      {/* Common: Lead List */}
      <div className="max-w-md">
        <h3 className="font-semibold mb-2">Lead List</h3>
        <ul className="border rounded divide-y bg-white">
          {leads.map((lead) => (
            <li
              key={lead.id}
              className="px-4 py-2 flex justify-between items-center"
            >
              <span>{lead.name}</span>
              <span>{lead.phone}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leads;
