import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import LeadsTable from "../leads/LeadsTable";
import LeadsBoard from "../leads/LeadsBoard";
import AddLeadModal from "../leads/AddLeadModal";
import { formatDate } from "../leads/utils";
import { Plus } from "lucide-react";

const Leads = ({ userRole }) => {
  const [leads, setLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    description: "",
  });
  const [assigningId, setAssigningId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      const res = await axios.get("/users/findAllUsers"); //use findAllUsers
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
        setIsModalOpen(false);
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
      fetchLeads();
    } catch (err) {
      toast.error("Failed to assign lead");
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Leads Management</h2>
        {userRole?.toLowerCase() === "superadmin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={18} /> Create Lead
          </button>
        )}
      </div>

      <AddLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleAddLead}
      />

      <LeadsTable
        leads={leads}
        employees={employees}
        assigningId={assigningId}
        handleAssignLead={handleAssignLead}
        formatDate={formatDate}
      />

      <LeadsBoard
        leads={leads}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        formatDate={formatDate}
      />
    </div>
  );
};

export default Leads;
