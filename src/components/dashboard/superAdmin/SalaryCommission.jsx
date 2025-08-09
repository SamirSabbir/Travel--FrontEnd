import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import {
  FiUser,
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiEdit,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
} from "react-icons/fi";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion, AnimatePresence } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalaryCommission = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [kpiHistory, setKpiHistory] = useState([]);
  const [commissionHistory, setCommissionHistory] = useState([]);
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [formData, setFormData] = useState({
    salary: "",
    KPI: "",
    Commission: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("/users/findAllUsers");
      setEmployees(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch employees");
      setLoading(false);
    }
  };

  const fetchEmployeeHistory = async (employeeId) => {
    try {
      const [kpiRes, commissionRes] = await Promise.all([
        axios.get(`/chart/KPI-Chart/${employeeId}`),
        axios.get(`/chart/commission-Chart/${employeeId}`),
      ]);
      setKpiHistory(kpiRes.data.data);
      setCommissionHistory(commissionRes.data.data);
    } catch (error) {
      toast.error("Failed to fetch employee history");
    }
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current employees for pagination
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    fetchEmployeeHistory(employee._id);
    setFormData({
      salary: employee.salary || "",
      KPI: employee.KPI || "",
      Commission: employee.Commission || "",
    });
  };

  const toggleExpand = (employeeId) => {
    if (expandedEmployee === employeeId) {
      setExpandedEmployee(null);
    } else {
      setExpandedEmployee(employeeId);
      const employee = employees.find((emp) => emp._id === employeeId);
      handleEmployeeSelect(employee);
    }
  };

  const handleEdit = (employeeId) => {
    setEditMode(employeeId);
    const employee = employees.find((emp) => emp._id === employeeId);
    setFormData({
      salary: employee.salary || "",
      KPI: employee.KPI || "",
      Commission: employee.Commission || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (employeeEmail) => {
    try {
      const payload = {};
      if (formData.salary) payload.salary = Number(formData.salary);
      if (formData.KPI) payload.KPI = Number(formData.KPI);
      if (formData.Commission) payload.Commission = Number(formData.Commission);

      await axios.patch(
        `/users/employeeProfileUpdateForAdmin/${employeeEmail}`,
        payload
      );
      toast.success("Employee updated successfully");
      setEditMode(null);
      fetchEmployees();
      if (selectedEmployee && selectedEmployee.email === employeeEmail) {
        fetchEmployeeHistory(selectedEmployee._id);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update employee");
    }
  };

  const kpiChartData = {
    labels: kpiHistory.map((item) =>
      new Date(item.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "KPI Score",
        data: kpiHistory.map((item) => item.KPI),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
      },
    ],
  };

  const commissionChartData = {
    labels: commissionHistory.map((item) =>
      new Date(item.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Commission Rate (%)",
        data: commissionHistory.map((item) => item.Commission),
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Employee Performance Dashboard
      </h1>

      {/* Search and Pagination */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredEmployees.length > employeesPerPage && (
          <nav className="flex items-center">
            <ul className="flex space-x-1">
              {Array.from({
                length: Math.ceil(filteredEmployees.length / employeesPerPage),
              }).map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200">
          <div className="col-span-3 font-medium text-gray-500">Employee</div>
          <div className="col-span-1 font-medium text-gray-500 text-center">
            Role
          </div>
          <div className="col-span-2 font-medium text-gray-500 text-center">
            Salary
          </div>
          <div className="col-span-2 font-medium text-gray-500 text-center">
            KPI
          </div>
          <div className="col-span-2 font-medium text-gray-500 text-center">
            Commission
          </div>
          <div className="col-span-2 font-medium text-gray-500 text-center">
            Actions
          </div>
        </div>

        {currentEmployees.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? "No matching employees found" : "No employees found"}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {currentEmployees.map((employee) => (
              <div
                key={employee._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <div className="grid grid-cols-12 items-center p-4">
                  <div className="col-span-3 flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                      <FiUser className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {employee.name}
                      </p>
                      <p className="text-sm text-gray-500">{employee.email}</p>
                    </div>
                  </div>

                  <div className="col-span-1 text-center capitalize">
                    {employee.role.toLowerCase()}
                  </div>

                  <div className="col-span-2 text-center">
                    {editMode === employee._id ? (
                      <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-center"
                      />
                    ) : (
                      <div className="flex items-center justify-center">
                        <FiDollarSign className="text-gray-400 mr-1" />
                        <span>
                          {employee.salary?.toLocaleString() || "N/A"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="col-span-2 text-center">
                    {editMode === employee._id ? (
                      <input
                        type="number"
                        name="KPI"
                        value={formData.KPI}
                        onChange={handleInputChange}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-center"
                      />
                    ) : (
                      <div className="flex items-center justify-center">
                        <FiTrendingUp className="text-gray-400 mr-1" />
                        <span>{employee.KPI || "N/A"}</span>
                      </div>
                    )}
                  </div>

                  <div className="col-span-2 text-center">
                    {editMode === employee._id ? (
                      <input
                        type="number"
                        name="Commission"
                        value={formData.Commission}
                        onChange={handleInputChange}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-center"
                      />
                    ) : (
                      <span>
                        {employee.Commission
                          ? `${employee.Commission}%`
                          : "N/A"}
                      </span>
                    )}
                  </div>

                  <div className="col-span-2 flex justify-center space-x-2">
                    {editMode === employee._id ? (
                      <>
                        <button
                          onClick={() => handleSubmit(employee.email)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditMode(null)}
                          className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(employee._id)}
                          className="p-1 text-indigo-600 hover:text-indigo-800"
                          title="Edit"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => toggleExpand(employee._id)}
                          className="p-1 text-gray-600 hover:text-gray-800"
                          title="View History"
                        >
                          {expandedEmployee === employee._id ? (
                            <FiChevronUp />
                          ) : (
                            <FiChevronDown />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedEmployee === employee._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 border-t border-gray-200 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-4">
                              KPI History
                            </h3>
                            {kpiHistory.length > 0 ? (
                              <Line data={kpiChartData} />
                            ) : (
                              <p className="text-gray-500">
                                No KPI history available
                              </p>
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-4">
                              Commission History
                            </h3>
                            {commissionHistory.length > 0 ? (
                              <Line data={commissionChartData} />
                            ) : (
                              <p className="text-gray-500">
                                No commission history available
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-6">
                          <h3 className="text-lg font-medium text-gray-800 mb-4">
                            Recent Updates
                          </h3>
                          <div className="space-y-3">
                            {[...kpiHistory, ...commissionHistory]
                              .sort(
                                (a, b) =>
                                  new Date(b.createdAt) - new Date(a.createdAt)
                              )
                              .slice(0, 5)
                              .map((item, index) => (
                                <div
                                  key={index}
                                  className="bg-white p-3 rounded shadow-sm"
                                >
                                  <div className="flex justify-between">
                                    <span className="font-medium">
                                      {item.KPI
                                        ? "KPI Update"
                                        : "Commission Update"}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {new Date(
                                        item.createdAt
                                      ).toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="mt-1">
                                    {item.KPI && (
                                      <span className="text-sm">
                                        New KPI: {item.KPI}
                                      </span>
                                    )}
                                    {item.Commission && (
                                      <span className="text-sm">
                                        New Commission: {item.Commission}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryCommission;
