import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const Leads = ({ userRole }) => {
  const [leads, setLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    description: "",
  });
  const [assigningId, setAssigningId] = useState(null);

  useEffect(() => {
    fetchLeads();
    fetchEmployees();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get("/leads/");
      if (res.data.success) {
        setLeads(res.data.data);
      } else {
        toast.error("Failed to load leads");
      }
    } catch (err) {
      toast.error("Error fetching leads");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/users/findEmployeeUsers");
      if (res.data.success) {
        setEmployees(res.data.data);
      } else {
        toast.error("Failed to load employees");
      }
    } catch (err) {
      toast.error("Error fetching employees");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    const { customerName, customerPhone, description } = formData;
    if (!customerName || !customerPhone || !description) {
      return toast.error("Please fill all fields");
    }

    try {
      const res = await axios.post("/leads/create-lead", formData);
      if (res.data.success) {
        setLeads((prev) => [...prev, res.data.data]);
        toast.success("Lead created successfully!");
        setFormData({ customerName: "", customerPhone: "", description: "" });
      } else {
        toast.error("Failed to create lead");
      }
    } catch (err) {
      toast.error("Error adding lead");
    }
  };

  const handleAssignLead = async (leadId, email) => {
    setAssigningId(leadId);
    try {
      await axios.patch(`/leads/assign/${leadId}`, { email });
      toast.success("Lead assigned successfully!");
      fetchLeads(); // refresh leads
    } catch (err) {
      toast.error("Failed to assign lead");
    } finally {
      setAssigningId(null);
    }
  };

  //search leads
  const [searchQuery, setSearchQuery] = useState("");
  const filteredLeads = leads.filter((lead) =>
    lead.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Leads</h2>

      {/* ✅ SuperAdmin Form to Add Lead */}
      {userRole?.toLowerCase() === "superadmin" && (
        <form
          onSubmit={handleAddLead}
          className="bg-white border rounded-xl p-6 space-y-4 shadow max-w-2xl"
        >
          <h3 className="text-lg font-semibold text-gray-700">Add New Lead</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Customer Name"
              className="border rounded px-3 py-2 w-full"
              required
            />
            <input
              type="text"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="border rounded px-3 py-2 w-full"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add Lead
          </button>
        </form>
      )}

      {/* ✅ Table to Show Leads */}
      <div className="overflow-x-auto bg-white shadow rounded-xl border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Assign To</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td className="px-4 py-3 font-medium">{lead.customerName}</td>
                <td className="px-4 py-3">{lead.customerPhone}</td>
                <td className="px-4 py-3 text-gray-600">{lead.description}</td>
                <td className="px-4 py-3">
                  <select
                    className="w-full border px-2 py-1 rounded text-sm"
                    onChange={(e) => handleAssignLead(lead._id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Employee
                    </option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp.email}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  {assigningId === lead._id ? (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Loader2 className="animate-spin w-4 h-4" />
                      Assigning...
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm italic">Idle</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ✅ Lead Assignment Board View */}
      <div className="bg-white shadow border rounded-xl p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Lead Assignment Board
        </h3>

        {/* 🔍 Search Field */}
        <input
          type="text"
          placeholder="Search customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border px-4 py-2 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* 🧾 Assignment Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => {
            const isAssigned = lead.assigns?.length > 0;
            const assignedTo = isAssigned
              ? lead.assigns.join(", ")
              : "Not Assigned";
            const assignedBy = lead.adminEmail || "Unknown";

            return (
              <div
                key={lead._id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-all bg-gray-50"
              >
                <p className="font-semibold text-gray-800">
                  Customer:{" "}
                  <span className="text-blue-600">{lead.customerName}</span>
                </p>
                <p className="text-sm text-gray-700">
                  Assigned To:{" "}
                  <span
                    className={isAssigned ? "text-green-600" : "text-red-500"}
                  >
                    {assignedTo}
                  </span>
                </p>
                <p className="text-sm text-gray-700">
                  Assigned By:{" "}
                  <span className="text-indigo-500">{assignedBy}</span>
                </p>
              </div>
            );
          })}
        </div>

        {filteredLeads.length === 0 && (
          <p className="text-gray-500 text-sm mt-4">No customers found.</p>
        )}
      </div>
    </div>
  );
};

export default Leads;
