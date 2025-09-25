import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Plus,
  Trash2,
  Save,
  Calendar,
  Utensils,
  DollarSign,
  FileText,
} from "lucide-react";
import axios from "../../../api/axios";

const Lunch = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [inputRows, setInputRows] = useState([
    {
      id: 1,
      date: "",
      lunchBoxes: "",
      source: "",
      note: "",
      bill: "",
    },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  // Fetch lunch data from API
  const fetchLunchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/lunch");
      
      // Handle different response structures
      let lunchData = [];
      if (Array.isArray(response.data)) {
        // If response is directly an array
        lunchData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // If response has data property
        lunchData = response.data.data;
      } else if (response.data.success && Array.isArray(response.data.data)) {
        // If response has success property
        lunchData = response.data.data;
      }
      
      setEntries(lunchData);
      console.log("Fetched lunch data:", lunchData); // Debug log
    } catch (error) {
      toast.error("Failed to fetch lunch data");
      console.error("Error fetching lunch data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save lunch entries to API
  const saveAllEntries = async () => {
    // Filter out incomplete rows
    const validRows = inputRows.filter(
      (row) => row.date && row.lunchBoxes && row.source && row.bill
    );

    if (validRows.length === 0) {
      toast.error("Please fill in all required fields in at least one row");
      return;
    }

    setSaving(true);
    try {
      const payload = validRows.map((row) => ({
        date: new Date(row.date),
        lunchBoxes: parseInt(row.lunchBoxes),
        source: row.source,
        note: row.note || "",
        bill: parseFloat(row.bill),
      }));

      console.log("Sending payload:", payload); // Debug log

      const response = await axios.post("/lunch", payload);
      console.log("Save response:", response); // Debug log

      // Check for different success indicators
      if (response.status === 200 || response.status === 201 || response.data.success) {
        toast.success(
          `${validRows.length} lunch record(s) saved successfully!`
        );

        // Reset input rows but keep one empty row
        setInputRows([
          {
            id: 1,
            date: "",
            lunchBoxes: "",
            source: "",
            note: "",
            bill: "",
          },
        ]);

        // Refresh the data
        fetchLunchData();
      } else {
        toast.error("Failed to save lunch records - unexpected response");
      }
    } catch (error) {
      console.error("Error details:", error); // Debug log
      toast.error("Failed to save lunch records");
    } finally {
      setSaving(false);
    }
  };

  // Delete lunch entry
  const deleteEntry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lunch record?")) {
      return;
    }

    try {
      const response = await axios.delete(`/lunch/${id}`);
      if (response.status === 200 || response.data.success) {
        toast.success("Lunch record deleted successfully!");
        fetchLunchData();
      }
    } catch (error) {
      toast.error("Failed to delete lunch record");
      console.error("Error deleting lunch record:", error);
    }
  };

  const handleInputChange = (id, e) => {
    const { name, value } = e.target;

    setInputRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [name]: value } : row))
    );
  };

  const addInputRow = () => {
    const newId =
      inputRows.length > 0
        ? Math.max(...inputRows.map((row) => row.id)) + 1
        : 1;
    setInputRows([
      ...inputRows,
      {
        id: newId,
        date: "",
        lunchBoxes: "",
        source: "",
        note: "",
        bill: "",
      },
    ]);
  };

  const removeInputRow = (id) => {
    if (inputRows.length > 1) {
      setInputRows(inputRows.filter((row) => row.id !== id));
    }
  };

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(entries.length / entriesPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  // Calculate summary statistics - handle missing lunchBoxes field
  const totalExpenses = entries.reduce(
    (sum, entry) => sum + (entry.bill || 0),
    0
  );
  
  const totalLunchBoxes = entries.reduce(
    (sum, entry) => sum + (entry.lunchBoxes || 0),
    0
  );
  
  const averagePerBox =
    totalLunchBoxes > 0 ? totalExpenses / totalLunchBoxes : 0;

  useEffect(() => {
    fetchLunchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Lunch Management
              </h1>
              <p className="text-gray-600 mt-2">
                Track and manage lunch expenses efficiently
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={addInputRow}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <Plus size={18} className="mr-2" />
                Add Row
              </button>
              <button
                onClick={saveAllEntries}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                <Save size={18} className="mr-2" />
                {saving ? "Saving..." : "Save All"}
              </button>
            </div>
          </div>
        </div>

        {/* Input Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FileText size={20} className="mr-2" />
              New Lunch Entries
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      Date
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Utensils size={16} className="mr-2" />
                      Lunch Boxes
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <DollarSign size={16} className="mr-2" />
                      Bill Amount
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inputRows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="date"
                        name="date"
                        value={row.date}
                        onChange={(e) => handleInputChange(row.id, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        name="lunchBoxes"
                        value={row.lunchBoxes}
                        onChange={(e) => handleInputChange(row.id, e)}
                        placeholder="Number of boxes"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        name="source"
                        value={row.source}
                        onChange={(e) => handleInputChange(row.id, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Source</option>
                        <option value="Catering">Catering</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="OtherSide food">OtherSide food</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        name="note"
                        value={row.note}
                        onChange={(e) => handleInputChange(row.id, e)}
                        placeholder="Additional notes"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <DollarSign
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="number"
                          name="bill"
                          value={row.bill}
                          onChange={(e) => handleInputChange(row.id, e)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => removeInputRow(row.id)}
                        disabled={inputRows.length <= 1}
                        className="p-2 text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Saved Entries Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Saved Lunch Records
            </h2>
            <span className="text-sm text-gray-500">
              {entries.length} record(s) total
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lunch Boxes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Note
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bill Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentEntries.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No lunch records found. Start by adding some entries above.
                        </td>
                      </tr>
                    ) : (
                      currentEntries.map((entry) => (
                        <tr
                          key={entry._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatDate(entry.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {entry.lunchBoxes || 0} boxes
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                entry.source === "Catering"
                                  ? "bg-green-100 text-green-800"
                                  : entry.source === "Restaurant"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {entry.source}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {entry.note || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {formatCurrency(entry.bill)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => deleteEntry(entry._id)}
                              className="text-red-600 hover:text-red-900 transition-colors p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {indexOfFirstEntry + 1} to{" "}
                      {Math.min(indexOfLastEntry, entries.length)} of{" "}
                      {entries.length} entries
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${
                              currentPage === page
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Summary Section */}
        {entries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Expenses
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {formatCurrency(totalExpenses)}
                  </p>
                </div>
                <DollarSign size={32} className="text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Total Lunch Boxes
                  </p>
                  <p className="text-2xl font-bold mt-1">{totalLunchBoxes}</p>
                </div>
                <Utensils size={32} className="text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Average per Box
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {formatCurrency(averagePerBox)}
                  </p>
                </div>
                <Calendar size={32} className="text-purple-200" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lunch;