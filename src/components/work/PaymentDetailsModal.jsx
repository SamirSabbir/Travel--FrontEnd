import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import { X, Loader2, Upload, File, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const PaymentDetailsModal = ({ 
  isOpen, 
  onClose, 
  paymentDetails, 
  onPaymentFieldChange, 
  onPaymentUpdate,
  updatingPayment,
  userRole
}) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const uploadToCloudinary = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", uploadPreset);
    uploadData.append("cloud_name", cloudName);
    uploadData.append("resource_type", "auto");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const fileUrl = data.secure_url;

      // Add the new document to the uploadedDocuments array
      onPaymentFieldChange("uploadedDocument", [
        ...(paymentDetails.uploadedDocument || []),
        fileUrl
      ]);

      setPreviewUrl(fileUrl);
      toast.success("File uploaded successfully!");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const removeDocument = (index) => {
    const updatedDocuments = [...paymentDetails.uploadedDocument];
    updatedDocuments.splice(index, 1);
    onPaymentFieldChange("uploadedDocument", updatedDocuments);
  };

  const isEditable = userRole === "AccountAdmin"

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
    >
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <h3 className="text-xl font-bold text-gray-800">Payment Details</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {paymentDetails && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agency Name
                </label>
                <input
                  type="text"
                  value={paymentDetails.agencyName || ""}
                  onChange={(e) => onPaymentFieldChange("agencyName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled = {!isEditable}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference
                </label>
                <input
                  type="text"
                  value={paymentDetails.reference || ""}
                  onChange={(e) => onPaymentFieldChange("reference", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled = {!isEditable}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deposit Date
                </label>
                <input
                  type="date"
                  value={paymentDetails.depositDate?.slice(0, 10) || ""}
                  onChange={(e) => onPaymentFieldChange("depositDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled = {!isEditable}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentDetails.paymentStatus || ""}
                  onChange={(e) => onPaymentFieldChange("paymentStatus", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled = {!isEditable}
                >
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Partial Payment">Partial Payment</option>
                  <option value="Full Payment">Full Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentDetails.mode || ""}
                  onChange={(e) => onPaymentFieldChange("mode", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled = {!isEditable}
                >
                  <option value="">Select Mode</option>
                  <option value="Offline Payment">Offline Payment</option>
                  <option value="Online Payment">Online Payment</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type
                </label>
                <select
                  value={paymentDetails.type || ""}
                  onChange={(e) => onPaymentFieldChange("type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={!isEditable}
                >
                  <option value="">Select Type</option>
                  <option value="Online Transfer">Online Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deposited From Bank
                </label>
                <input
                  type="text"
                  value={paymentDetails.depositedFrom || ""}
                  onChange={(e) => onPaymentFieldChange("depositedFrom", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={!isEditable}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch
                </label>
                <input
                  type="text"
                  value={paymentDetails.branch || ""}
                  onChange={(e) => onPaymentFieldChange("branch", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={!isEditable}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deposit Reference
                </label>
                <input
                  type="text"
                  value={paymentDetails.depositReferenceIdentifier || ""}
                  onChange={(e) => onPaymentFieldChange("depositReferenceIdentifier", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={!isEditable}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deposited To Account
                </label>
                <input
                  type="text"
                  value={paymentDetails.depositedToAccount || ""}
                  onChange={(e) => onPaymentFieldChange("depositedToAccount", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={!isEditable}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Given Amount
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={paymentDetails.givenAmount || ""}
                    onChange={(e) => onPaymentFieldChange("givenAmount", e.target.value)}
                    className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isEditable}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Charge
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={paymentDetails.serviceCharge || ""}
                    onChange={(e) => onPaymentFieldChange("serviceCharge", e.target.value)}
                    className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isEditable}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Net Amount
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={paymentDetails.amount || ""}
                    onChange={(e) => onPaymentFieldChange("amount", e.target.value)}
                    className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isEditable}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uploaded Documents
              </label>
              
              {/* File Upload Section */}
              <div className="mb-4 border border-dashed border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      disabled={!isEditable}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </label>
                    {file && (
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <File className="h-4 w-4 mr-2" />
                        {file.name}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={uploadToCloudinary}
                    
                    disabled={!file || isUploading || !isEditable}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    
                  >
                    
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Upload
                  </button>
                </div>
              </div>

              {/* Uploaded Documents List */}
              {paymentDetails.uploadedDocument?.length > 0 ? (
                <div className="space-y-2">
                  {paymentDetails.uploadedDocument.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <File className="h-4 w-4 mr-2 text-gray-500" />
                        <a 
                          href={doc} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate max-w-xs"
                        >
                          {doc.split('/').pop()}
                        </a>
                      </div>
                      <button
                        onClick={() => removeDocument(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No documents uploaded</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
             {isEditable && (
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
             )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PaymentDetailsModal;