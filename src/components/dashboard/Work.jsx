import React, { useState } from "react";


//from the sales other information will  also  show here after that the employee will do other thing.
//also need description here  

const Work = ({ userRole }) => {
  // Dummy customer data from Sales tab
  const customers = [
    { id: 1, name: "Alice", phone: "01711-123456" },
    { id: 2, name: "Bob", phone: "01822-654321" },
  ];

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [status, setStatus] = useState("Draft");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [file, setFile] = useState(null);
  const [workList, setWorkList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newWork = {
      id: workList.length + 1,
      customer: selectedCustomer,
      fileName: file?.name || "No file uploaded",
      status,
      deliveryDate: status === "Pending More Info" ? deliveryDate : null,
    };

    setWorkList((prev) => [...prev, newWork]);

    // Reset
    setSelectedCustomer(null);
    setStatus("Draft");
    setDeliveryDate("");
    setFile(null);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Work</h2>

      {/* Customer Selection */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Select a Customer</h3>
        <ul className="bg-white border rounded divide-y max-w-md">
          {customers.map((cust) => (
            <li
              key={cust.id}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                selectedCustomer?.id === cust.id ? "bg-blue-100 font-semibold" : ""
              }`}
              onClick={() => setSelectedCustomer(cust)}
            >
              {cust.name} - {cust.phone}
            </li>
          ))}
        </ul>
      </div>

      {/* Work Form */}
      {selectedCustomer && (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mb-10">
          {/* File Upload */}
          <div>
            <label className="block font-semibold mb-1">Upload Document</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
              required
            />
            {file && (
              <p className="text-sm mt-1 text-gray-500">Selected: {file.name}</p>
            )}
          </div>

          {/* Status Select */}
          <div>
            <label className="block font-semibold mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Completed">Completed</option>
              <option value="Draft">Draft</option>
              <option value="Pending More Info">Pending More Info</option>
            </select>
          </div>

          {/* Conditional Delivery Date */}
          {status === "Pending More Info" && (
            <div>
              <label className="block font-semibold mb-1">Delivery Date</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Work Info
          </button>
        </form>
      )}

      {/* Display Submitted Work List */}
      {workList.length > 0 && (
        <div className="mt-6 max-w-3xl">
          <h3 className="text-lg font-semibold mb-4">Submitted Work</h3>
          <div className="space-y-4">
            {workList.map((work) => (
              <div
                key={work.id}
                className="bg-white p-4 rounded shadow border"
              >
                <p className="font-semibold text-blue-600">
                  {work.customer.name} ({work.customer.phone})
                </p>
                <p><strong>File:</strong> {work.fileName}</p>
                <p><strong>Status:</strong> {work.status}</p>
                {work.deliveryDate && (
                  <p><strong>Delivery Date:</strong> {work.deliveryDate}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Work;
