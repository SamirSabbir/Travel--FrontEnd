import React, { useEffect, useState } from "react";
import axios from "../../api/axios"; // Adjust the path if needed
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const AdminPipeline = () => {
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPipeline = async () => {
      try {
        const res = await axios.get("/works/admin-pipeline");
        setPipelines(res.data.data || []);
      } catch (error) {
        toast.error(error || "Failed to fetch pipeline data");
      } finally {
        setLoading(false);
      }
    };

    fetchPipeline();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Admin Pipeline
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm font-medium text-gray-700">
                <th className="px-6 py-3 border-b">#</th>
                <th className="px-6 py-3 border-b">Customer Name</th>
                <th className="px-6 py-3 border-b">Phone</th>
                <th className="px-6 py-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {pipelines.map((pipeline, index) => (
                <tr
                  key={pipeline._id}
                  className="bg-white hover:bg-gray-50 transition-all border-b"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {pipeline.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {pipeline.phone}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        pipeline.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {pipeline.status.charAt(0).toUpperCase() +
                        pipeline.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {pipelines.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No pipeline data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPipeline;
