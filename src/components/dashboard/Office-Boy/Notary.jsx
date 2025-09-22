import React, { useState, useEffect, useRef } from "react";
import axios from "../../../api/axios";
import Modal from "react-modal";
import { X, Upload, File, Trash2, Eye, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const Notary = () => {
  const [employees, setEmployees] = useState([]);
  const [entries, setEntries] = useState([]);
  const [inputRows, setInputRows] = useState([
    {
      id: 1,
      date: "",
      clientName: "",
      documents: "",
      employee: "",
      note: "",
      bill: "",
      status: "Pending",
      uploadedDocuments: [] // Add uploaded documents array
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [currentRowId, setCurrentRowId] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const entriesPerPage = 5;
  const fileInputRef = useRef(null);

  // Cloudinary configuration
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/users/findAllUsers");
        setEmployees(response.data.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        alert("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleInputChange = (id, e) => {
    const { name, value } = e.target;
    
    setInputRows(prev => prev.map(row => 
      row.id === id ? { ...row, [name]: value } : row
    ));
  };

  const addInputRow = () => {
    const newId = inputRows.length > 0 ? Math.max(...inputRows.map(row => row.id)) + 1 : 1;
    setInputRows([...inputRows, {
      id: newId,
      date: "",
      clientName: "",
      documents: "",
      employee: "",
      note: "",
      bill: "",
      status: "Pending",
      uploadedDocuments: []
    }]);
  };

  const removeInputRow = (id) => {
    if (inputRows.length > 1) {
      setInputRows(inputRows.filter(row => row.id !== id));
    }
  };

  // Document upload functions
  const openDocumentModal = (rowId) => {
    setCurrentRowId(rowId);
    setDocumentModalOpen(true);
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeDocumentModal = () => {
    setDocumentModalOpen(false);
    setCurrentRowId(null);
    setFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      // Check if the file is a JPG/JPEG
      const allowedTypes = ["image/jpeg", "image/jpg", "application/pdf"];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Only JPG/JPEG and PDF files are allowed");
        e.target.value = "";
        return;
      }

      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const uploadToCloudinary = async () => {
    if (!file || !currentRowId) {
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

      // Add the new document to the row's uploadedDocuments array
      setInputRows(prev => prev.map(row => 
        row.id === currentRowId 
          ? { ...row, uploadedDocuments: [...row.uploadedDocuments, fileUrl] } 
          : row
      ));

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

  const removeDocument = (rowId, index) => {
    setInputRows(prev => prev.map(row => 
      row.id === rowId 
        ? { 
            ...row, 
            uploadedDocuments: row.uploadedDocuments.filter((_, i) => i !== index) 
          } 
        : row
    ));
  };

  const saveAllEntries = async () => {
    try {
      // Filter out incomplete rows
      const validRows = inputRows.filter(row => 
        row.date && row.clientName && row.documents && row.employee
      );

      if (validRows.length === 0) {
        alert("Please fill in all required fields in at least one row");
        return;
      }

      const newEntries = validRows.map(row => ({
        id: Date.now() + row.id, // Ensure unique ID
        date: row.date,
        clientName: row.clientName,
        documents: row.documents,
        employee: row.employee,
        note: row.note,
        bill: row.bill,
        status: row.status,
        uploadedDocuments: row.uploadedDocuments // Include uploaded documents
      }));

      setEntries([...entries, ...newEntries]);
      
      // Reset input rows but keep one empty row
      setInputRows([{
        id: 1,
        date: "",
        clientName: "",
        documents: "",
        employee: "",
        note: "",
        bill: "",
        status: "Pending",
        uploadedDocuments: []
      }]);
      
      alert(`${newEntries.length} notary record(s) saved successfully!`);
    } catch (error) {
      console.error("Error saving notary data:", error);
      alert("Failed to save notary records");
    }
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(entries.length / entriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
    
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }
    
    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => paginate(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &laquo;
      </button>
    );
    
    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-3 py-1 rounded-md border ${
            currentPage === i 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &raquo;
      </button>
    );
    
    return buttons;
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp._id === employeeId);
    return employee ? `${employee.name} - ${employee.email}` : "Unknown Employee";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Notary Management</h1>
          <p className="text-gray-600">Track and manage notary records</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={addInputRow}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Row
          </button>
          <button
            onClick={saveAllEntries}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Save All
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill (tk)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Input rows */}
              {inputRows.map(row => (
                <tr key={row.id} className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="date"
                      name="date"
                      value={row.date}
                      onChange={(e) => handleInputChange(row.id, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      name="clientName"
                      value={row.clientName}
                      onChange={(e) => handleInputChange(row.id, e)}
                      placeholder="Enter client name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      name="documents"
                      value={row.documents}
                      onChange={(e) => handleInputChange(row.id, e)}
                      placeholder="Enter documents"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      name="employee"
                      value={row.employee}
                      onChange={(e) => handleInputChange(row.id, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={loading}
                    >
                      <option value="">Select Employee</option>
                      {employees.map((employee) => (
                        <option key={employee._id} value={employee._id}>
                          {employee.name} - {employee.email}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      name="note"
                      value={row.note}
                      onChange={(e) => handleInputChange(row.id, e)}
                      placeholder="Enter note"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      name="bill"
                      value={row.bill}
                      onChange={(e) => handleInputChange(row.id, e)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      name="status"
                      value={row.status}
                      onChange={(e) => handleInputChange(row.id, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Complete">Complete</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => openDocumentModal(row.id)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {row.uploadedDocuments.length > 0 && (
                      <span className="ml-1 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                        {row.uploadedDocuments.length}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => removeInputRow(row.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      disabled={inputRows.length <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Upload Modal */}
      <Modal
        isOpen={documentModalOpen}
        onRequestClose={closeDocumentModal}
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <h3 className="text-xl font-bold text-gray-800">Upload Documents</h3>
            <button
              onClick={closeDocumentModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="mb-4 border border-dashed border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-center gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".jpg,.jpeg,image/jpeg,.pdf,application/pdf"
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
                  disabled={!file || isUploading}
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

            {currentRowId && inputRows.find(row => row.id === currentRowId)?.uploadedDocuments.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Uploaded Documents:</h4>
                {inputRows.find(row => row.id === currentRowId).uploadedDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center">
                      <File className="h-4 w-4 mr-2 text-gray-500" />
                      <a
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate max-w-xs"
                      >
                        {doc.split("/").pop()}
                      </a>
                    </div>
                    <button
                      onClick={() => removeDocument(currentRowId, index)}
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
        </div>
      </Modal>

      {/* Saved entries table */}
      {entries.length > 0 && (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill (tk)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachments</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentEntries.map(entry => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{entry.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.clientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.documents}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getEmployeeName(entry.employee)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.note || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.bill ? `৳${parseFloat(entry.bill).toFixed(2)}` : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.status === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.uploadedDocuments && entry.uploadedDocuments.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {entry.uploadedDocuments.map((doc, index) => (
                              <a
                                key={index}
                                href={doc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700"
                                title={doc.split("/").pop()}
                              >
                                <File className="h-4 w-4" />
                              </a>
                            ))}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 mb-8">
              <div className="flex space-x-2">
                {renderPaginationButtons()}
              </div>
            </div>
          )}

          {/* Summary section */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Notary Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800">Total Records</h3>
                <p className="text-2xl font-bold text-blue-600">{entries.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800">Completed</h3>
                <p className="text-2xl font-bold text-green-600">
                  {entries.filter(entry => entry.status === 'Complete').length}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-800">Pending</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {entries.filter(entry => entry.status === 'Pending').length}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-800">Total Revenue</h3>
                <p className="text-2xl font-bold text-purple-600">
                  ৳{entries.reduce((sum, entry) => sum + parseFloat(entry.bill || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Notary;