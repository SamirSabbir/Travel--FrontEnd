import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SaleSelector from "./SaleSelector";
import FinancialInfo from "./FinancialInfo";
import CommissionDetails from "./CommissionDetails";
import ReceiptUpload from "./ReceiptUpload";
import { FiMail } from "react-icons/fi";

const AccountInfo = () => {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState("");
  const [formData, setFormData] = useState({
    saleId: "",
    revenue: "",
    expense: "",
    commission: "",
    income: "",
    commissionDetails: [],
    receipt: "",
    accountAdminEmail: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get("/sales");
      setSales(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch sales data");
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'saleId',
      'revenue',
      'expense',
      'commission',
      'income',
      'accountAdminEmail'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in ${field}`);
        return false;
      }
    }

    if (formData.commissionDetails.length === 0) {
      toast.error("Please add at least one commission detail");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        saleId: formData.saleId,
        revenue: Number(formData.revenue),
        expense: Number(formData.expense),
        commission: Number(formData.commission),
        income: Number(formData.income),
        commissionDetails: formData.commissionDetails.map(detail => ({
          salesPersonEmail: detail.salesPersonEmail,
          commissionRate: Number(detail.commissionRate),
          commissionAmount: Number(detail.commissionAmount)
        })),
        receipt: formData.receipt,
        accountAdminEmail: formData.accountAdminEmail
      };

      const response = await axios.post("/account", payload);
      toast.success(response.data.message);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      saleId: "",
      revenue: "",
      expense: "",
      commission: "",
      income: "",
      commissionDetails: [],
      receipt: "",
      accountAdminEmail: "",
    });
    setSelectedSale("");
  };

  const getSelectedSaleData = () => {
    return sales.find((sale) => sale._id === selectedSale);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Account Information</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <SaleSelector
          sales={sales}
          selectedSale={selectedSale}
          setSelectedSale={setSelectedSale}
          setFormData={setFormData}
        />

        {selectedSale && (
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium text-blue-800">Sale Information</h3>
            <p className="text-sm text-gray-600 mt-1">
              Customer: {getSelectedSaleData()?.customerName}
            </p>
            <p className="text-sm text-gray-600">
              Employees: {getSelectedSaleData()?.employeeEmails.join(", ")}
            </p>
          </div>
        )}

        <FinancialInfo formData={formData} setFormData={setFormData} />

        <CommissionDetails
          formData={formData}
          setFormData={setFormData}
          selectedSaleData={getSelectedSaleData()}
        />

        <ReceiptUpload formData={formData} setFormData={setFormData} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Admin Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-400" />
            </div>
            <input
              type="email"
              name="accountAdminEmail"
              value={formData.accountAdminEmail}
              onChange={(e) =>
                setFormData({ ...formData, accountAdminEmail: e.target.value })
              }
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
              required
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Submit Account Information"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountInfo;