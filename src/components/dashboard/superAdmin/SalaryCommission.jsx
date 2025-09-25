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
  FiHeart,
  FiCoffee,
  FiMail,
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
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [formData, setFormData] = useState({
    salary: "",
    KPI: "",
    Commission: "",
    remainingCasualLeaves: "",
    remainingSickLeaves: "",
    joiningDate: "",
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
      const [kpiRes, commissionRes, leaveRes] = await Promise.all([
        axios.get(`/chart/KPI-Chart/${employeeId}`),
        axios.get(`/chart/commission-Chart/${employeeId}`),
        axios.get(`/chart/leave-Chart/${employeeId}`),
      ]);
      setKpiHistory(kpiRes.data.data);
      setCommissionHistory(commissionRes.data.data);
      setLeaveHistory(leaveRes.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch employee history");
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      remainingCasualLeaves: employee.remainingCasualLeaves || "",
      remainingSickLeaves: employee.remainingSickLeaves || "",
      joiningDate: employee.joiningDate || "",
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
      remainingCasualLeaves: employee.remainingCasualLeaves || "",
      remainingSickLeaves: employee.remainingSickLeaves || "",
      joiningDate: employee.joiningDate || "",
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
      if (formData.remainingCasualLeaves)
        payload.remainingCasualLeaves = Number(formData.remainingCasualLeaves);
      if (formData.remainingSickLeaves)
        payload.remainingSickLeaves = Number(formData.remainingSickLeaves);
      if (formData.joiningDate) payload.joiningDate = formData.joiningDate;

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
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const commissionChartData = {
    labels: commissionHistory.map((item) =>
      new Date(item.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Commission Rate (tk)",
        data: commissionHistory.map((item) => item.Commission),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "rgb(16, 185, 129)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const leaveChartData = {
    labels: leaveHistory.map((item) =>
      new Date(item.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Casual Leaves",
        data: leaveHistory.map((item) => item.remainingCasualLeaves),
        borderColor: "rgb(245, 158, 11)",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "rgb(245, 158, 11)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
      {
        label: "Sick Leaves",
        data: leaveHistory.map((item) => item.remainingSickLeaves),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "rgb(239, 68, 68)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Employee Performance Dashboard
        </h1>
        <p className="text-gray-600">Manage and monitor employee performance metrics</p>
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search employees by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Showing {currentEmployees.length} of {filteredEmployees.length} employees
            </span>
            {filteredEmployees.length > employeesPerPage && (
              <nav className="flex items-center">
                <ul className="flex space-x-1">
                  {Array.from({
                    length: Math.ceil(filteredEmployees.length / employeesPerPage),
                  }).map((_, index) => (
                    <li key={index}>
                      <button
                        onClick={() => paginate(index + 1)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === index + 1
                            ? "bg-indigo-500 text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-100"
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
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="col-span-3 font-semibold text-gray-700 text-sm uppercase tracking-wider">
            Employee
          </div>
          <div className="col-span-1 font-semibold text-gray-700 text-sm uppercase tracking-wider text-center">
            Role
          </div>
          <div className="col-span-1 font-semibold text-gray-700 text-sm uppercase tracking-wider text-center">
            Join Date
          </div>
          <div className="col-span-1 font-semibold text-gray-700 text-sm uppercase tracking-wider text-center">
            Salary
          </div>
          <div className="col-span-1 font-semibold text-gray-700 text-sm uppercase tracking-wider text-center">
            KPI
          </div>
          <div className="col-span-1 font-semibold text-gray-700 text-sm uppercase tracking-wider text-center">
            Commission
          </div>
          <div className="col-span-2 font-semibold text-gray-700 text-sm uppercase tracking-wider text-center">
            Casual Leave
          </div>
          <div className="col-span-2 font-semibold text-gray-700 text-sm uppercase tracking-wider text-center">
            Sick Leave
          </div>
        </div>

        {currentEmployees.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FiUser className="mx-auto text-4xl" />
            </div>
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No employees found matching your search" : "No employees available"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {currentEmployees.map((employee) => (
              <div key={employee._id} className="group hover:bg-gray-50 transition-colors duration-200">
                {/* Main Row */}
                <div className="grid grid-cols-12 items-center px-6 py-4">
                  {/* Employee Info */}
                  <div className="col-span-3 flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center shadow-sm">
                        <FiUser className="text-indigo-600 text-lg" />
                      </div>
                      {employee.role === "AccountAdmin" && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">A</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                        {employee.name}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FiMail className="mr-1.5 flex-shrink-0" size={14} />
                        <span className="truncate">{employee.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-span-1 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      employee.role === "AccountAdmin" 
                        ? "bg-green-100 text-green-800"
                        : employee.role === "OfficeBoy"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {employee.role.toLowerCase()}
                    </span>
                  </div>

                  {/* Joining Date */}
                  <div className="col-span-1 text-center">
                    {editMode === employee._id ? (
                      <input
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <FiCalendar className="text-gray-400 mb-1" size={16} />
                        <span className="text-sm text-gray-700 font-medium">
                          {employee.joiningDate
                            ? new Date(employee.joiningDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                year: 'numeric' 
                              })
                            : "N/A"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Salary */}
                  <div className="col-span-1 text-center">
                    {editMode === employee._id ? (
                      <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <FiDollarSign className="text-gray-400 mb-1" size={16} />
                        <span className="text-sm font-semibold text-gray-900">
                          {employee.salary ? `${(employee.salary / 1000).toFixed(0)}k` : "N/A"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* KPI */}
                  <div className="col-span-1 text-center">
                    {editMode === employee._id ? (
                      <input
                        type="number"
                        name="KPI"
                        value={formData.KPI}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <FiTrendingUp className="text-gray-400 mb-1" size={16} />
                        <span className={`text-sm font-semibold ${
                          employee.KPI >= 80 ? "text-green-600" :
                          employee.KPI >= 60 ? "text-yellow-600" : "text-red-600"
                        }`}>
                          {employee.KPI || "N/A"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Commission */}
                  <div className="col-span-1 text-center">
                    {editMode === employee._id ? (
                      <input
                        type="number"
                        name="Commission"
                        value={formData.Commission}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-gray-900">
                        {employee.Commission ? `${employee.Commission} tk` : "N/A"}
                      </span>
                    )}
                  </div>

                  {/* Casual Leave */}
                  <div className="col-span-2 text-center">
                    {editMode === employee._id ? (
                      <input
                        type="number"
                        name="remainingCasualLeaves"
                        value={formData.remainingCasualLeaves}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <FiCoffee className="text-blue-500" size={18} />
                        <div className="text-left">
                          <span className="text-sm font-semibold text-gray-900 block">
                            {employee.remainingCasualLeaves || 0}
                          </span>
                          <span className="text-xs text-gray-500">remaining</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sick Leave */}
                  <div className="col-span-2 text-center">
                    {editMode === employee._id ? (
                      <input
                        type="number"
                        name="remainingSickLeaves"
                        value={formData.remainingSickLeaves}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <FiHeart className="text-red-500" size={18} />
                        <div className="text-left">
                          <span className="text-sm font-semibold text-gray-900 block">
                            {employee.remainingSickLeaves || 0}
                          </span>
                          <span className="text-xs text-gray-500">remaining</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end space-x-2">
                    {editMode === employee._id ? (
                      <>
                        <button
                          onClick={() => handleSubmit(employee.email)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium shadow-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditMode(null)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(employee._id)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => toggleExpand(employee._id)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                          title="View History"
                        >
                          {expandedEmployee === employee._id ? (
                            <FiChevronUp size={18} />
                          ) : (
                            <FiChevronDown size={18} />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedEmployee === employee._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-6 bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-200">
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                              <FiTrendingUp className="mr-2 text-indigo-500" />
                              KPI History
                            </h3>
                            <div className="h-64">
                              {kpiHistory.length > 0 ? (
                                <Line data={kpiChartData} options={chartOptions} />
                              ) : (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                  No KPI history available
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                              <FiDollarSign className="mr-2 text-green-500" />
                              Commission History
                            </h3>
                            <div className="h-64">
                              {commissionHistory.length > 0 ? (
                                <Line data={commissionChartData} options={chartOptions} />
                              ) : (
                                <div className="h-full flex items-center justify-content text-gray-500">
                                  No commission history available
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                              <FiCalendar className="mr-2 text-orange-500" />
                              Leave History
                            </h3>
                            <div className="h-64">
                              {leaveHistory.length > 0 ? (
                                <Line data={leaveChartData} options={chartOptions} />
                              ) : (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                  No leave history available
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Recent Activity
                          </h3>
                          <div className="space-y-3">
                            {[...kpiHistory, ...commissionHistory, ...leaveHistory]
                              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                              .slice(0, 5)
                              .map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <div className={`w-2 h-2 rounded-full ${
                                      item.KPI ? "bg-indigo-500" :
                                      item.Commission ? "bg-green-500" : "bg-orange-500"
                                    }`} />
                                    <span className="font-medium text-gray-700">
                                      {item.KPI ? "KPI Updated" :
                                       item.Commission ? "Commission Updated" : "Leave Balance Updated"}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {item.KPI && `New KPI: ${item.KPI}`}
                                      {item.Commission && `New Commission: ${item.Commission}tk`}
                                      {item.remainingCasualLeaves !== undefined && `Casual Leaves: ${item.remainingCasualLeaves}`}
                                      {item.remainingSickLeaves !== undefined && `Sick Leaves: ${item.remainingSickLeaves}`}
                                    </span>
                                  </div>
                                  <span className="text-sm text-gray-400">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                  </span>
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