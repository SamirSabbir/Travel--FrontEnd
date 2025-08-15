import React from 'react';
import Modal from 'react-modal';
import { X, Loader2 } from 'lucide-react';

const PaymentDetailsModal = ({ 
  isOpen, 
  onClose, 
  paymentDetails, 
  onPaymentFieldChange, 
  onPaymentUpdate,
  updatingPayment 
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
    >
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Payment Details</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {paymentDetails && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Status
              </label>
              <select
                value={paymentDetails.paymentStatus || ""}
                onChange={(e) => onPaymentFieldChange("paymentStatus", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Draft">Draft</option>
                <option value="Partial Payment">Partial Payment</option>
                <option value="Full Payment">Full Payment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Uploaded Documents
              </label>
              {paymentDetails.uploadedDocument && paymentDetails.uploadedDocument.length > 0 ? (
                <ul className="list-disc pl-5">
                  {paymentDetails.uploadedDocument.map((doc, index) => (
                    <li key={index} className="text-sm text-gray-600">{doc}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No documents uploaded</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={onPaymentUpdate}
                disabled={updatingPayment}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {updatingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : "Update Payment"}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PaymentDetailsModal;