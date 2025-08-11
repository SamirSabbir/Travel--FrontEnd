import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const Sales = ({ userRole }) => {
  const [mySales, setMySales] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const statusOptions = [
    "New lead",
    "Confirmed",
    "Very Interested",
    "Follow-up",
    "Follow-up 1",
    "Follow-up 2",
  ];

  const statusColors = {
    "New lead": "bg-gray-100 text-gray-800",
    Confirmed: "bg-blue-100 text-blue-800",
    "Very Interested": "bg-purple-100 text-purple-800",
    "Follow-up": "bg-yellow-100 text-yellow-800",
    "Follow-up 1": "bg-orange-100 text-orange-800",
    "Follow-up 2": "bg-red-100 text-red-800",
  };

  // Normalize the sales data to use 'status' field consistently
  const normalizeSalesData = (salesData) => {
    return salesData.map((sale) => ({
      ...sale,
      status: sale.isConfirmed || "New lead", // Use isConfirmed as status
    }));
  };

  // Fetch all data
  const fetchData = async () => {
    console.log("current user role:", userRole);
    setIsLoading(true);
    try {
      // Fetch sales data
      const salesEndpoint =
        userRole === "superAdmin" ? "/sales/all-sales" : "/sales/my-sales";
      const salesRes = await axios.get(salesEndpoint);

      // Normalize the data to use consistent field names
      const normalizedSales = normalizeSalesData(salesRes.data.data);
      setMySales(normalizedSales);

      // Fetch pipeline data - different endpoint for superAdmin
      const pipelineEndpoint =
        userRole === "superAdmin" ? "/my-admin-pipeline" : "/works/pipeline";
      console.log("fetching pipeline from:", pipelineEndpoint);

      const pipelineRes = await axios.get(pipelineEndpoint);
      setPipeline(pipelineRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Status Change
  const handleStatusChange = async (saleId, workId, newStatus) => {
    setUpdatingId(saleId);
    try {
      // First update the backend
      const endpoint =
        userRole === "superAdmin"
          ? `/works/update-work-super-admin/${workId}`
          : `/sales/confirm-sales/${saleId}`;

      await axios.patch(endpoint, {
        isConfirmed: newStatus, // Send as isConfirmed to match backend
      });

      // Then update local state
      setMySales((prevSales) =>
        prevSales.map((sale) =>
          sale._id === saleId ? { ...sale, status: newStatus } : sale
        )
      );

      // Update pipeline if needed
      if (newStatus === "Very Interested") {
        const pipelineEndpoint =
          userRole === "superAdmin" ? "/my-admin-pipeline" : "/works/pipeline";
        console.log("Updating pipeline from:", pipelineEndpoint);
        const pipelineRes = await axios.get(pipelineEndpoint);
        setPipeline(pipelineRes.data.data);
      }

      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      // Refresh data if update fails
      fetchData();
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">
      {/* My Sales */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          {userRole === "superAdmin" ? "All Sales" : "My Sales"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {mySales.map((sale) => {
            const isDisabled =
              updatingId === sale._id || sale.status === "Very Interested";

            return (
              <div
                key={sale._id}
                className="bg-white shadow-lg rounded-2xl p-5 border border-gray-200"
              >
                <div className="text-lg font-semibold">{sale.customerName}</div>
                <div className="text-sm text-gray-600">{sale.phoneNumber}</div>
                <p className="text-gray-700 mt-2">{sale.description}</p>

                {userRole === "superAdmin" && sale.employee && (
                  <div className="text-sm text-gray-500 mt-1">
                    Employee: {sale.employee.name}
                  </div>
                )}

                {/* Status Dropdown */}
                <div className="mt-4">
                  <select
                    value={sale.status}
                    onChange={(e) =>
                      handleStatusChange(sale._id, sale.workId, e.target.value)
                    }
                    disabled={isDisabled}
                    className={`
                      border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-300
                      ${statusColors[sale.status]}
                      ${
                        isDisabled
                          ? "cursor-not-allowed opacity-70"
                          : "cursor-pointer"
                      }
                    `}
                  >
                    {statusOptions.map((status) => (
                      <option
                        key={status}
                        value={status}
                        className={statusColors[status]}
                      >
                        {status}
                      </option>
                    ))}
                  </select>

                  {updatingId === sale._id && (
                    <div className="flex items-center gap-2 text-blue-600 text-sm mt-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pipeline View */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Pipeline</h2>
        {pipeline.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No items in pipeline yet. Mark sales as "Very Interested" to add
            them here.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {pipeline.map((item) => (
              <div
                key={item._id}
                className="bg-slate-100 border border-gray-300 rounded-xl p-4 shadow-sm"
              >
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-gray-600 text-sm">{item.phone}</p>
                <span className="inline-block mt-2 text-xs font-semibold text-white bg-purple-500 px-2 py-1 rounded-full capitalize">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Sales;
