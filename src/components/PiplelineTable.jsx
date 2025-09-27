import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { Loader2, ChevronDown } from "lucide-react";

const PipelineTable = ({ userRole }) => {
  const [pipeline, setPipeline] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const pipelineStatusOptions = [
    "choose an option",
    "Confirmed",
    "Follow-up 1",
    "Follow-up 2",
  ];

  const statusColors = {
    Confirmed: "bg-blue-100 text-blue-800",
    "Follow-up 1": "bg-orange-100 text-orange-800",
    "Follow-up 2": "bg-red-100 text-red-800",
  };

  const fetchPipeline = async () => {
    setIsLoading(true);
    try {
      const pipelineEndpoint =
        userRole === "SuperAdmin"
          ? "/works/my-admin-pipeline"
          : "/works/pipeline";

      const res = await axios.get(pipelineEndpoint);
      const normalized = res.data.data.map((item) => {
        
        console.log(item);
      return  (
        
        {
        ...item,
        
        status: pipelineStatusOptions.includes(item.leadsStatus)
          ? item.leadsStatus
          : "choose an option",
      })
      } );
      

      setPipeline(normalized);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    if (newStatus === "choose an option") return; // ignore invalid updates

    setUpdatingId(itemId);

    try {
      await axios.patch(`/leads/confirm-Leads-workId/${itemId}`, {
        status: newStatus,
      });

      // Update the local state immediately
      setPipeline((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, status: newStatus } : item
        )
      );

      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      // Refresh the data if there was an error
      fetchPipeline();
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!pipeline || pipeline.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No items in pipeline yet. Mark sales as "Very Interested" to add them
        here.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Customer Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Phone Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pipeline.map((item) => {
            const isDisabled = updatingId === item._id;
            const displayStatus = pipelineStatusOptions.includes(item.leadsStatus)
              ? item.leadsStatus
              : "choose an option";

            return (
              <tr key={item._id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.phone}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      statusColors[item.leadsStatus] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {displayStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="relative">
                    <select
                      value={displayStatus}
                      onChange={(e) =>
                        handleStatusChange(item._id, e.target.value)
                      }
                      disabled={isDisabled}
                      className={`appearance-none border rounded-lg px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-300
    ${statusColors[item.leadsStatus] || "bg-gray-100 text-gray-800"}
    ${isDisabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
  `}
                    >
                      {pipelineStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="absolute right-2 top-3 h-4 w-4 pointer-events-none" />
                  </div>
                  {updatingId === item._id && (
                    <div className="flex items-center gap-2 text-blue-600 text-xs mt-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Updating...
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PipelineTable;
