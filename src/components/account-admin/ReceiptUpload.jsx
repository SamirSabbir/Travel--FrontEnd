import React from "react";
import { FiLink } from "react-icons/fi";

const ReceiptUpload = ({ formData, setFormData }) => {
  const handleReceiptChange = (e) => {
    setFormData({ ...formData, receipt: e.target.value });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Receipt URL
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiLink className="text-gray-400" />
        </div>
        <input
          type="url"
          name="receipt"
          value={formData.receipt}
          onChange={handleReceiptChange}
          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/receipt.pdf"
        />
      </div>
    </div>
  );
};

export default ReceiptUpload;