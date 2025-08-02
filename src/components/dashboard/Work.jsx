import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { Loader2, Save } from "lucide-react";

const Work = ({ userRole }) => {
  const [workData, setWorkData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchWorks = async () => {
    try {
      const res = await axios.get("/works/my-works");
      setWorkData(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch work data");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/users/findEmployeeUsers");
      setEmployees(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    Promise.all([fetchWorks(), fetchEmployees()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const handleUpdate = async (id, updatedFields) => {
    setUpdatingId(id);
    try {
      if (userRole.toLowerCase() === "account admin") {
        await axios.patch(`/works/update-work-account-admin/${id}`, {
          payment: updatedFields.payment,
        });
      } else {
        await axios.patch(`/works/update-work-employee/${id}`, updatedFields);
      }
      toast.success("Work updated successfully");
      await fetchWorks();
    } catch (err) {
      toast.error("Failed to update work");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFieldChange = (id, field, value) => {
    setWorkData((prev) =>
      prev.map((w) => (w._id === id ? { ...w, [field]: value } : w))
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Assigned Works</h2>
      <div className="overflow-auto rounded-xl border shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                "Name",
                "Pax",
                "Country",
                "Submission Date",
                "Payment",
                "Transfer",
                "Status",
                "Actions",
              ].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left font-semibold border-b"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {workData.map((work) => (
              <tr
                key={work._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2 font-medium text-gray-900">
                  {work.name}
                </td>

                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={work.pax || ""}
                    onChange={(e) =>
                      handleFieldChange(work._id, "pax", e.target.value)
                    }
                    className="w-full border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </td>

                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={work.country || ""}
                    onChange={(e) =>
                      handleFieldChange(work._id, "country", e.target.value)
                    }
                    className="w-full border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </td>

                <td className="px-4 py-2">
                  <input
                    type="date"
                    value={work.submissionDate?.slice(0, 10) || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        work._id,
                        "submissionDate",
                        e.target.value
                      )
                    }
                    className="w-full border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </td>

                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={work.payment || ""}
                    onChange={(e) =>
                      handleFieldChange(work._id, "payment", e.target.value)
                    }
                    className="w-full border-gray-300 rounded px-2 py-1 text-sm"
                    disabled={
                      userRole.toLowerCase() !== "account admin" &&
                      userRole.toLowerCase() !== "admin"
                    }
                  />
                </td>

                <td className="px-4 py-2">
                  <select
                    value={work.transfer || ""}
                    onChange={(e) =>
                      handleFieldChange(work._id, "transfer", e.target.value)
                    }
                    className="w-full border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="">Select</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp.name}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* ✅ NEW: Status column */}
                <td className="px-4 py-2">
                  <select
                    value={work.status || "pending"}
                    onChange={(e) =>
                      handleFieldChange(work._id, "status", e.target.value)
                    }
                    className="w-full border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                    <option value="more_info">Pending More Info</option>
                  </select>
                </td>

                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() =>
                      handleUpdate(work._id, {
                        pax: work.pax,
                        country: work.country,
                        submissionDate: work.submissionDate,
                        payment: work.payment,
                        transfer: work.transfer,
                        status: work.status, // ✅ Include status in update
                      })
                    }
                    disabled={updatingId === work._id}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center justify-center gap-1"
                  >
                    {updatingId === work._id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Update
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Work;
