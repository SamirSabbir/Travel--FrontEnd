import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import SalaryModal from "./SalaryModal";
import NOCModal from "./NOCModal";
import SpecialRequest from "./SpecialRequest";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const HRApproval = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [nocData, setNocData] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [selectedNOC, setSelectedNOC] = useState(null);
  const [userRole, setUserRole] = useState("");

  // Pagination states for salary table
  const [salaryCurrentPage, setSalaryCurrentPage] = useState(1);
  const [salaryItemsPerPage] = useState(5);

  // Pagination states for NOC table
  const [nocCurrentPage, setNocCurrentPage] = useState(1);
  const [nocItemsPerPage] = useState(5);

  useEffect(() => {
    // Get user role from cookies
    const userData = Cookies.get("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role || "");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    fetchSalaryData();
    fetchNocData();
  }, []);

  const fetchSalaryData = async () => {
    try {
      const res = await axios.get("/salaryCertificate");
      setSalaryData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch salary certificate data");
    }
  };

  const fetchNocData = async () => {
    try {
      const res = await axios.get("/noc");
      setNocData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch NOC data");
    }
  };

  const handleApprove = async (id, type) => {
    try {
      if (type === "salaryCertificate") {
        await axios.patch(`/salaryCertificate/approve/${id}`);
        fetchSalaryData();
        toast.success("Salary certificate approved successfully!");
      } else if (type === "noc") {
        await axios.patch(`/noc/approve/${id}`);
        fetchNocData();
        toast.success("NOC approved successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve request");
    }
  };

  const handleCancel = async (id, type) => {
    try {
      if (type === "salaryCertificate") {
        await axios.patch(`/salaryCertificate/cancel/${id}`);
        fetchSalaryData();
        toast.success("Salary certificate canceled!");
      } else if (type === "noc") {
        await axios.patch(`/noc/cancel/${id}`);
        fetchNocData();
        toast.success("NOC canceled!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel request");
    }
  };

  // Check if buttons should be disabled based on role and position
  const shouldDisableButtons = (position) => {
    // If user role is AccountAdmin and position is AccountAdmin, disable buttons
    return userRole === "AccountAdmin" && position === "AccountAdmin";
  };

  // Pagination logic for salary table
  const salaryIndexOfLastItem = salaryCurrentPage * salaryItemsPerPage;
  const salaryIndexOfFirstItem = salaryIndexOfLastItem - salaryItemsPerPage;
  const salaryCurrentItems = salaryData.slice(
    salaryIndexOfFirstItem,
    salaryIndexOfLastItem
  );
  const salaryTotalPages = Math.ceil(salaryData.length / salaryItemsPerPage);

  // Pagination logic for NOC table
  const nocIndexOfLastItem = nocCurrentPage * nocItemsPerPage;
  const nocIndexOfFirstItem = nocIndexOfLastItem - nocItemsPerPage;
  const nocCurrentItems = nocData.slice(
    nocIndexOfFirstItem,
    nocIndexOfLastItem
  );
  const nocTotalPages = Math.ceil(nocData.length / nocItemsPerPage);

  // Change page for salary table
  const salaryPaginate = (pageNumber) => setSalaryCurrentPage(pageNumber);

  // Change page for NOC table
  const nocPaginate = (pageNumber) => setNocCurrentPage(pageNumber);

  // Pagination component
  const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

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

  return (
    <div className="p-6 space-y-10">
      {/* Salary Certificate Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Salary Certificate Requests
        </h2>
        <table className="w-full border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Employee Name</th>
              <th className="py-2 px-4 border">Position</th>
              <th className="py-2 px-4 border">Request Date</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaryCurrentItems.map((item) => {
              const disableButtons = shouldDisableButtons(item.position);
              return (
                <tr key={item._id} className="text-center hover:bg-gray-50">
                  <td className="py-2 px-4 border">{item.name}</td>
                  <td className="py-2 px-4 border">{item.position}</td>
                  <td className="py-2 px-4 border">
                    {new Date(item.requestDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : item.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status || "pending"}
                    </span>
                  </td>
                  <td className="py-2 px-4 border space-x-2">
                    <button
                      onClick={() => setSelectedSalary(item)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        handleApprove(item._id, "salaryCertificate")
                      }
                      disabled={disableButtons || item.status === "approved"}
                      className={`px-3 py-1 rounded ${
                        disableButtons || item.status === "approved"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      } text-white`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleCancel(item._id, "salaryCertificate")
                      }
                      disabled={disableButtons || item.status === "rejected"}
                      className={`px-3 py-1 rounded ${
                        disableButtons || item.status === "rejected"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white`}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Salary Table Pagination */}
        <Pagination
          itemsPerPage={salaryItemsPerPage}
          totalItems={salaryData.length}
          currentPage={salaryCurrentPage}
          paginate={salaryPaginate}
        />
      </div>

      {/* NOC Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">NOC Requests</h2>
        <table className="w-full border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Employee Name</th>
              <th className="py-2 px-4 border">Position</th>
              <th className="py-2 px-4 border">Request Date</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {nocCurrentItems.map((item) => {
              const disableButtons = shouldDisableButtons(item.position);
              return (
                <tr key={item._id} className="text-center hover:bg-gray-50">
                  <td className="py-2 px-4 border">{item.name}</td>
                  <td className="py-2 px-4 border">{item.position}</td>
                  <td className="py-2 px-4 border">
                    {new Date(item.requestDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : item.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status || "pending"}
                    </span>
                  </td>
                  <td className="py-2 px-4 border space-x-2">
                    <button
                      onClick={() => setSelectedNOC(item)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleApprove(item._id, "noc")}
                      disabled={disableButtons || item.status === "approved"}
                      className={`px-3 py-1 rounded ${
                        disableButtons || item.status === "approved"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      } text-white`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleCancel(item._id, "noc")}
                      disabled={disableButtons || item.status === "rejected"}
                      className={`px-3 py-1 rounded ${
                        disableButtons || item.status === "rejected"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white`}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* NOC Table Pagination */}
        <Pagination
          itemsPerPage={nocItemsPerPage}
          totalItems={nocData.length}
          currentPage={nocCurrentPage}
          paginate={nocPaginate}
        />
      </div>

      {/* Modals */}
      {selectedSalary && (
        <SalaryModal
          data={selectedSalary}
          onClose={() => setSelectedSalary(null)}
        />
      )}
      {selectedNOC && (
        <NOCModal data={selectedNOC} onClose={() => setSelectedNOC(null)} />
      )}
      <SpecialRequest />
    </div>
  );
};

export default HRApproval;
