import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format, differenceInDays } from "date-fns";
import { toast } from "react-toastify";

const TourPackage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCalendarId, setOpenCalendarId] = useState(null);
  // Search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter data based on search term
  const filteredData = packages.filter(
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

  const countries = [
    "France",
    "UK",
    "Canada",
    "Australia",
    "Sweden",
    "USA",
    "Thailand",
    "Singapore",
    "Germany",
    "South Korea",
    "Japan",
    "UAE",
    "Portugal",
    "Netherland",
    "Belgium",
    "Poland",
    "Finland",
    "Denmark",
    "Estonia",
    "Austria",
    "Czech Republic",
    "Iceland",
    "Slovenia",
    "Latvia",
    "Norway",
    "Nepal",
    "China",
    "Luxembourg",
    "Kenya",
    "New Zealand",
  ];

  // Fetch tour packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get("/tourPackage/user");

        // Handle both array and single object responses
        if (Array.isArray(response.data)) {
          setPackages(
            response.data.map((pkg) => ({
              ...pkg,
              dates: pkg.dates || { from: null, to: null },
            }))
          );
        } else if (response.data && typeof response.data === "object") {
          setPackages([
            {
              ...response.data,
              dates: response.data.dates || { from: null, to: null },
            },
          ]);
        } else {
          setPackages([]);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Handle date change
  const handleDateChange = (id, field, value) => {
    setPackages((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          const updatedNight = {
            ...item.night,
            [field]: value,
          };

          return {
            ...item,
            night: updatedNight, // store { from, to }
          };
        }
        return item;
      })
    );
  };

  // Handle input changes
  const handleInputChange = (packageId, field, value) => {
    const updatedPackages = packages.map((item) => {
      if (item._id === packageId) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setPackages(updatedPackages);
  };

  // Handle save action
  const handleSave = async (packageId) => {
    try {
      const packageItem = packages.find((p) => p._id === packageId);
      if (packageItem) {
        // Prepare data for API - convert dates to ISO strings
        const dataToSave = {
          ...packageItem,
          night: {
            from: packageItem.night?.from
              ? packageItem.night.from.toISOString()
              : null,
            to: packageItem.night?.to
              ? packageItem.night.to.toISOString()
              : null,
          },
        };

        await axios.patch(`/tourPackage/${packageItem._id}`, dataToSave);
        toast.success("Package updated successfully!");
      }
    } catch (err) {
      toast.error("Error updating package: " + err.message);
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
        <h1 className="text-2xl font-bold">Tour Package Management</h1>
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
                Country
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transfer
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nights
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hotel
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sight Seeing
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flights
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Price
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.isArray(currentItems) && currentItems.length > 0 ? (
              currentItems.map((packageItem, index) => (
                <tr key={packageItem._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {packageItem.workId?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {packageItem.workId?.uuId || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={packageItem.country || ""}
                      onChange={(e) =>
                        handleInputChange(
                          packageItem._id,
                          "country",
                          e.target.value
                        )
                      }
                      className=" px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={packageItem.transfer || ""}
                      onChange={(e) =>
                        handleInputChange(
                          packageItem._id,
                          "transfer",
                          e.target.value
                        )
                      }
                      className=" px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                    {/* Clickable field for date range */}
                    <div
                      className="border rounded px-2 py-1 cursor-pointer bg-white min-w-[180px]"
                      onClick={() =>
                        setOpenCalendarId(
                          openCalendarId === packageItem._id
                            ? null
                            : packageItem._id
                        )
                      }
                    >
                      {packageItem.night?.from && packageItem.night?.to
                        ? `${format(
                            new Date(packageItem.night.from),
                            "MMM d, yyyy"
                          )} → ${format(
                            new Date(packageItem.night.to),
                            "MMM d, yyyy"
                          )}`
                        : "Select dates"}
                    </div>

                    {openCalendarId === packageItem._id && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                          <DateRange
                            ranges={[
                              {
                                startDate: packageItem.night?.from
                                  ? new Date(packageItem.night.from)
                                  : new Date(),
                                endDate: packageItem.night?.to
                                  ? new Date(packageItem.night.to)
                                  : new Date(),
                                key: "selection",
                              },
                            ]}
                            onChange={(ranges) => {
                              handleDateChange(
                                packageItem._id,
                                "from",
                                ranges.selection.startDate
                              );
                              handleDateChange(
                                packageItem._id,
                                "to",
                                ranges.selection.endDate
                              );
                            }}
                            moveRangeOnFirstSelection={false}
                            rangeColors={["#2563eb"]}
                          />

                          {/* Close button */}
                          <div className="flex justify-end mt-2">
                            <button
                              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                              onClick={() => setOpenCalendarId(null)}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={packageItem.hotel || ""}
                      onChange={
                        (e) =>
                          handleInputChange(
                            packageItem._id,
                            "hotel",
                            e.target.value
                          ) // ✅ fix
                      }
                      className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={packageItem.sightSeeing || ""}
                      onChange={
                        (e) =>
                          handleInputChange(
                            packageItem._id,
                            "sightSeeing",
                            e.target.value
                          ) // ✅ fix
                      }
                      className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={packageItem.flights || ""}
                      onChange={
                        (e) =>
                          handleInputChange(
                            packageItem._id,
                            "flights",
                            e.target.value
                          ) // ✅ fix
                      }
                      className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={packageItem.totalPrice || ""}
                      onChange={
                        (e) =>
                          handleInputChange(
                            packageItem._id,
                            "totalPrice",
                            e.target.value
                          ) // ✅ fix
                      }
                      className="w-[90px] px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleSave(packageItem._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-6 py-4 text-center">
                  No tour packages found
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

export default TourPackage;
