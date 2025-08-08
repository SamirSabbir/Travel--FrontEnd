import React from "react";
import { FiUser } from "react-icons/fi";

const SaleSelector = ({
  sales,
  selectedSale,
  setSelectedSale,
  setFormData,
}) => {
  const handleSaleChange = (e) => {
    const saleId = e.target.value;
    setSelectedSale(saleId);
    setFormData((prev) => ({ ...prev, saleId }));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Sale
      </label>
      <select
        value={selectedSale}
        onChange={handleSaleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">Select a sale</option>
        {sales.map((sale) => (
          <option key={sale._id} value={sale._id}>
            {sale.customerName} - {sale.phoneNumber}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SaleSelector;
