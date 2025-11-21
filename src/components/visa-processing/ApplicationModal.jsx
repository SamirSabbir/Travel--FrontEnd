import React, { useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";

const ApplicationModal = ({ onClose, application, item }) => {
  const [selectedCountry, setSelectedCountry] = useState("usa");
  const [formData, setFormData] = useState({
    // Common fields
    fullname: "",
    email: "",
    // USA specific fields
    applicationId: "",
    surnameFirstFive: "",
    yearOfBirth: "",
    motherGivenName: "",
    username: "",
    password: "",
    securityQuestion1: "",
    securityQuestion2: "",
    securityQuestion3: "",
    // Schengen specific fields
    phone: "",
    schengenUsername: "",
    schengenPassword: "",
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
      if (selectedCountry === "usa") {
        // Construct payload for USA visa
        const payload = {
          visaType: "USA",
          fullName: formData.fullName || item?.fullName,
          email: formData.email || item?.email,
          usaDetails: {
            applicationId:
              formData.applicationId || item?.usaDetails?.applicationId,
            fiveLettersOfSurname:
              formData.surnameFirstFive ||
              item?.usaDetails?.fiveLettersOfSurname,
            yearOfBirth: formData.yearOfBirth || item?.usaDetails?.yearOfBirth,
            motherGivenName:
              formData.motherGivenName || item?.usaDetails?.motherGivenName,
            userName: formData.username || item?.usaDetails?.userName,
            password: formData.password || item?.usaDetails?.password,
            sq1: formData.securityQuestion1 || item?.usaDetails?.sq1,
            sq2: formData.securityQuestion2 || item?.usaDetails?.sq2,
            sq3: formData.securityQuestion3 || item?.usaDetails?.sq3,
          },
        };

        console.log(payload);

        await axios.patch(
          `/visa/update-customer-details-usa/${application._id}`,
          payload
        );
      } else if (selectedCountry === "schengen") {
        // Construct payload for Schengen visa
        const payload = {
          visaType: "Schengen",
          fullName: formData.name || item.name,
          email: formData.email || item.email,
          phone: formData.phone || item.phone,
          schengenDetails: {
            userName: formData.schengenUsername || item.schengenUsername,
            password: formData.schengenPassword || item.schengenPassword,
          },
        };

        await axios.patch(
          `/visa/update-customer-details-schengen/${application._id}`,
          payload
        );
      }

      toast.success("Application information saved!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Error saving application information: " + err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Visa Application Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Country Selection */}
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium mb-2">Select Visa Type</h3>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setSelectedCountry("usa")}
              className={`px-4 py-2 rounded ${
                selectedCountry === "usa"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              USA Visa
            </button>

            <button
              type="button"
              onClick={() => setSelectedCountry("schengen")}
              className={`px-4 py-2 rounded ${
                selectedCountry === "schengen"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Schengen Country Visa
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <h3 className="text-lg font-medium mb-4">
            {selectedCountry === "usa"
              ? "USA Visa Application"
              : "Schengen Country Visa Application"}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 bg-white shadow-sm rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    colSpan={2}
                    className="border border-gray-300 px-4 py-3 text-left font-semibold"
                  >
                    Personal Information
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-medium w-1/3">
                    <label htmlFor="name">Full Name</label>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName || item?.fullName || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-medium">
                    <label htmlFor="email">Email Address</label>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email || item.email}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </td>
                </tr>

                {selectedCountry === "usa" ? (
                  <>
                    {/* USA Specific Fields */}
                    <tr className="bg-blue-50">
                      <th
                        colSpan={2}
                        className="border border-gray-300 px-4 py-3 text-left font-semibold"
                      >
                        Retrieve a DS-160 Application
                      </th>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">
                        <label htmlFor="applicationId">Application ID</label>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          id="applicationId"
                          name="applicationId"
                          value={
                            formData.applicationId ||
                            item?.usaDetails?.applicationId ||
                            ""
                          }
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">
                        <label htmlFor="surnameFirstFive">
                          First 5 Letters of Surname
                        </label>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          id="surnameFirstFive"
                          name="surnameFirstFive"
                          maxLength="5"
                          value={
                            formData.surnameFirstFive ||
                            item?.usaDetails?.fiveLettersOfSurname ||
                            ""
                          }
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">
                        <label htmlFor="yearOfBirth">Year of Birth</label>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="number"
                          id="yearOfBirth"
                          name="yearOfBirth"
                          min="1900"
                          max="2100"
                          value={
                            formData.yearOfBirth ||
                            item?.usaDetails?.yearOfBirth ||
                            ""
                          }
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">
                        <label htmlFor="motherGivenName">
                          Mother's Given Name
                        </label>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          id="motherGivenName"
                          name="motherGivenName"
                          value={
                            formData.motherGivenName ||
                            item?.usaDetails?.motherGivenName ||
                            ""
                          }
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </td>
                    </tr>

                    <tr className="bg-blue-50">
                      <th
                        colSpan={2}
                        className="border border-gray-300 px-4 py-3 text-left font-semibold"
                      >
                        Application for a US visa - Payment & Date
                      </th>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">
                        <label htmlFor="username">User Name</label>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={
                            formData.username ||
                            item?.usaDetails?.userName ||
                            ""
                          }
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">
                        <label htmlFor="password">Password</label>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          id="password"
                          name="password"
                          value={
                            formData.password ||
                            item?.usaDetails?.password ||
                            ""
                          }
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">
                        <label htmlFor="securityQuestion1">
                          Security Question 1
                        </label>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          id="securityQuestion1"
                          name="securityQuestion1"
                          value={
                            formData.securityQuestion1 ||
                            item?.usaDetails?.sq1 ||
                            ""
                          }
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">
                        <label htmlFor="securityQuestion2">
                          Security Question 2
                        </label>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          id="securityQuestion2"
                          name="securityQuestion2"
                          value={
                            formData.securityQuestion2 ||
                            item?.usaDetails?.sq2 ||
                            ""
                          }
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">
                        <label htmlFor="securityQuestion3">
                          Security Question 3
                        </label>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          id="securityQuestion3"
                          name="securityQuestion3"
                          value={
                            formData.securityQuestion3 ||
                            item?.usaDetails?.sq3 ||
                            ""
                          }
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    {/* Schengen Specific Fields */}
                    <tr className="bg-blue-50">
                      <th
                        colSpan={2}
                        className="border border-gray-300 px-4 py-3 text-left font-semibold"
                      >
                        Schengen Visa Application Details
                      </th>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">
                        <label htmlFor="phone">Phone Number</label>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone || item.phone}
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">
                        <label htmlFor="schengenUsername">User Name</label>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          id="schengenUsername"
                          name="schengenUsername"
                          value={
                            formData.schengenUsername ||
                            item?.schengenDetails?.userName ||
                            ""
                          }
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">
                        <label htmlFor="schengenPassword">Password</label>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          id="schengenPassword"
                          name="schengenPassword"
                          value={
                            formData.schengenPassword ||
                            item?.schengenDetails?.password ||
                            ""
                          }
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
