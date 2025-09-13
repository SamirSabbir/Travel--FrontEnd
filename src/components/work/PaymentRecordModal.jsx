import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { X, Loader2, File, Calendar, DollarSign, Building, CreditCard } from "lucide-react";
import axios from "../../api/axios.js";

const PaymentRecordModal = ({ isOpen, onClose, workId }) => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && workId) {
      fetchPaymentRecord();
    }
  }, [isOpen, workId]);

  const fetchPaymentRecord = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/payment-details/${workId}`);
      
      if (response.data.success) {
        setPaymentData(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch payment record");
      }
    } catch (err) {
      console.error("Error fetching payment record:", err);
      setError(err.response?.data?.message || "Failed to fetch payment record");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Full Payment":
        return "bg-green-100 text-green-800";
      case "Partial Payment":
        return "bg-yellow-100 text-yellow-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Trusted":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
    >
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <h3 className="text-xl font-bold text-gray-800">Payment Record</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Loading payment record...</span>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-600">
            <p>{error}</p>
          </div>
        ) : paymentData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Client Information
                </h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Agency Name:</span>{" "}
                    {paymentData.agencyName || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Work ID:</span>{" "}
                    {paymentData.workId || "N/A"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Payment Status
                </h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(paymentData.paymentStatus)}`}>
                      {paymentData.paymentStatus || "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Amount:</span>{" "}
                    {paymentData.amount ? `$${paymentData.amount}` : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Timeline
              </h4>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Created:</span>{" "}
                  {paymentData.createdAt ? formatDate(paymentData.createdAt) : "N/A"}
                </p>
                <p>
                  <span className="font-medium">Last Updated:</span>{" "}
                  {paymentData.updatedAt ? formatDate(paymentData.updatedAt) : "N/A"}
                </p>
              </div>
            </div>

            {paymentData.uploadedDocument && paymentData.uploadedDocument.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <File className="h-5 w-5 mr-2" />
                  Documents
                </h4>
                <div className="space-y-2">
                  {paymentData.uploadedDocument.map((doc, index) => (
                    <div key={index} className="flex items-center">
                      <File className="h-4 w-4 mr-2 text-gray-500" />
                      <a
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        {doc.split("/").pop()}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display additional payment details if available in the API response */}
            {paymentData.reference && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentData.reference && (
                    <p>
                      <span className="font-medium">Reference:</span> {paymentData.reference}
                    </p>
                  )}
                  {paymentData.mode && (
                    <p>
                      <span className="font-medium">Mode:</span> {paymentData.mode}
                    </p>
                  )}
                  {paymentData.type && (
                    <p>
                      <span className="font-medium">Type:</span> {paymentData.type}
                    </p>
                  )}
                  {paymentData.depositedFrom && (
                    <p>
                      <span className="font-medium">Bank:</span> {paymentData.depositedFrom}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            No payment record found
          </div>
        )}

        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentRecordModal;