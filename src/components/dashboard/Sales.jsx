import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { Loader2, ChevronDown } from "lucide-react";

const Sales = ({ userRole }) => {
  const [mySales, setMySales] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can adjust this

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

  const normalizeSalesData = (salesData) =>
    salesData.map((sale) => ({
      ...sale,
      status: sale.isConfirmed || "New lead",
    }));

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const salesRes = await axios.get("/leads/my-leads");
      const normalizedSales = normalizeSalesData(salesRes.data.data);
      setMySales(normalizedSales);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (saleId, workId, newStatus) => {
    setUpdatingId(saleId);
    console.log("item id from Leads", saleId);
    try {
      const endpoint = `/leads/confirm-leads/${saleId}`;
      const payload = { status: newStatus };

      await axios.patch(endpoint, payload);
      await fetchSales();

      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      fetchSales();
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Pagination logic
  const totalItems = mySales.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = mySales.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">
      {/* My Sales Table */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          {userRole === "SuperAdmin" ? "My lead" : "My leads"}
        </h2>
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
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((sale) => {
                const isDisabled =
                  updatingId === sale._id || sale.status === "Confirmed";

                return (
                  <tr key={sale._id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {sale.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {sale.phoneNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {sale.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="relative">
                        <select
                          value={sale.status}
                          onChange={(e) =>
                            handleStatusChange(
                              sale._id,
                              sale.workId,
                              e.target.value
                            )
                          }
                          disabled={isDisabled}
                          className={`appearance-none border rounded-lg px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-300
                            ${statusColors[sale.status]}
                            ${
                              isDisabled
                                ? "cursor-not-allowed opacity-70"
                                : "cursor-pointer"
                            }`}
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
                        <ChevronDown className="absolute right-2 top-3 h-4 w-4 pointer-events-none" />
                      </div>
                      {updatingId === sale._id && (
                        <div className="flex items-center gap-2 text-blue-600 text-xs mt-1">
                          <Loader2 className="w-3 h-3 animate-spin" />{" "}
                          Updating...
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center px-6 py-3 bg-gray-50 border-t">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{startIndex + 1}</span>–
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, totalItems)}
              </span>{" "}
              of <span className="font-medium">{totalItems}</span> results
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-100"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded-lg border text-sm ${
                      page === currentPage
                        ? "bg-blue-500 text-white border-blue-500"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sales;
