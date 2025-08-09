import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { FiDollarSign, FiUser, FiCalendar, FiFileText } from "react-icons/fi";

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("/account/my-accounts");
        setAccounts(response.data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch accounts");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Accounts</h1>
      
      <div className="space-y-4">
        {accounts.map((account) => (
          <div key={account._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <FiDollarSign className="text-blue-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="font-semibold">${account.revenue.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FiDollarSign className="text-red-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Expense</p>
                  <p className="font-semibold">${account.expense.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FiDollarSign className="text-green-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Income</p>
                  <p className="font-semibold">${account.income.toLocaleString()}</p>
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
              <h3 className="font-medium text-gray-700 mb-2">Commission Details</h3>
              <div className="space-y-3">
                {account.commissionDetails.map((detail, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{detail.salesPersonEmail}</span>
                      <span className="text-sm">
                        {detail.commissionRate}% (${detail.commissionAmount.toLocaleString()})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {account.receipt && (
              <div className="mt-4">
                <a 
                  href={account.receipt} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FiFileText className="mr-2" />
                  View Receipt
                </a>
              </div>
            )}

            <div className="mt-4 text-sm text-gray-500">
              <FiCalendar className="inline mr-2" />
              Created: {new Date(account.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountList;