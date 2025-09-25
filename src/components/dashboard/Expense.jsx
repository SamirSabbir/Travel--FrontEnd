import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Search,
  Download,
  ChevronUp,
  ChevronDown,
  Calendar,
} from "lucide-react";
import axios from "../../api/axios";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [downloadFilter, setDownloadFilter] = useState({
    type: "all", // 'all', 'month', 'year'
    month: new Date().getMonth() + 1, // Current month (1-12)
    year: new Date().getFullYear(), // Current year
  });

  // Fetch expenses data
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/expense");
      if (response.data.success) {
        setExpenses(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch expenses");
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique years from expenses data
  const getUniqueYears = () => {
    const years = expenses
      .map((expense) => new Date(expense.date).getFullYear())
      .filter((year, index, self) => self.indexOf(year) === index)
      .sort((a, b) => b - a); // Sort descending (newest first)

    return years.length > 0 ? years : [new Date().getFullYear()];
  };

  // Download expenses with filters
  const handleDownload = async () => {
    try {
      let downloadUrl = "/expense/download"; // Changed variable name from 'url' to 'downloadUrl'
      const params = new URLSearchParams();

      if (downloadFilter.type === "month") {
        params.append("month", downloadFilter.month);
        params.append("year", downloadFilter.year);
      } else if (downloadFilter.type === "year") {
        params.append("year", downloadFilter.year);
      }

      if (params.toString()) {
        downloadUrl += `?${params.toString()}`;
      }

      const response = await axios.get(downloadUrl, {
        responseType: "blob",
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data])); // This 'url' is local to this block
      const link = document.createElement("a");
      link.href = url;

      let filename = "expenses";
      if (downloadFilter.type === "month") {
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        filename = `expenses-${monthNames[downloadFilter.month - 1]}-${
          downloadFilter.year
        }`;
      } else if (downloadFilter.type === "year") {
        filename = `expenses-${downloadFilter.year}`;
      } else {
        filename = `expenses-${new Date().toISOString().split("T")[0]}`;
      }

      link.setAttribute("download", `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Expense data downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download expenses");
      console.error("Error downloading expenses:", error);
    }
  };

  // Sort data
  const sortedData = React.useMemo(() => {
    let sortableData = [...expenses];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [expenses, sortConfig]);

  // Filter data by search term
  const filteredData = sortedData.filter(
    (expense) =>
      expense.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  // Handle sort
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      currencyDisplay: "symbol",
    }).format(amount || 0);
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Fetch data on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  const uniqueYears = getUniqueYears();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Expense Management</h1>
        <div className="flex items-center space-x-4">
          {/* Download Filters */}
          <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm p-2">
            <select
              value={downloadFilter.type}
              onChange={(e) =>
                setDownloadFilter({
                  ...downloadFilter,
                  type: e.target.value,
                  month:
                    e.target.value === "month"
                      ? downloadFilter.month
                      : new Date().getMonth() + 1,
                  year:
                    e.target.value === "year"
                      ? downloadFilter.year
                      : new Date().getFullYear(),
                })
              }
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Data</option>
              <option value="month">By Month</option>
              <option value="year">By Year</option>
            </select>

            {downloadFilter.type === "month" && (
              <>
                <select
                  value={downloadFilter.month}
                  onChange={(e) =>
                    setDownloadFilter({
                      ...downloadFilter,
                      month: parseInt(e.target.value),
                    })
                  }
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                <select
                  value={downloadFilter.year}
                  onChange={(e) =>
                    setDownloadFilter({
                      ...downloadFilter,
                      year: parseInt(e.target.value),
                    })
                  }
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {uniqueYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </>
            )}

            {downloadFilter.type === "year" && (
              <select
                value={downloadFilter.year}
                onChange={(e) =>
                  setDownloadFilter({
                    ...downloadFilter,
                    year: parseInt(e.target.value),
                  })
                }
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={18} className="mr-2" />
            Download CSV
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by title, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>Date</span>
                        {getSortIcon("date")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Title</span>
                        {getSortIcon("title")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Category</span>
                        {getSortIcon("category")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Amount</span>
                        {getSortIcon("amount")}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRecords.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        {searchTerm
                          ? "No expenses found matching your search."
                          : "No expenses found."}
                      </td>
                    </tr>
                  ) : (
                    currentRecords.map((expense) => (
                      <tr
                        key={expense._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(expense.date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {expense.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              expense.category === "Notary"
                                ? "bg-purple-100 text-purple-800"
                                : expense.category === "OfficeSupplies"
                                ? "bg-blue-100 text-blue-800"
                                : expense.category === "Lunch"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {expense.paymentMethod}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {expense.description}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredData.length > recordsPerPage && (
              <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700 mb-4 md:mb-0">
                  Showing {indexOfFirstRecord + 1} to{" "}
                  {Math.min(indexOfLastRecord, filteredData.length)} of{" "}
                  {filteredData.length} expenses
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Summary Stats */}
      {!loading && expenses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-500">Total Expenses</div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(
                expenses.reduce(
                  (sum, expense) => sum + (expense.amount || 0),
                  0
                )
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-500">Notary Expenses</div>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(
                expenses
                  .filter((e) => e.category === "Notary")
                  .reduce((sum, expense) => sum + (expense.amount || 0), 0)
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-500">Other Expenses</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(
                expenses
                  .filter((e) => e.category !== "Notary")
                  .reduce((sum, expense) => sum + (expense.amount || 0), 0)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expense;
