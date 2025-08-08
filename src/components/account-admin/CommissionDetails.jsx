import React, { useState } from "react";
import { FiMail, FiPercent, FiDollarSign } from "react-icons/fi";
import { toast } from "react-toastify";

const CommissionDetails = ({ formData, setFormData }) => {
  const [commissionDetail, setCommissionDetail] = useState({
    salesPersonEmail: "",
    commissionRate: "",
    commissionAmount: "",
  });

  const handleCommissionDetailChange = (e) => {
    const { name, value } = e.target;
    setCommissionDetail((prev) => ({ ...prev, [name]: value }));

    if (name === "commissionRate" && formData.revenue) {
      const rate = parseFloat(value) || 0;
      const amount = ((rate / 100) * formData.revenue).toFixed(2);
      setCommissionDetail((prev) => ({
        ...prev,
        commissionAmount: amount,
      }));
    }
  };

  const addCommissionDetail = () => {
    if (
      !commissionDetail.salesPersonEmail ||
      !commissionDetail.commissionRate
    ) {
      toast.error("Please fill all required commission detail fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(commissionDetail.salesPersonEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      commissionDetails: [
        ...prev.commissionDetails,
        {
          salesPersonEmail: commissionDetail.salesPersonEmail,
          commissionRate: parseFloat(commissionDetail.commissionRate),
          commissionAmount: parseFloat(commissionDetail.commissionAmount) || 0,
        },
      ],
    }));

    setCommissionDetail({
      salesPersonEmail: "",
      commissionRate: "",
      commissionAmount: "",
    });
  };

  const removeCommissionDetail = (index) => {
    const updatedDetails = [...formData.commissionDetails];
    updatedDetails.splice(index, 1);
    setFormData((prev) => ({ ...prev, commissionDetails: updatedDetails }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">Commission Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sales Person Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-400" />
            </div>
            <input
              type="email"
              name="salesPersonEmail"
              value={commissionDetail.salesPersonEmail}
              onChange={handleCommissionDetailChange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="employee@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Commission Rate (%) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiPercent className="text-gray-400" />
            </div>
            <input
              type="number"
              name="commissionRate"
              value={commissionDetail.commissionRate}
              onChange={handleCommissionDetailChange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10"
              min="0"
              max="100"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Commission Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiDollarSign className="text-gray-400" />
            </div>
            <input
              type="number"
              name="commissionAmount"
              value={commissionDetail.commissionAmount}
              onChange={handleCommissionDetailChange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1000"
              min="0"
              step="0.01"
              readOnly
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={addCommissionDetail}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Commission Detail
      </button>

      {formData.commissionDetails.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formData.commissionDetails.map((detail, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {detail.salesPersonEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {detail.commissionRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${detail.commissionAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      type="button"
                      onClick={() => removeCommissionDetail(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CommissionDetails;
