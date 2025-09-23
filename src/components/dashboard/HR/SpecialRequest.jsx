import React, { useState } from "react";
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

  const user = JSON.parse(Cookies.get("user") || "{}");

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
      // Reset date range
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

    // Generate array of dates between start and end
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
        // Ensure commissionAmount is a number (or undefined if not needed)
        commissionAmount: formData.commissionAmount
          ? Number(formData.commissionAmount)
          : undefined,
        // Always initialize approved to false when creating a new request
        approved: false,
      };

      const response = await axios.post("/specialRequest", submissionData);

      setSubmitMessage("Request submitted successfully!");

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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Special Request</h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "commission"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange("commission")}
        >
          Commission Withdrawal
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "leave"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange("leave")}
        >
          Leave Request
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "other"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange("other")}
        >
          Other Request
        </button>
      </div>

      {/* Commission Withdrawal Form */}
      {activeTab === "commission" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount to Withdraw
            </label>
            <input
              type="number"
              name="commissionAmount"
              value={formData.commissionAmount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
              step="0.01"
              min="0"
            />
            {errors.commissionAmount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.commissionAmount}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">
              <strong>User:</strong> {user.name || "Current User"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {user.email || "user@example.com"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Commission:</strong> {user.commission || "user"}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Send Request"}
          </button>
        </form>
      )}

      {/* Leave Request Form */}
      {activeTab === "leave" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leave Type
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="CasualLeave"
                  checked={formData.type === "CasualLeave"}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Casual Leave</span>
                <strong>Casual Leaves remain:</strong> {user.casualLeaves || ""}
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="SickLeave"
                  checked={formData.type === "SickLeave"}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Sick Leave</span>
                <p className="text-sm text-gray-600">
                  <strong>Sick Leaves remain:</strong> {user.sickLeaves || ""}
                </p>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Dates (Max 2 days)
            </label>

            <div className="mb-4">
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
              <p className="mt-1 text-sm text-red-600">{errors.leaveDates}</p>
            )}

            {formData.leaveDates.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700">
                  Selected Dates:
                </p>
                <ul className="text-sm text-gray-600 mt-1">
                  {formData.leaveDates.map((date) => (
                    <li key={date}>{format(new Date(date), "MMMM d, yyyy")}</li>
                  ))}
                </ul>
                <p className="text-sm text-gray-600 mt-1">
                  Total days: {formData.leaveDates.length}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Send Request"}
          </button>
        </form>
      )}

      {/* Other Request Form */}
      {activeTab === "other" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Please describe your request in detail..."
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Send Request"}
          </button>
        </form>
      )}

      {/* Submission Message */}
      {submitMessage && (
        <div
          className={`mt-4 p-3 rounded-md ${
            submitMessage.includes("success")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {submitMessage}
        </div>
      )}
    </div>
  );
};

export default SpecialRequest;
