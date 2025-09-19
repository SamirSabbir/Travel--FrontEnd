import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import SalaryModal from "./SalaryModal";
import NOCModal from "./NOCModal";
import { toast } from "react-toastify";

const HRApproval = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [nocData, setNocData] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [selectedNOC, setSelectedNOC] = useState(null);

  // Pagination states for salary table
  const [salaryCurrentPage, setSalaryCurrentPage] = useState(1);
  const [salaryItemsPerPage] = useState(5);

  // Pagination states for NOC table
  const [nocCurrentPage, setNocCurrentPage] = useState(1);
  const [nocItemsPerPage] = useState(5);

  useEffect(() => {
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
        toast.success("Salary certificate cancel !");
      } else if (type === "noc") {
        await axios.patch(`/noc/cancel/${id}`);
        fetchNocData();
        toast.success("NOC cancel !");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel request");
    }
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
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaryCurrentItems.map((item) => (
              <tr key={item._id} className="text-center hover:bg-gray-50">
                <td className="py-2 px-4 border">{item.name}</td>
                <td className="py-2 px-4 border">{item.position}</td>
                <td className="py-2 px-4 border">{item.requestDate}</td>
                <td className="py-2 px-4 border space-x-2">
                  <button
                    onClick={() => setSelectedSalary(item)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleApprove(item._id, "salaryCertificate")}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleCancel(item._id, "salaryCertificate")}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
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
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {nocCurrentItems.map((item) => (
              <tr key={item._id} className="text-center hover:bg-gray-50">
                <td className="py-2 px-4 border">{item.name}</td>
                <td className="py-2 px-4 border">{item.position}</td>
                <td className="py-2 px-4 border">{item.requestDate}</td>
                <td className="py-2 px-4 border space-x-2">
                  <button
                    onClick={() => setSelectedNOC(item)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleApprove(item._id, "noc")}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleCancel(item._id, "noc")}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
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
    </div>
  );
};

export default HRApproval;
