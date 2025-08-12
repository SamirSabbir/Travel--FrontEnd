import React, { useState } from "react";
import { FiLink, FiUpload, FiX, FiFile, FiImage, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";

const ReceiptUpload = ({ formData, setFormData }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(formData.receipt || "");
  const [file, setFile] = useState(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Please upload a valid file (PDF, Excel, or Image)");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(""); // no preview for non-images
    }
  };

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
      setFormData((prev) => ({ ...prev, receipt: data.secure_url }));
      setPreviewUrl(data.secure_url);
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl("");
    setFormData((prev) => ({ ...prev, receipt: "" }));
  };

  const getFileIcon = () => {
    if (!file) return null;

    if (file.type.startsWith("image/")) {
      return <FiImage className="text-blue-500 text-xl mr-2" />;
    } else if (file.type === "application/pdf") {
      return <FiFile className="text-red-500 text-xl mr-2" />;
    } else if (file.type.includes("excel") || file.type.includes("spreadsheetml")) {
      return <FiFile className="text-green-500 text-xl mr-2" />;
    } else {
      return <FiFile className="text-gray-500 text-xl mr-2" />;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Receipt Upload{" "}
          <span className="text-gray-500 text-xs">(PDF, Excel, or images up to 5MB)</span>
        </label>

        {!file ? (
          <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <div className="space-y-2 text-center">
              <div className="flex justify-center">
                <FiUpload className="h-8 w-8 text-gray-400" />
              </div>
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Choose a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png,.gif"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">or drag and drop</p>
            </div>
          </div>
        ) : (
          <div className="mt-1">
            <div
              className={`p-4 border rounded-lg ${
                previewUrl ? "border-green-200 bg-green-50" : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start">
                {getFileIcon()}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB · {file.type}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="ml-2 p-1 text-gray-400 hover:text-gray-500"
                >
                  <FiX size={18} />
                </button>
              </div>

              {file.type.startsWith("image/") && previewUrl && (
                <div className="mt-3 relative">
                  <img
                    src={previewUrl}
                    alt="Receipt preview"
                    className="h-32 w-full object-contain rounded border border-gray-200"
                  />
                </div>
              )}

              {/* Upload button now ALWAYS shows if file exists */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={uploadToCloudinary}
                  disabled={isUploading}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FiUpload className="-ml-0.5 mr-1.5 h-3 w-3" />
                      Upload to Cloudinary
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {previewUrl && formData.receipt && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-center">
            <FiCheck className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm font-medium text-green-800">
              File successfully uploaded
            </span>
          </div>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <FiLink className="mr-1" />
            View uploaded file
          </a>
        </div>
      )}
    </div>
  );
};

export default ReceiptUpload;
