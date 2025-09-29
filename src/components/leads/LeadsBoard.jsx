import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const LeadsBoard = ({ leads, searchQuery, setSearchQuery, formatDate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads;

    return leads.filter(
      (lead) =>
        lead.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.uniqueId &&
          lead.uniqueId
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
    );
  }, [leads, searchQuery]);

  // Pagination logic
  const indexOfLastLead = currentPage * pageSize;
  const indexOfFirstLead = indexOfLastLead - pageSize;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / pageSize);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-bold text-gray-800">
          Lead Assignment Board
        </h3>

        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No leads found matching your search
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentLeads.map((lead) => {
              const isAssigned = lead.assigns?.length > 0;
              const assignedTo = isAssigned
                ? lead.assigns.join(", ")
                : "Not Assigned";
              const assignedBy = lead.adminEmail || "System";

              return (
                <motion.div
                  key={lead._id}
                  whileHover={{ y: -5 }}
                  className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-all bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800 truncate">
                        {lead.customerName}
                      </h4>
                      {lead.uniqueId && (
                        <p className="text-xs text-gray-500 mt-1">
                          ID: {lead.uniqueId}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        isAssigned
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {isAssigned ? "Assigned" : "Unassigned"}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium">Phone:</span>
                      {lead.customerPhone}
                    </p>
                    <p className="flex items-start gap-2 text-gray-600">
                      <span className="font-medium">Assigned To:</span>
                      <span
                        className={
                          isAssigned ? "text-green-600" : "text-red-500"
                        }
                      >
                        {assignedTo}
                      </span>
                    </p>
                    <p className="flex items-start gap-2 text-gray-600">
                      <span className="font-medium">By:</span>
                      <span className="text-indigo-500">{assignedBy}</span>
                    </p>
                    <p className="flex items-start gap-2 text-gray-600">
                      <span className="font-medium">Date:</span>
                      <span className="text-gray-500">
                        {formatDate(lead.createdAt)}
                      </span>
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <div className="flex gap-1">
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
                      onClick={() => paginate(pageNum)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentPage === pageNum
                          ? "bg-indigo-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeadsBoard;
