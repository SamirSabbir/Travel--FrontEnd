import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SaleSelector from "./SaleSelector";
import FinancialInfo from "./FinancialInfo";
import CommissionDetails from "./CommissionDetails";
import ReceiptUpload from "./ReceiptUpload";
import {
  FiDollarSign,
  FiUser,
  FiCalendar,
  FiFileText,
  FiLink,
} from "react-icons/fi";
import { Tab } from "@headlessui/react";
import Cookies from "js-cookie";

const AccountInfo = () => {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState("");
  const [formData, setFormData] = useState({
    saleId: "",
    accountName:"",
    revenue: "",
    expense: "",
    commission: "",
    income: "",
    commissionDetails: [],
    receipt: "",
    accountAdminEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);

  useEffect(() => {
    // Get user data from cookies
    const userData = JSON.parse(Cookies.get("user"));
    if (userData?.email) {
      setFormData((prev) => ({
        ...prev,
        accountAdminEmail: userData.email,
      }));
    }

    fetchSales();
    fetchAccounts();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get("/sales");
      setSales(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch sales data");
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get("/account/my-accounts");
      setAccounts(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch accounts");
    } finally {
      setAccountsLoading(false);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "saleId",
      "accountName",
      "revenue",
      "expense",
      "commission",
      "income",
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
        accountName: formData.accountName,
        revenue: Number(formData.revenue),
        expense: Number(formData.expense),
        commission: Number(formData.commission),
        income: Number(formData.income),
        commissionDetails: formData.commissionDetails.map((detail) => ({
          salesPersonEmail: detail.salesPersonEmail,
          commissionRate: Number(detail.commissionRate),
          commissionAmount: Number(detail.commissionAmount),
        })),
        receipt: formData.receipt,
        accountAdminEmail: formData.accountAdminEmail,
      };

      const response = await axios.post("/account", payload);
      toast.success(response.data.message);
      resetForm();
      fetchAccounts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      saleId: "",
      accountName:"",
      revenue: "",
      expense: "",
      commission: "",
      income: "",
      commissionDetails: [],
      receipt: "",
      accountAdminEmail: JSON.parse(Cookies.get("user"))?.email || "", // Reset with email from cookies
    });
    setSelectedSale("");
  };

  const getSelectedSaleData = () => {
    return sales.find((sale) => sale._id === selectedSale);
  };

  const renderAccountForm = () => (
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
          Account Admin
        </label>
        <div className="flex items-center p-3 bg-gray-50 rounded-md">
          <FiUser className="text-gray-500 mr-2" />
          <span className="font-medium">{formData.accountAdminEmail}</span>
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
  );

  const renderAccountList = () => {
    if (accountsLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (accounts.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">No accounts found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {accounts.map((account) => (
          <div
            key={account._id}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <FiDollarSign className="text-blue-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="font-semibold">
                    ${account.revenue.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FiDollarSign className="text-red-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Expense</p>
                  <p className="font-semibold">
                    ${account.expense.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FiDollarSign className="text-green-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Income</p>
                  <p className="font-semibold">
                    ${account.income.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FiUser className="text-purple-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Admin</p>
                  <p className="font-semibold">{account.accountAdminEmail}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-2">
                Commission Details
              </h3>
              <div className="space-y-3">
                {account.commissionDetails.map((detail, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        {detail.salesPersonEmail}
                      </span>
                      <span className="text-sm">
                        {detail.commissionRate}% ($
                        {detail.commissionAmount.toLocaleString()})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* {account.receipt && (
              <div className="mt-4">
                <a 
                  href={account.receipt} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FiFileText className="mr-2" />
                  Receipt
                </a>
              </div>
            )} */}

            <div className="bg-indigo-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                <FiLink className="mr-2" /> Receipt
              </h2>
              {account.receipt ? (
                <>
                  {/\.(jpg|jpeg|png|gif|webp)$/i.test(account.receipt) ? (
                    <div className="mt-2">
                      <img
                        src={account.receipt}
                        alt="Receipt Preview"
                        className="max-h-64 rounded border border-gray-300 shadow-sm"
                      />
                      <a
                        href={account.receipt}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-indigo-600 hover:text-indigo-800 underline"
                      >
                        Open full size
                      </a>
                    </div>
                  ) : (
                    <div className="mt-2 space-x-4">
                      <a
                        href={account.receipt}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 underline"
                      >
                        View File
                      </a>
                      {/* <a
                        href={account.receipt}
                        download
                        className="text-green-600 hover:text-green-800 underline"
                      >
                        Download
                      </a> */}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500">No receipt uploaded</p>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <FiCalendar className="inline mr-2" />
              Created: {new Date(account.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
              ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
              ${
                selected
                  ? "bg-white shadow"
                  : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
              }`
            }
          >
            Create Account
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
              ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
              ${
                selected
                  ? "bg-white shadow"
                  : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
              }`
            }
          >
            View Accounts
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Create Account
            </h1>
            {renderAccountForm()}
          </Tab.Panel>
          <Tab.Panel className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              My Accounts
            </h1>
            {renderAccountList()}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default AccountInfo;
