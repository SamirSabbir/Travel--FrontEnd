import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { toast } from "react-toastify";

const SpecialRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states for each table
  const [commissionCurrentPage, setCommissionCurrentPage] = useState(1);
  const [leaveCurrentPage, setLeaveCurrentPage] = useState(1);
  const [specialCurrentPage, setSpecialCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchSpecialRequests();
  }, []);

  const fetchSpecialRequests = async () => {
    try {
      const res = await axios.get("/specialRequest");
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch special requests");
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`/specialRequest/approve/${id}`);
      fetchSpecialRequests();
      toast.success("Request approved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve request");
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.patch(`/specialRequest/cancel/${id}`);
      fetchSpecialRequests();
      toast.success("Request cancelled successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel request");
    }
  };

  // Filter requests by type
  const commissionRequests = requests.filter(
    (req) => req.type === "CommissionWithdrawal"
  );
  const leaveRequests = requests.filter(
    (req) => req.type === "SickLeave" || req.type === "CasualLeave"
  );
  const specialRequests = requests.filter((req) => req.type === "Other");

  // Pagination logic for commission table
  const commissionIndexOfLastItem = commissionCurrentPage * itemsPerPage;
  const commissionIndexOfFirstItem = commissionIndexOfLastItem - itemsPerPage;
  const commissionCurrentItems = commissionRequests.slice(
    commissionIndexOfFirstItem,
    commissionIndexOfLastItem
  );

  // Pagination logic for leave table
  const leaveIndexOfLastItem = leaveCurrentPage * itemsPerPage;
  const leaveIndexOfFirstItem = leaveIndexOfLastItem - itemsPerPage;
  const leaveCurrentItems = leaveRequests.slice(
    leaveIndexOfFirstItem,
    leaveIndexOfLastItem
  );

  // Pagination logic for special requests table
  const specialIndexOfLastItem = specialCurrentPage * itemsPerPage;
  const specialIndexOfFirstItem = specialIndexOfLastItem - itemsPerPage;
  const specialCurrentItems = specialRequests.slice(
    specialIndexOfFirstItem,
    specialIndexOfLastItem
  );

  // Pagination component
  const Pagination = ({
    itemsPerPage,
    totalItems,
    currentPage,
    paginate,
    dataType,
  }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    if (pageNumbers.length <= 1) return null;

    return (
      <nav className="mt-4">
        <ul className="flex justify-center space-x-2">
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${
                currentPage === number ? "font-bold" : ""
              }`}
            >
              <button
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded ${
                  currentPage === number
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  // Function to get status badge with approver/canceller info
  const getStatusBadge = (item) => {
    if (item.approved) {
      return (
        <div className="flex flex-col items-center">
          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 mb-1">
            Approved
          </span>
          {item.approvedBy && (
            <span className="text-xs text-gray-600">By: {item.approvedBy}</span>
          )}
        </div>
      );
    } else if (item.cancelled) {
      return (
        <div className="flex flex-col items-center">
          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 mb-1">
            Cancelled
          </span>
          {item.cancelledBy && (
            <span className="text-xs text-gray-600">
              By: {item.cancelledBy}
            </span>
          )}
        </div>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">
      {/* Commission Withdrawal Requests Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Commission Withdrawal Requests ({commissionRequests.length})
        </h2>
        {commissionRequests.length > 0 ? (
          <>
            <table className="w-full border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">Employee Email</th>
                  <th className="py-2 px-4 border">Role</th>
                  <th className="py-2 px-4 border">Type</th>
                  <th className="py-2 px-4 border">Amount</th>
                  <th className="py-2 px-4 border">Created At</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {commissionCurrentItems.map((item) => (
                  <tr key={item._id} className="text-center hover:bg-gray-50">
                    <td className="py-2 px-4 border">{item.userEmail}</td>
                    <td className="py-2 px-4 border">
                      {item.userRole || "N/A"}
                    </td>
                    <td className="py-2 px-4 border">{item.type}</td>
                    <td className="py-2 px-4 border">
                      ${item.commissionAmount}
                    </td>
                    <td className="py-2 px-4 border">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border">{getStatusBadge(item)}</td>
                    <td className="py-2 px-4 border space-x-2">
                      <button
                        onClick={() => handleApprove(item._id)}
                        disabled={item.approved || item.cancelled}
                        className={`px-3 py-1 rounded ${
                          item.approved || item.cancelled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleCancel(item._id)}
                        disabled={item.cancelled || item.approved}
                        className={`px-3 py-1 rounded ${
                          item.cancelled || item.approved
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        } text-white`}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={commissionRequests.length}
              currentPage={commissionCurrentPage}
              paginate={setCommissionCurrentPage}
              dataType="commission"
            />
          </>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No commission withdrawal requests found.
          </p>
        )}
      </div>

      {/* Leave Requests Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Leave Requests ({leaveRequests.length})
        </h2>
        {leaveRequests.length > 0 ? (
          <>
            <table className="w-full border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">Employee Email</th>
                  <th className="py-2 px-4 border">Role</th>
                  <th className="py-2 px-4 border">Type</th>
                  <th className="py-2 px-4 border">Leave Dates</th>
                  <th className="py-2 px-4 border">Created At</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveCurrentItems.map((item) => (
                  <tr key={item._id} className="text-center hover:bg-gray-50">
                    <td className="py-2 px-4 border">{item.userEmail}</td>
                    <td className="py-2 px-4 border">
                      {item.userRole || "N/A"}
                    </td>
                    <td className="py-2 px-4 border">{item.type}</td>
                    <td className="py-2 px-4 border">
                      {item.leaveDates &&
                        item.leaveDates.map((date, index) => (
                          <div key={index}>
                            {new Date(date).toLocaleDateString()}
                          </div>
                        ))}
                    </td>
                    <td className="py-2 px-4 border">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border">{getStatusBadge(item)}</td>
                    <td className="py-2 px-4 border space-x-2">
                      <button
                        onClick={() => handleApprove(item._id)}
                        disabled={item.approved || item.cancelled}
                        className={`px-3 py-1 rounded ${
                          item.approved || item.cancelled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleCancel(item._id)}
                        disabled={item.cancelled || item.approved}
                        className={`px-3 py-1 rounded ${
                          item.cancelled || item.approved
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        } text-white`}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={leaveRequests.length}
              currentPage={leaveCurrentPage}
              paginate={setLeaveCurrentPage}
              dataType="leave"
            />
          </>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No leave requests found.
          </p>
        )}
      </div>

      {/* Special Requests Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Special Requests ({specialRequests.length})
        </h2>
        {specialRequests.length > 0 ? (
          <>
            <table className="w-full border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">Employee Email</th>
                  <th className="py-2 px-4 border">Role</th>
                  <th className="py-2 px-4 border">Type</th>
                  <th className="py-2 px-4 border">Message</th>
                  <th className="py-2 px-4 border">Created At</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {specialCurrentItems.map((item) => (
                  <tr key={item._id} className="text-center hover:bg-gray-50">
                    <td className="py-2 px-4 border">{item.userEmail}</td>
                    <td className="py-2 px-4 border">
                      {item.userRole || "N/A"}
                    </td>
                    <td className="py-2 px-4 border">{item.type}</td>
                    <td
                      className="py-2 px-4 border max-w-xs truncate"
                      title={item.message}
                    >
                      {item.message || "No message"}
                    </td>
                    <td className="py-2 px-4 border">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border">{getStatusBadge(item)}</td>
                    <td className="py-2 px-4 border space-x-2">
                      <button
                        onClick={() => handleApprove(item._id)}
                        disabled={item.approved || item.cancelled}
                        className={`px-3 py-1 rounded ${
                          item.approved || item.cancelled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleCancel(item._id)}
                        disabled={item.cancelled || item.approved}
                        className={`px-3 py-1 rounded ${
                          item.cancelled || item.approved
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        } text-white`}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={specialRequests.length}
              currentPage={specialCurrentPage}
              paginate={setSpecialCurrentPage}
              dataType="special"
            />
          </>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No special requests found.
          </p>
        )}
      </div>
    </div>
  );
};

export default SpecialRequest;
