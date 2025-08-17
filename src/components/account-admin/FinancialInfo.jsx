import React, { useState } from "react";
import { FiDollarSign, FiPercent } from "react-icons/fi";

const FinancialInfo = ({ formData, setFormData }) => {
  const [autoCalculate, setAutoCalculate] = useState(false);

 const handleInputChange = (e) => {
  const { name, value, type } = e.target;

  if (type === "number") {
    // Only allow numbers (or empty string)
    if (value === "" || !isNaN(value)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : parseFloat(value),
      }));

      // Auto calculate when income changes
      if (autoCalculate && name === "income") {
        const numericValue = value === "" ? 0 : parseFloat(value);
        const revenue = numericValue * 0.7;
        const expense = numericValue * 0.2;
        const commission = numericValue * 0.1;
        setFormData((prev) => ({
          ...prev,
          revenue: revenue || "",
          expense: expense || "",
          commission: commission || "",
        }));
      }
    }
  } else {
    // For text inputs (like accountName), just update directly
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">
          Account Name <span className="text-red-500">*</span>
        </label>
           <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiDollarSign className="text-gray-400" />
          </div>
          <input
            type="text"
            name="accountName"
            value={formData.accountName}
            onChange={handleInputChange}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Account Name"
            required
            min="0"
            step="0.01"
          />
        </div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Income <span className="text-red-500">*</span>
        </label>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiDollarSign className="text-gray-400" />
          </div>
          <input
            type="number"
            name="income"
            value={formData.income}
            onChange={handleInputChange}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter income"
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="autoCalculate"
          checked={autoCalculate}
          onChange={() => setAutoCalculate(!autoCalculate)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label
          htmlFor="autoCalculate"
          className="ml-2 block text-sm text-gray-700"
        >
          Auto-calculate revenue, expense, and commission
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Revenue <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiDollarSign className="text-gray-400" />
          </div>
          <input
            type="number"
            name="revenue"
            value={formData.revenue}
            onChange={handleInputChange}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter revenue"
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expense <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiDollarSign className="text-gray-400" />
          </div>
          <input
            type="number"
            name="expense"
            value={formData.expense}
            onChange={handleInputChange}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter expense"
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Commission <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiDollarSign className="text-gray-400" />
          </div>
          <input
            type="number"
            name="commission"
            value={formData.commission}
            onChange={handleInputChange}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter commission"
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialInfo;
