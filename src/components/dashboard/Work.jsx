import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { Loader2, Save, Search } from "lucide-react";
import WorkRecordsModal from "../work/WorkRecordModal";
import PaymentDetailsModal from "../work/PaymentDetailsModal";

const Work = ({ userRole }) => {
  const [workData, setWorkData] = useState([]);
  const [filteredWorkData, setFilteredWorkData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo (Congo-Brazzaville)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia (Czech Republic)",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini (fmr. Swaziland)",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Holy See",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar (Burma)",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine State",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States of America",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const serviceOptions = [
    "Choose a service",
    "Visa Processing",
    "Hotel",
    "Air Ticket",
    "Transfer",
    "Tour Package",
    "Appointment Date",
  ];

  // Work Records Modal State
  const [workRecords, setWorkRecords] = useState([]);
  const [isRecordsModalOpen, setIsRecordsModalOpen] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(false);

  // Payment Details Modal State
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWorkData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredWorkData.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchWorks = async () => {
    try {
      const endpoint =
        userRole === "AccountAdmin"
          ? "/works/employee-works"
          : "/works/my-works";
      const res = await axios.get(endpoint);
      setWorkData(res.data.data);
      setFilteredWorkData(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch work data");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/users/findEmployeeUsers");
      setEmployees(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch employees");
    }
  };

  const fetchWorkRecords = async (workId) => {
    setRecordsLoading(true);
    try {
      const res = await axios.get(`/work-records/${workId}`);
      setWorkRecords(res.data.data);
      setIsRecordsModalOpen(true);
    } catch (err) {
      toast.error("Failed to fetch work records");
    } finally {
      setRecordsLoading(false);
    }
  };

  const handlePaymentDetailsClick = (work) => {
    setPaymentDetails(
      work.paymentDetails || {
        agencyName: "",
        createdBy: "",
        paymentStatus: "Draft",
        reference: "",
        depositDate: new Date().toISOString().split("T")[0],
        mode: "",
        type: "",
        depositedFrom: "",
        branch: "",
        depositReferenceIdentifier: "",
        uploadedDocument: [],
        depositedToAccount: "",
        givenAmount: 0,
        serviceCharge: 0,
        amount: 0,
        workId: work._id,
      }
    );
    setIsPaymentModalOpen(true);
  };

  const handlePaymentFieldChange = (field, value) => {
    setPaymentDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePaymentUpdate = async () => {
    if (!paymentDetails) return;

    setUpdatingPayment(true);
    try {
      await axios.patch(
        `/payment-details/${paymentDetails._id}`,
        paymentDetails
      );
      toast.success("Payment details updated successfully");
      await fetchWorks();
      setIsPaymentModalOpen(false);
    } catch (err) {
      toast.error("Failed to update payment details");
    } finally {
      setUpdatingPayment(false);
    }
  };

  useEffect(() => {
    Promise.all([fetchWorks(), fetchEmployees()]).finally(() =>
      setLoading(false)
    );
  }, [userRole]);

  useEffect(() => {
    const filtered = workData.filter((work) =>
      work.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWorkData(filtered);
  }, [searchTerm, workData]);

  const handleUpdate = async (id, updatedFields) => {
    setUpdatingId(id);
    try {
      if (userRole === "AccountAdmin") {
        await axios.patch(`/works/update-work-account-admin/${id}`, {
          payment: updatedFields.payment,
          paymentStatus: updatedFields.paymentStatus,
        });
      } else {
        await axios.patch(`/works/update-work-employee/${id}`, updatedFields);
      }
      toast.success("Work updated successfully");
      await fetchWorks();
    } catch (err) {
      toast.error("Failed to update work");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFieldChange = (id, field, value) => {
    setWorkData((prev) =>
      prev.map((w) => (w._id === id ? { ...w, [field]: value } : w))
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "more_info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Full Payment":
        return "bg-green-100 text-green-800";
      case "Partial Payment":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Work Records Modal */}
      <WorkRecordsModal
        isOpen={isRecordsModalOpen}
        onClose={() => setIsRecordsModalOpen(false)}
        workRecords={workRecords}
        isLoading={recordsLoading}
      />

      {/* Payment Details Modal */}
      <PaymentDetailsModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentDetails={paymentDetails}
        onPaymentFieldChange={handlePaymentFieldChange}
        onPaymentUpdate={handlePaymentUpdate}
        updatingPayment={updatingPayment}
        userRole={userRole}
        workId={paymentDetails?.workId} // Add this line
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Assigned Works</h2>
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Name",
                  "Unique ID",
                  "Service",

                  "Pax",
                  "Country",
                  "Submission Date",
                  "Payment",
                  "Payment Status",

                  "Work Status",
                  "Assigned To",
                  "Work Records",
                  "Payment Details",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((work) => (
                <tr
                  key={work._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {work.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {work.uuId || "—"}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={work.service || "Choose a service"}
                      onChange={(e) =>
                        handleFieldChange(work._id, "service", e.target.value)
                      }
                      className=" px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      {serviceOptions.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={work.pax || ""}
                      onChange={(e) =>
                        handleFieldChange(work._id, "pax", e.target.value)
                      }
                      className="w-20 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      multiple
                      value={Array.isArray(work.country) ? work.country : []}
                      onChange={(e) => {
                        const selectedOptions = Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        );
                        handleFieldChange(work._id, "country", selectedOptions);
                      }}
                      className="w-40 h-24 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm overflow-y-auto"
                    >
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="date"
                      value={work.submissionDate?.slice(0, 10) || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          work._id,
                          "submissionDate",
                          e.target.value
                        )
                      }
                      className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        ৳
                      </span>
                      <input
                        type="number"
                        value={work.payment || ""}
                        onChange={(e) =>
                          handleFieldChange(work._id, "payment", e.target.value)
                        }
                        className="pl-7 w-24 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        disabled={
                          userRole !== "AccountAdmin" && userRole !== "Admin"
                        }
                      />
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={work.paymentStatus || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          work._id,
                          "paymentStatus",
                          e.target.value
                        )
                      }
                      className={`px-3 py-1 rounded-md text-xs font-medium ${getPaymentStatusColor(
                        work.paymentStatus
                      )} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      disabled={
                        userRole !== "AccountAdmin" && userRole !== "Admin"
                      }
                    >
                      <option value="">Select Status</option>
                      <option value="Partial Payment">Partial Payment</option>
                      <option value="Full Payment">Full Payment</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={work.status || "draft"}
                      onChange={(e) =>
                        handleFieldChange(work._id, "status", e.target.value)
                      }
                      className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(
                        work.status
                      )} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      {/* <option value="draft">Draft</option>
                      <option value="more_info">Pending More Info</option> */}
                    </select>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={work.employeeEmail || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          work._id,
                          "employeeEmail",
                          e.target.value
                        )
                      }
                      className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp.email}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => fetchWorkRecords(work._id)}
                      disabled={recordsLoading}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                    >
                      {recordsLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Records
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handlePaymentDetailsClick(work)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Details
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() =>
                        handleUpdate(work._id, {
                          uniqueName: work.uniqueName,
                          service: work.service,
                          pax: work.pax,
                          country: work.country,
                          submissionDate: work.submissionDate,
                          payment: work.payment,
                          paymentStatus: work.paymentStatus,
                          employeeEmail: work.employeeEmail,
                          status: work.status,
                        })
                      }
                      disabled={updatingId === work._id}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      {updatingId === work._id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" /> Save
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredWorkData.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredWorkData.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    {/* Previous icon */}
                    &lt;
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === number
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {number}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    {/* Next icon */}
                    &gt;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
