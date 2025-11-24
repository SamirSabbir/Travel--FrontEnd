import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { format, differenceInDays } from "date-fns";
import Cookies from "js-cookie";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const SpecialRequest = () => {
  const [activeTab, setActiveTab] = useState("commission");
  const [formData, setFormData] = useState({
    type: "CommissionWithdrawal",
    message: "",
    leaveDates: [],
    commissionAmount: "",
    employeeId: "",
    requestDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [profile, setProfile] = useState(null);
  const [userRequests, setUserRequests] = useState({
    items: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalRequests: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  });
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const user = JSON.parse(Cookies.get("user") || "{}");

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const isEmployee =
          user.role?.toLowerCase() === "employee" ||
          user.role?.toLowerCase() === "officeboy";

        const profileUrl = isEmployee
          ? "/users/employeeProfile"
          : "/users/admin-profile";

        const response = await axios.get(profileUrl);
        setProfile(response?.data?.data || {});
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, [user.role]);

  // Fetch user's special requests
  const fetchUserRequests = async (page = 1) => {
    try {
      setLoadingRequests(true);
      const response = await axios.get(
        `/specialRequest/user?page=${page}&limit=${limit}`
      );
      if (response.data.success) {
        setUserRequests(response.data.data);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Failed to fetch user requests", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Fetch requests when component mounts or when new request is submitted
  useEffect(() => {
    fetchUserRequests(currentPage);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrors({});
    setSubmitMessage("");

    if (tab === "commission") {
      setFormData({
        ...formData,
        type: "CommissionWithdrawal",
        message: "",
        leaveDates: [],
        commissionAmount: "",
      });
    } else if (tab === "leave") {
      setFormData({
        ...formData,
        type: "CasualLeave",
        message: "",
        leaveDates: [],
        commissionAmount: "",
      });
      setDateRange([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    } else if (tab === "other") {
      setFormData({
        ...formData,
        type: "Other",
        message: "",
        leaveDates: [],
        commissionAmount: "",
      });
    } else if (tab === "requests") {
      // Refresh requests when switching to requests tab
      fetchUserRequests(1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateRangeChange = (item) => {
    const { startDate, endDate } = item.selection;
    const daysDifference = differenceInDays(endDate, startDate) + 1;

    if (daysDifference > 2) {
      setErrors({
        ...errors,
        leaveDates: "You can select maximum 2 days",
      });
      return;
    }

    setDateRange([item.selection]);
    setErrors({ ...errors, leaveDates: "" });

    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(format(new Date(currentDate), "yyyy-MM-dd"));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setFormData({
      ...formData,
      leaveDates: dates,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (activeTab === "commission") {
      if (!formData.commissionAmount || formData.commissionAmount <= 0) {
        newErrors.commissionAmount = "Please enter a valid commission amount";
      }
    } else if (activeTab === "leave") {
      if (formData.leaveDates.length === 0) {
        newErrors.leaveDates = "Please select at least one date";
      } else if (formData.leaveDates.length > 2) {
        newErrors.leaveDates = "You can select maximum 2 dates";
      }
    } else if (activeTab === "other") {
      if (!formData.message.trim()) {
        newErrors.message = "Please enter your request message";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const submissionData = {
        ...formData,
        employeeId: user._id || "current-user-id",
        commissionAmount: formData.commissionAmount
          ? Number(formData.commissionAmount)
          : undefined,
        approved: false,
      };

      const response = await axios.post("/specialRequest", submissionData);

      setSubmitMessage("Request submitted successfully!");

      // Refresh requests after successful submission
      fetchUserRequests(1);

      // Reset form
      if (activeTab === "commission") {
        setFormData({ ...formData, commissionAmount: "" });
      } else if (activeTab === "leave") {
        setFormData({ ...formData, leaveDates: [] });
        setDateRange([
          {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
          },
        ]);
      } else if (activeTab === "other") {
        setFormData({ ...formData, message: "" });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitMessage("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter requests by type for display
  const getRequestsByType = (type) => {
    return userRequests.items.filter((request) => request.type === type);
  };

  const commissionRequests = getRequestsByType("CommissionWithdrawal");
  const leaveRequests = userRequests.items.filter(
    (request) => request.type === "CasualLeave" || request.type === "SickLeave"
  );
  const otherRequests = getRequestsByType("Other");

  const getStatusBadge = (request) => {
    if (request.cancelled) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
          Cancelled
        </span>
      );
    }
    if (request.approved) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          Approved
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
        Pending
      </span>
    );
  };

  const getTypeDisplayName = (type) => {
    switch (type) {
      case "CommissionWithdrawal":
        return "Commission Withdrawal";
      case "CasualLeave":
        return "Casual Leave";
      case "SickLeave":
        return "Sick Leave";
      case "Other":
        return "Other Request";
      default:
        return type;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Special Request Portal
        </h2>
        <p className="text-gray-600">
          Submit your requests and manage your needs efficiently
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        {/* Enhanced Tabs */}
        <div className="flex bg-gray-50 border-b border-gray-200">
          <button
            className={`flex-1 py-4 px-6 font-semibold text-center transition-all duration-200 ${
              activeTab === "commission"
                ? "bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm"
                : "text-gray-600 hover:text-blue-500 hover:bg-gray-100"
            }`}
            onClick={() => handleTabChange("commission")}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              <span>Commission</span>
            </div>
          </button>
          <button
            className={`flex-1 py-4 px-6 font-semibold text-center transition-all duration-200 ${
              activeTab === "leave"
                ? "bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm"
                : "text-gray-600 hover:text-blue-500 hover:bg-gray-100"
            }`}
            onClick={() => handleTabChange("leave")}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Leave Request</span>
            </div>
          </button>
          <button
            className={`flex-1 py-4 px-6 font-semibold text-center transition-all duration-200 ${
              activeTab === "other"
                ? "bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm"
                : "text-gray-600 hover:text-blue-500 hover:bg-gray-100"
            }`}
            onClick={() => handleTabChange("other")}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <span>Other Request</span>
            </div>
          </button>
          <button
            className={`flex-1 py-4 px-6 font-semibold text-center transition-all duration-200 ${
              activeTab === "requests"
                ? "bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm"
                : "text-gray-600 hover:text-blue-500 hover:bg-gray-100"
            }`}
            onClick={() => handleTabChange("requests")}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span>My Requests</span>
            </div>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {/* Commission Withdrawal Form */}
          {activeTab === "commission" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ... (existing commission form content remains the same) ... */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Amount to Withdraw
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-medium">$</span>
                  </div>
                  <input
                    type="number"
                    name="commissionAmount"
                    value={formData.commissionAmount}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.commissionAmount && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.commissionAmount}
                  </p>
                )}
              </div>

              {/* User Info Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  User Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-800">
                      {user.name || "Current User"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-800">
                      {user.email || "user@example.com"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Commission:</span>
                    <span className="font-medium text-green-600">
                      {profile?.commission || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Request...
                  </div>
                ) : (
                  "Send Withdrawal Request"
                )}
              </button>
            </form>
          )}

          {/* Leave Request Form */}
          {activeTab === "leave" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ... (existing leave form content remains the same) ... */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Leave Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.type === "CasualLeave"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="CasualLeave"
                      checked={formData.type === "CasualLeave"}
                      onChange={handleInputChange}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <span className="font-medium text-gray-800">
                        Casual Leave
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        Remaining:{" "}
                        <span className="font-semibold text-green-600">
                          {profile?.remainingCasualLeaves ?? "N/A"}
                        </span>
                      </p>
                    </div>
                  </label>
                  <label
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.type === "SickLeave"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="SickLeave"
                      checked={formData.type === "SickLeave"}
                      onChange={handleInputChange}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <span className="font-medium text-gray-800">
                        Sick Leave
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        Remaining:{" "}
                        <span className="font-semibold text-green-600">
                          {profile?.remainingSickLeaves ?? "N/A"}
                        </span>
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Select Dates (Maximum 2 days)
                </label>

                <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
                  <DateRange
                    editableDateInputs={true}
                    onChange={handleDateRangeChange}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                    minDate={new Date()}
                    className="w-full"
                  />
                </div>

                {errors.leaveDates && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.leaveDates}
                  </p>
                )}

                {formData.leaveDates.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="font-medium text-green-800 mb-2 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Selected Dates
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {formData.leaveDates.map((date, index) => (
                        <div key={date} className="flex items-center text-sm">
                          <span className="bg-white px-3 py-1 rounded-lg border border-green-200 font-medium text-green-700">
                            {format(new Date(date), "MMMM d, yyyy")}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-green-700 mt-3 font-medium">
                      Total days selected: {formData.leaveDates.length}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Request...
                  </div>
                ) : (
                  "Submit Leave Request"
                )}
              </button>
            </form>
          )}

          {/* Other Request Form */}
          {activeTab === "other" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ... (existing other request form content remains the same) ... */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Request Details
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Please describe your request in detail. Be specific about what you need and include any relevant information that will help us process your request efficiently..."
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Request...
                  </div>
                ) : (
                  "Submit Request"
                )}
              </button>
            </form>
          )}

          {/* My Requests Tab */}
          {activeTab === "requests" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  My Special Requests
                </h3>
                <div className="text-sm text-gray-600">
                  Total: {userRequests.pagination.totalRequests} requests
                </div>
              </div>

              {loadingRequests ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : userRequests.items.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No requests found
                  </h3>
                  <p className="mt-2 text-gray-500">
                    You haven't made any special requests yet.
                  </p>
                </div>
              ) : (
                <>
                  {/* Commission Requests Section */}
                  {commissionRequests.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        Commission Withdrawals
                      </h4>
                      <div className="grid gap-4">
                        {commissionRequests.map((request) => (
                          <div
                            key={request._id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium text-gray-900">
                                  {getTypeDisplayName(request.type)}
                                </h5>
                                <p className="text-sm text-gray-600 mt-1">
                                  Amount:{" "}
                                  <span className="font-semibold">
                                    ${request.commissionAmount}
                                  </span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Created:{" "}
                                  {format(
                                    new Date(request.createdAt),
                                    "MMM d, yyyy 'at' h:mm a"
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getStatusBadge(request)}
                                {request.approvedBy && (
                                  <span className="text-xs text-gray-500">
                                    by {request.approvedBy}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Leave Requests Section */}
                  {leaveRequests.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Leave Requests
                      </h4>
                      <div className="grid gap-4">
                        {leaveRequests.map((request) => (
                          <div
                            key={request._id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium text-gray-900">
                                  {getTypeDisplayName(request.type)}
                                </h5>
                                <p className="text-sm text-gray-600 mt-1">
                                  Dates:{" "}
                                  {request.leaveDates &&
                                  request.leaveDates.length > 0 ? (
                                    request.leaveDates.map((date, idx) => (
                                      <span
                                        key={date}
                                        className="font-semibold"
                                      >
                                        {format(new Date(date), "MMM d, yyyy")}
                                        {idx < request.leaveDates.length - 1
                                          ? ", "
                                          : ""}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-gray-400">
                                      No dates specified
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Created:{" "}
                                  {format(
                                    new Date(request.createdAt),
                                    "MMM d, yyyy 'at' h:mm a"
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getStatusBadge(request)}
                                {request.approvedBy && (
                                  <span className="text-xs text-gray-500">
                                    by {request.approvedBy}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other Requests Section */}
                  {otherRequests.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        Other Requests
                      </h4>
                      <div className="grid gap-4">
                        {otherRequests.map((request) => (
                          <div
                            key={request._id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">
                                  {getTypeDisplayName(request.type)}
                                </h5>
                                {request.message && (
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {request.message}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                  Created:{" "}
                                  {format(
                                    new Date(request.createdAt),
                                    "MMM d, yyyy 'at' h:mm a"
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                {getStatusBadge(request)}
                                {request.approvedBy && (
                                  <span className="text-xs text-gray-500">
                                    by {request.approvedBy}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pagination */}
                  {userRequests.pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 mt-8">
                      <button
                        onClick={() => fetchUserRequests(currentPage - 1)}
                        disabled={!userRequests.pagination.hasPrevPage}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-700">
                        Page {currentPage} of{" "}
                        {userRequests.pagination.totalPages}
                      </span>
                      <button
                        onClick={() => fetchUserRequests(currentPage + 1)}
                        disabled={!userRequests.pagination.hasNextPage}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Submission Message */}
          {submitMessage && (
            <div
              className={`mt-6 p-4 rounded-xl border ${
                submitMessage.includes("success")
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              } transition-all duration-300`}
            >
              <div className="flex items-center">
                {submitMessage.includes("success") ? (
                  <svg
                    className="w-5 h-5 mr-3 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 mr-3 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <span className="font-medium">{submitMessage}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialRequest;
