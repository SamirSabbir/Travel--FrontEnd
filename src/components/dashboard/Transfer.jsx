import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import getEnhancedTransferTypeColor from "../../utils/transferColor";
import { Car, ChevronDown } from "lucide-react";
import getPremiumTransferTypeColor from "../../utils/transferColor";
import getEnhancedCarTypeColor from "../../utils/carTypeColor";
const Transfer = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter data based on search term
  const filteredData = transfers.filter(
    (item) =>
      item && // make sure item is not null
      (item?.workId?.uuId || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const transferTypes = [
    "Airport Pick-up",
    "Airport Drop-off",
    "Private Transfer",
    "Helicopter",
    "Speed Boat",
    "Yatch",
  ];

  const carTypes = [
    "Sedan",
    "SUV",
    "MPV",
    "Minivan",
    "Minibus",
    "Luxury car",
    "Van",
    "Bus",
  ];

  // Get color based on transfer type
  const getTransferTypeColor = (type) => {
    switch (type) {
      case "Airport Pick-up":
        return "bg-blue-100 text-blue-800";
      case "Airport Drop-off":
        return "bg-green-100 text-green-800";
      case "Private Transfer":
        return "bg-purple-100 text-purple-800";
      case "Helicopter":
        return "bg-red-100 text-red-800";
      case "Speed Boat":
        return "bg-indigo-100 text-indigo-800";
      case "Yatch":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get color based on car type
  const getCarTypeColor = (type) => {
    switch (type) {
      case "Sedan":
        return "bg-blue-100 text-blue-800";
      case "SUV":
        return "bg-green-100 text-green-800";
      case "MPV":
        return "bg-purple-100 text-purple-800";
      case "Minivan":
        return "bg-red-100 text-red-800";
      case "Minibus":
        return "bg-indigo-100 text-indigo-800";
      case "Luxury car":
        return "bg-amber-100 text-amber-800";
      case "Van":
        return "bg-teal-100 text-teal-800";
      case "Bus":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fetch transfers from API
  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const response = await axios.get("/transfer/user");

        // Handle both array and single object responses
        if (Array.isArray(response.data)) {
          setTransfers(response.data);
        } else if (response.data && typeof response.data === "object") {
          setTransfers([response.data]);
        } else {
          setTransfers([]);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTransfers();
  }, []);

  // Handle input changes
  const handleInputChange = (index, field, value) => {
    const updatedTransfers = [...transfers];
    updatedTransfers[index][field] = value;
    setTransfers(updatedTransfers);
  };

  // Handle passenger count change
  const handlePassengerChange = (transferId, value) => {
    const updatedTransfers = transfers.map((item) => {
      if (item._id === transferId) {
        return { ...item, passenger: Math.max(0, value) };
      }
      return item;
    });
    setTransfers(updatedTransfers);
  };

  // Handle save action
  const handleSave = async (transferId) => {
    try {
      const transfer = transfers.find((t) => t._id === transferId);
      if (transfer) {
        await axios.patch(`/transfer/${transfer._id}`, transfer);
        toast.success("Transfer updated successfully!");
      }
    } catch (err) {
      toast.error("Error updating transfer: " + err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  if (error)
    return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transfer Management</h1>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search by Unique ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-2 w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unique ID
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transfer Type
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Car Type
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Passenger
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.isArray(currentItems) && currentItems.length > 0 ? (
              currentItems.map((transfer, index) => (
                <tr key={transfer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transfer.workId?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transfer.workId?.uuId || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-3 min-w-[280px]">
                      {/* Large Professional Select */}
                      <div className="relative">
                        <select
                          value={transfer.transferType || ""}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "transferType",
                              e.target.value
                            )
                          }
                          className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl bg-white text-gray-900 text-lg font-semibold transition-all duration-300
                   focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:bg-blue-50
                   hover:border-blue-400 hover:bg-blue-25 hover:shadow-lg
                   appearance-none cursor-pointer shadow-md"
                        >
                          <option
                            value=""
                            className="text-gray-500 text-lg py-3"
                          >
                            Select Transfer Type
                          </option>
                          {transferTypes.map((type) => (
                            <option
                              key={type}
                              value={type}
                              className="text-gray-800 text-lg py-3 font-medium hover:bg-blue-100"
                            >
                              {type}
                            </option>
                          ))}
                        </select>

                        {/* Enhanced Custom Chevron */}
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="time"
                      value={transfer.time || ""}
                      onChange={(e) =>
                        handleInputChange(index, "time", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="date"
                      value={
                        transfer.date
                          ? new Date(transfer.date).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange(index, "date", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-3 min-w-[220px]">
                      {/* Enhanced Car Type Select */}
                      <div className="relative group">
                        <select
                          value={transfer.carType || ""}
                          onChange={(e) =>
                            handleInputChange(index, "carType", e.target.value)
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 font-semibold transition-all duration-300
                   focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:bg-purple-50
                   hover:border-purple-300 hover:bg-purple-25 hover:shadow-lg
                   appearance-none cursor-pointer shadow-sm"
                        >
                          <option
                            value=""
                            className="text-gray-500 font-medium"
                          >
                            🚘 Select Car Type
                          </option>
                          {carTypes.map((type) => (
                            <option
                              key={type}
                              value={type}
                              className="text-gray-800 font-medium py-2 hover:bg-purple-100"
                            >
                              {type}
                            </option>
                          ))}
                        </select>

                        {/* Custom Chevron */}
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover:scale-110">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button
                        className="bg-gray-200 hover:bg-gray-300 rounded-l px-2 py-1"
                        onClick={() =>
                          handlePassengerChange(
                            transfer._id, // Changed from 'index' to 'transfer._id'
                            (transfer.passenger || 0) - 1
                          )
                        }
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-t border-b border-gray-200 min-w-[2rem] text-center">
                        {transfer.passenger || 0}
                      </span>
                      <button
                        className="bg-gray-200 hover:bg-gray-300 rounded-l px-2 py-1"
                        onClick={() =>
                          handlePassengerChange(
                            transfer._id,
                            (transfer.passenger || 0) + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative">
                      <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-100 transition-all duration-200 shadow-sm">
                        {/* Compact Currency */}
                        <div className="pl-3 pr-2 py-2">
                          <span className="text-base font-bold text-blue-600">
                            ৳
                          </span>
                        </div>

                        {/* Compact Input */}
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={transfer.amount || ""}
                          onChange={(e) =>
                            handleInputChange(index, "amount", e.target.value)
                          }
                          placeholder="0.00"
                          className="w-24 px-3 py-2 bg-transparent border-none outline-none text-gray-900 font-semibold text-base placeholder-gray-400 focus:bg-blue-50 rounded-r-lg"
                        />
                      </div>

                      {/* Mini Amount Badge */}
                      {transfer.amount && (
                        <div className="absolute -top-1 -right-1">
                          <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white shadow-md">
                            ৳
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleSave(transfer._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center">
                  No transfers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <span className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} entries
          </span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 border rounded ${
                  currentPage === pageNum ? "bg-blue-500 text-white" : ""
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
