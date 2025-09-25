import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Plus,
  Trash2,
  Save,
  Calendar,
  Package,
  DollarSign,
  FileText,
} from "lucide-react";
import axios from "../../../api/axios";

const OfficeSupplies = () => {
  const [inputRows, setInputRows] = useState([
    {
      id: 1,
      date: "",
      productDescription: "",
      item: "",
      quantity: "",
      unitPrice: "",
      total: "",
    },
  ]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  // Item options
  const itemOptions = [
    "Stationary",
    "Grocery",
    "Beverage",
    "Electronic Items",
    "Supply water",
  ];

  // Quantity options
  const quantityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Fetch office supplies data
  const fetchOfficeSupplies = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/office-supplies");
      if (Array.isArray(response.data)) {
        setEntries(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch office supplies data");
      console.error("Error fetching office supplies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save office supplies entries
  const saveAllEntries = async () => {
    // Filter out incomplete rows
    const validRows = inputRows.filter(
      (row) =>
        row.date &&
        row.productDescription &&
        row.item &&
        row.quantity &&
        row.unitPrice
    );

    if (validRows.length === 0) {
      toast.error("Please fill in all required fields in at least one row");
      return;
    }

    setSaving(true);
    try {
      const payload = validRows.map((row) => ({
        date: new Date(row.date),
        productDescription: row.productDescription,
        item: row.item,
        quantity: parseInt(row.quantity),
        unitPrice: parseFloat(row.unitPrice),
        total:
          parseFloat(row.total) ||
          parseFloat(row.quantity) * parseFloat(row.unitPrice),
      }));

      const response = await axios.post("/office-supplies", payload);

      if (Array.isArray(response.data)) {
        toast.success(
          `${validRows.length} office supply record(s) saved successfully!`
        );

        // Reset input rows but keep one empty row
        setInputRows([
          {
            id: 1,
            date: "",
            productDescription: "",
            item: "",
            quantity: "",
            unitPrice: "",
            total: "",
          },
        ]);

        // Refresh the data
        fetchOfficeSupplies();
      }
    } catch (error) {
      toast.error("Failed to save office supply records");
      console.error("Error saving office supplies:", error);
    } finally {
      setSaving(false);
    }
  };

  // Delete office supply entry
  const deleteEntry = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this office supply record?"
      )
    ) {
      return;
    }

    try {
      const response = await axios.delete(`/office-supplies/${id}`);
      if (response.data.success) {
        toast.success("Office supply record deleted successfully!");
        fetchOfficeSupplies();
      }
    } catch (error) {
      toast.error("Failed to delete office supply record");
      console.error("Error deleting office supply:", error);
    }
  };

  const handleInputChange = (id, e) => {
    const { name, value } = e.target;

    setInputRows((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [name]: value };

          // Calculate total price if quantity or unit price changes
          if (
            (name === "quantity" || name === "unitPrice") &&
            updatedRow.quantity &&
            updatedRow.unitPrice
          ) {
            updatedRow.total = (
              parseFloat(updatedRow.quantity) * parseFloat(updatedRow.unitPrice)
            ).toFixed(2);
          }

          return updatedRow;
        }
        return row;
      })
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
        productDescription: "",
        item: "",
        quantity: "",
        unitPrice: "",
        total: "",
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

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency (Bangladeshi Taka)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  // Calculate totals for summary
  const totalItems = entries.reduce(
    (sum, entry) => sum + (entry.quantity || 0),
    0
  );
  const totalCost = entries.reduce((sum, entry) => sum + (entry.total || 0), 0);

  useEffect(() => {
    fetchOfficeSupplies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Office Supplies Management
              </h1>
              <p className="text-gray-600 mt-2">
                Track and manage office supplies inventory efficiently
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
              New Office Supply Entries
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
                    Product Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <DollarSign size={16} className="mr-2" />
                      Unit Price
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Price
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
                        type="text"
                        name="productDescription"
                        value={row.productDescription}
                        onChange={(e) => handleInputChange(row.id, e)}
                        placeholder="Product description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        name="item"
                        value={row.item}
                        onChange={(e) => handleInputChange(row.id, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Item</option>
                        {itemOptions.map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        name="quantity"
                        value={row.quantity}
                        onChange={(e) => handleInputChange(row.id, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Quantity</option>
                        {quantityOptions.map((quantity, index) => (
                          <option key={index} value={quantity}>
                            {quantity}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          ৳
                        </span>
                        <input
                          type="number"
                          name="unitPrice"
                          value={row.unitPrice}
                          onChange={(e) => handleInputChange(row.id, e)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          ৳
                        </span>
                        <input
                          type="number"
                          name="total"
                          value={row.total}
                          readOnly
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              Office Supply Records
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
                        Product Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Price
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
                          colSpan="7"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No office supply records found. Start by adding some
                          entries above.
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
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                            {entry.productDescription}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                entry.item === "Stationary"
                                  ? "bg-blue-100 text-blue-800"
                                  : entry.item === "Grocery"
                                  ? "bg-green-100 text-green-800"
                                  : entry.item === "Beverage"
                                  ? "bg-purple-100 text-purple-800"
                                  : entry.item === "Electronic Items"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {entry.item}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {entry.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {formatCurrency(entry.unitPrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                            {formatCurrency(entry.total)}
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
                    Total Records
                  </p>
                  <p className="text-2xl font-bold mt-1">{entries.length}</p>
                </div>
                <FileText size={32} className="text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Total Items
                  </p>
                  <p className="text-2xl font-bold mt-1">{totalItems}</p>
                </div>
                <Package size={32} className="text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Total Cost
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {formatCurrency(totalCost)}
                  </p>
                </div>
                <DollarSign size={32} className="text-purple-200" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficeSupplies;
