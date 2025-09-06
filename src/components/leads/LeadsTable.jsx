import React, { useState, useMemo } from "react";
import { Loader2, ArrowUpDown } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const LeadsTable = ({
  leads,
  employees,
  assigningId,
  handleAssignLead,
  formatDate,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedLeads = useMemo(() => {
    let sortableLeads = [...leads];
    if (sortConfig.key) {
      sortableLeads.sort((a, b) => {
        if (sortConfig.key === "createdAt") {
          return sortConfig.direction === "asc"
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortConfig.key === "employee") {
          const aEmployee = a.assigns?.[0] || "";
          const bEmployee = b.assigns?.[0] || "";
          return sortConfig.direction === "asc"
            ? aEmployee.localeCompare(bEmployee)
            : bEmployee.localeCompare(aEmployee);
        } else if (sortConfig.key === "customerName") {
          return sortConfig.direction === "asc"
            ? a.customerName.localeCompare(b.customerName)
            : b.customerName.localeCompare(a.customerName);
        }
        return 0;
      });
    }
    return sortableLeads;
  }, [leads, sortConfig]);

  // Pagination logic
  const indexOfLastLead = currentPage * pageSize;
  const indexOfFirstLead = indexOfLastLead - pageSize;
  const currentLeads = sortedLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(sortedLeads.length / pageSize);

  return (
    <div className="bg-white rounded-xl shadow-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("customerName")}
              >
                <div className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                  {sortConfig.key === "customerName" && (
                    <span className="ml-1 text-xs">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("employee")}
              >
                <div className="flex items-center">
                  Assign To
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                  {sortConfig.key === "employee" && (
                    <span className="ml-1 text-xs">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("createdAt")}
              >
                <div className="flex items-center">
                  Date Created
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                  {sortConfig.key === "createdAt" && (
                    <span className="ml-1 text-xs">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentLeads.map((lead) => (
              <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {lead.customerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.customerPhone}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {lead.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    onChange={(e) => handleAssignLead(lead._id, e.target.value)}
                    value={lead.assigns?.[0] || ""} // ✅ Show assigned employee if exists
                    disabled={lead.assigns?.length > 0} // ✅ Disable if already assigned
                    className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 
      focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
      sm:text-sm rounded-md 
      ${lead.assigns?.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  >
                    <option value="" disabled>
                      {lead.assigns?.length > 0
                        ? "Employee Assigned"
                        : "Select Employee"}
                    </option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp.email}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(lead.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {assigningId === lead._id ? (
                    <div className="flex items-center text-indigo-600">
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Assigning...
                    </div>
                  ) : (
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold leading-5 rounded-full ${
                        lead.assigns?.length > 0
                          ? "text-green-800 bg-green-100"
                          : "text-yellow-800 bg-yellow-100"
                      }`}
                    >
                      {lead.assigns?.length > 0 ? "Assigned" : "Unassigned"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedLeads.length > pageSize && (
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstLead + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastLead, sortedLeads.length)}
              </span>{" "}
              of <span className="font-medium">{sortedLeads.length}</span>{" "}
              results
            </span>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded-md px-2 py-1 text-sm"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-1 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ChevronLeft size={20} />
            </button>

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
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentPage === pageNum
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`p-1 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
