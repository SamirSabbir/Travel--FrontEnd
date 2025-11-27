import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Plus, X, Save, Download } from "lucide-react";
import axios from "../../api/axios";
import photo from "../../assets/travelLogo.png";
import { toast } from "react-toastify";

const InvoiceModal = ({ isOpen, onClose, work }) => {
  const [submittedOn, setSubmittedOn] = useState("");
  const [invoiceFor, setInvoiceFor] = useState("");
  const [payableTo] = useState("Trip and Travel");
  const [service, setService] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [rows, setRows] = useState([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [existingInvoice, setExistingInvoice] = useState(null);

  // Fetch existing invoice data when work prop changes
  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (work?._id) {
        try {
          const response = await axios.get(`/invoice/work/${work._id}`);
          if (response.data) {
            const invoice = response.data;
            setExistingInvoice(invoice);
            setSubmittedOn(
              invoice.submittedOn ? invoice.submittedOn.split("T")[0] : ""
            );
            setInvoiceFor(invoice.invoiceFor || "");
            setService(invoice.service || "");
            setInvoiceNo(invoice.invoiceNo || "");
            setDueDate(invoice.dueDate ? invoice.dueDate.split("T")[0] : "");
            setNotes(invoice.notes || "");

            if (invoice.items && invoice.items.length > 0) {
              setRows(
                invoice.items.map((item) => ({
                  description: item.description || "",
                  quantity: item.quantity || 1,
                  unitPrice: item.unitPrice || 0,
                }))
              );
            } else {
              setRows([{ description: "", quantity: 1, unitPrice: 0 }]);
            }
          } else {
            // No existing invoice, reset form with work data
            resetForm();
          }
        } catch (error) {
          console.error("Error fetching invoice data:", error);
          resetForm();
        }
      }
    };

    if (isOpen && work?._id) {
      fetchInvoiceData();
    }
  }, [isOpen, work]);

  // Reset form when work prop changes (for new invoice)
  useEffect(() => {
    if (work) {
      setInvoiceFor(work.name || "");
      setInvoiceNo(work.uuId || "");
    }
  }, [work]);

  const resetForm = () => {
    setSubmittedOn("");
    setInvoiceFor(work?.name || "");
    setService("");
    setInvoiceNo(work?.uuId || "");
    setDueDate("");
    setNotes("");
    setRows([{ description: "", quantity: 1, unitPrice: 0 }]);
    setExistingInvoice(null);
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const totalAmount = rows.reduce(
    (acc, row) =>
      acc + (Number(row.quantity) || 0) * (Number(row.unitPrice) || 0),
    0
  );

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const invoiceData = {
        workId: work?._id,
        submittedOn: new Date(submittedOn),
        invoiceFor,
        payableTo,
        service,
        invoiceNo: invoiceNo || "-",
        dueDate: new Date(dueDate),
        notes,
        items: rows.map((row) => ({
          description: row.description,
          quantity: Number(row.quantity) || 0,
          unitPrice: Number(row.unitPrice) || 0,
        })),
        totalAmount: Number(totalAmount.toFixed(2)),
      };

      // Use PUT for update if existing invoice exists, POST for create
      const response = existingInvoice
        ? await axios.put(`/invoice/${existingInvoice._id}`, invoiceData)
        : await axios.post("/invoice", invoiceData);

      toast.success(
        `Invoice ${existingInvoice ? "updated" : "created"} successfully`
      );
      onClose();
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error(`Failed to ${existingInvoice ? "update" : "create"} invoice`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!existingInvoice?._id) {
      toast.error("Please save the invoice first before downloading");
      return;
    }

    try {
      const response = await axios.get(
        `/invoice/download/${existingInvoice._id}`,
        {
          responseType: "blob",
        }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `invoice-${invoiceNo || existingInvoice.invoiceNo}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-40" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh]">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {existingInvoice ? "Edit Invoice" : "Create Invoice"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Company Info and Logo */}
          <div className="flex justify-between items-start mb-6">
            {/* Company Info - Left Side */}
            <div className="text-sm text-gray-700">
              <div className="font-bold text-lg mb-1">TRIP AND TRAVEL</div>
              <div>House No-19-20, Road No-113/A, Gulshan-02, 4th Floor</div>
              <div>Dhaka-1212</div>
              <div className="mt-1">008801671-192117</div>
            </div>

            {/* Logo/Image - Right Side */}
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
              <img
                src={photo}
                alt="Trip and Travel"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Invoice Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium">
                Submitted On *
              </label>
              <input
                type="date"
                value={submittedOn}
                onChange={(e) => setSubmittedOn(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Invoice For *</label>
              <input
                type="text"
                value={invoiceFor}
                onChange={(e) => setInvoiceFor(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                required
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
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="Auto-generated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Service *</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Service</option>
                <option value="visa">Visa Processing</option>
                <option value="hotel">Hotel</option>
                <option value="ticket">Air Ticket</option>
                <option value="transfer">Transfer</option>
                <option value="tourPackage">Tour Package</option>
                <option value="appointmentDate">Appointment Date</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Due Date *</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>
          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
              rows="2"
              placeholder="Optional notes..."
            />
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
                      value={row.quantity}
                      onChange={(e) =>
                        handleRowChange(index, "quantity", e.target.value)
                      }
                      className="w-20 border rounded-lg px-2 py-1"
                      min="1"
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
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    {(row.quantity * row.unitPrice).toFixed(2)}
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
            <div className="text-lg font-bold">
              Total Amount: {totalAmount.toFixed(2)}
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-sm text-gray-500 italic mb-6">
            This is a System generated invoice and requires no signature
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : existingInvoice ? "Update" : "Save"}
            </button>
            <button
              onClick={handleDownload}
              disabled={!existingInvoice}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
