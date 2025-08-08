import React from "react";
import {
  FiDollarSign,
  FiPercent,
  FiUser,
  FiMail,
  FiLink,
  FiCalendar,
} from "react-icons/fi";

const AccountInfoViewer = ({ accountData }) => {
  if (!accountData)
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No account information to display</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Account Details</h1>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          Completed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sale Information */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <FiUser className="mr-2" /> Sale Information
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Customer</p>
              <p className="text-gray-800">
                {accountData.saleId?.customerName || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Sale ID</p>
              <p className="text-gray-800 font-mono">
                {accountData.saleId?._id || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date Created</p>
              <p className="text-gray-800 flex items-center">
                <FiCalendar className="mr-2" />
                {new Date(accountData.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <FiDollarSign className="mr-2" /> Financial Summary
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-sm font-medium text-gray-500">Income</p>
              <p className="text-xl font-bold text-green-600">
                ${accountData.income?.toLocaleString() || "0"}
              </p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-sm font-medium text-gray-500">Revenue</p>
              <p className="text-xl font-bold text-blue-600">
                ${accountData.revenue?.toLocaleString() || "0"}
              </p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-sm font-medium text-gray-500">Expense</p>
              <p className="text-xl font-bold text-red-600">
                ${accountData.expense?.toLocaleString() || "0"}
              </p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-sm font-medium text-gray-500">Commission</p>
              <p className="text-xl font-bold text-purple-600">
                ${accountData.commission?.toLocaleString() || "0"}
              </p>
            </div>
          </div>
        </div>

        {/* Commission Details */}
        <div className="md:col-span-2 bg-purple-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
            <FiPercent className="mr-2" /> Commission Distribution
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                    Sales Person
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accountData.commissionDetails?.map((detail, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center">
                          <FiMail className="text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {detail.salesPersonEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {detail.commissionRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${detail.commissionAmount?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiMail className="mr-2" /> Admin Information
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Admin Email</p>
              <p className="text-gray-800">{accountData.accountAdminEmail}</p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
            <FiLink className="mr-2" /> Receipt
          </h2>
          <div className="mt-2">
            <a
              href={accountData.receipt}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              View Receipt
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoViewer;
