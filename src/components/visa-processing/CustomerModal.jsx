import React, { useState } from "react";
import axios from "../../api/axios";

const CustomerModal = ({ customer, onClose, item }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Merge formData with item to fill in missing values
      const payload = {
        fullName: formData.fullName || item.fullName,
        email: formData.email || item.email,
        phone: formData.phone || item.phone,
      };

      await axios.patch(
        `/visa/update-customer-details/${customer._id}`,
        payload
      );
      alert("Customer information saved!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error saving customer information: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Customer Information</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName || item.fullName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              // defaultValue={item.fullName}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || item.email}
              onChange={handleChange}
              // defaultValue={item.email}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone || item.phone}
              onChange={handleChange}
              // defaultValue={item.phone}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
