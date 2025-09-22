import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Plus, X, Save, Download } from "lucide-react";

const InvoiceModal = ({ isOpen, onClose, work }) => {
  const [submittedOn, setSubmittedOn] = useState("");
  const [invoiceFor, setInvoiceFor] = useState(work?.name || "");
  const [payableTo] = useState("Trip and Travel");
  const [invoiceNumber] = useState(work?.uuId || "");
  const [project, setProject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [rows, setRows] = useState([{ description: "", qty: 1, unitPrice: 0 }]);

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { description: "", qty: 1, unitPrice: 0 }]);
  };

  const total = rows.reduce(
    (acc, row) => acc + (Number(row.qty) || 0) * (Number(row.unitPrice) || 0),
    0
  );

  const handleSave = () => {
    console.log("Invoice saved", {
      submittedOn,
      invoiceFor,
      payableTo,
      invoiceNumber,
      project,
      dueDate,
      rows,
      total,
    });
    onClose();
  };

  const handleDownload = () => {
    // implement pdf/download logic
    console.log("Downloading invoice...");
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-40" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Invoice</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Invoice Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium">Submitted On</label>
              <input
                type="date"
                value={submittedOn}
                onChange={(e) => setSubmittedOn(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Invoice For</label>
              <input
                type="text"
                value={invoiceFor}
                onChange={(e) => setInvoiceFor(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Payable To</label>
              <input
                type="text"
                value={payableTo}
                readOnly
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Invoice #</label>
              <input
                type="text"
                value={invoiceNumber}
                readOnly
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Project</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select</option>
                <option value="visa">Visa Processing</option>
                <option value="hotel">Hotel</option>
                <option value="ticket">Air Ticket</option>
                <option value="transfer">Transfer</option>
                <option value="tourPackage">Tour Package</option>
                <option value="appointmentDate">Appointment Date</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Table */}
          <table className="w-full border mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Unit Price</th>
                <th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) =>
                        handleRowChange(index, "description", e.target.value)
                      }
                      className="w-full border rounded-lg px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={row.qty}
                      onChange={(e) =>
                        handleRowChange(index, "qty", e.target.value)
                      }
                      className="w-20 border rounded-lg px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={row.unitPrice}
                      onChange={(e) =>
                        handleRowChange(index, "unitPrice", e.target.value)
                      }
                      className="w-28 border rounded-lg px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    {row.qty * row.unitPrice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addRow}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Row
          </button>

          {/* Total */}
          <div className="flex justify-end mb-6">
            <div className="text-lg font-bold">Total: {total}</div>
          </div>

          {/* Footer Text */}
          <p className="text-sm text-gray-500 italic mb-6">
            This is a System generated certificate and requires no signature.
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" /> Save
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" /> Download
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default InvoiceModal;
