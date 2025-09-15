import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { Loader2, Save, Search } from "lucide-react";
import WorkRecordsModal from "../work/WorkRecordModal";
import PaymentDetailsModal from "../work/PaymentDetailsModal";
import Select from "react-select";

const Work = ({ userRole }) => {
  const [workData, setWorkData] = useState([]);
  const [filteredWorkData, setFilteredWorkData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const countries = [
    { value: "Afghanistan", label: "Afghanistan" },
    { value: "Albania", label: "Albania" },
    { value: "Algeria", label: "Algeria" },
    { value: "Andorra", label: "Andorra" },
    { value: "Angola", label: "Angola" },
    { value: "Antigua and Barbuda", label: "Antigua and Barbuda" },
    { value: "Argentina", label: "Argentina" },
    { value: "Armenia", label: "Armenia" },
    { value: "Australia", label: "Australia" },
    { value: "Austria", label: "Austria" },
    { value: "Azerbaijan", label: "Azerbaijan" },
    { value: "Bahamas", label: "Bahamas" },
    { value: "Bahrain", label: "Bahrain" },
    { value: "Bangladesh", label: "Bangladesh" },
    { value: "Barbados", label: "Barbados" },
    { value: "Belarus", label: "Belarus" },
    { value: "Belgium", label: "Belgium" },
    { value: "Belize", label: "Belize" },
    { value: "Benin", label: "Benin" },
    { value: "Bhutan", label: "Bhutan" },
    { value: "Bolivia", label: "Bolivia" },
    { value: "Bosnia and Herzegovina", label: "Bosnia and Herzegovina" },
    { value: "Botswana", label: "Botswana" },
    { value: "Brazil", label: "Brazil" },
    { value: "Brunei", label: "Brunei" },
    { value: "Bulgaria", label: "Bulgaria" },
    { value: "Burkina Faso", label: "Burkina Faso" },
    { value: "Burundi", label: "Burundi" },
    { value: "Cabo Verde", label: "Cabo Verde" },
    { value: "Cambodia", label: "Cambodia" },
    { value: "Cameroon", label: "Cameroon" },
    { value: "Canada", label: "Canada" },
    { value: "Central African Republic", label: "Central African Republic" },
    { value: "Chad", label: "Chad" },
    { value: "Chile", label: "Chile" },
    { value: "China", label: "China" },
    { value: "Colombia", label: "Colombia" },
    { value: "Comoros", label: "Comoros" },
    { value: "Congo (Congo-Brazzaville)", label: "Congo (Congo-Brazzaville)" },
    { value: "Costa Rica", label: "Costa Rica" },
    { value: "Croatia", label: "Croatia" },
    { value: "Cuba", label: "Cuba" },
    { value: "Cyprus", label: "Cyprus" },
    { value: "Czechia (Czech Republic)", label: "Czechia (Czech Republic)" },
    {
      value: "Democratic Republic of the Congo",
      label: "Democratic Republic of the Congo",
    },
    { value: "Denmark", label: "Denmark" },
    { value: "Djibouti", label: "Djibouti" },
    { value: "Dominica", label: "Dominica" },
    { value: "Dominican Republic", label: "Dominican Republic" },
    { value: "Ecuador", label: "Ecuador" },
    { value: "Egypt", label: "Egypt" },
    { value: "El Salvador", label: "El Salvador" },
    { value: "Equatorial Guinea", label: "Equatorial Guinea" },
    { value: "Eritrea", label: "Eritrea" },
    { value: "Estonia", label: "Estonia" },
    { value: "Eswatini (fmr. Swaziland)", label: "Eswatini (fmr. Swaziland)" },
    { value: "Ethiopia", label: "Ethiopia" },
    { value: "Fiji", label: "Fiji" },
    { value: "Finland", label: "Finland" },
    { value: "France", label: "France" },
    { value: "Gabon", label: "Gabon" },
    { value: "Gambia", label: "Gambia" },
    { value: "Georgia", label: "Georgia" },
    { value: "Germany", label: "Germany" },
    { value: "Ghana", label: "Ghana" },
    { value: "Greece", label: "Greece" },
    { value: "Grenada", label: "Grenada" },
    { value: "Guatemala", label: "Guatemala" },
    { value: "Guinea", label: "Guinea" },
    { value: "Guinea-Bissau", label: "Guinea-Bissau" },
    { value: "Guyana", label: "Guyana" },
    { value: "Haiti", label: "Haiti" },
    { value: "Holy See", label: "Holy See" },
    { value: "Honduras", label: "Honduras" },
    { value: "Hungary", label: "Hungary" },
    { value: "Iceland", label: "Iceland" },
    { value: "India", label: "India" },
    { value: "Indonesia", label: "Indonesia" },
    { value: "Iran", label: "Iran" },
    { value: "Iraq", label: "Iraq" },
    { value: "Ireland", label: "Ireland" },
    { value: "Israel", label: "Israel" },
    { value: "Italy", label: "Italy" },
    { value: "Jamaica", label: "Jamaica" },
    { value: "Japan", label: "Japan" },
    { value: "Jordan", label: "Jordan" },
    { value: "Kazakhstan", label: "Kazakhstan" },
    { value: "Kenya", label: "Kenya" },
    { value: "Kiribati", label: "Kiribati" },
    { value: "Kuwait", label: "Kuwait" },
    { value: "Kyrgyzstan", label: "Kyrgyzstan" },
    { value: "Laos", label: "Laos" },
    { value: "Latvia", label: "Latvia" },
    { value: "Lebanon", label: "Lebanon" },
    { value: "Lesotho", label: "Lesotho" },
    { value: "Liberia", label: "Liberia" },
    { value: "Libya", label: "Libya" },
    { value: "Liechtenstein", label: "Liechtenstein" },
    { value: "Lithuania", label: "Lithuania" },
    { value: "Luxembourg", label: "Luxembourg" },
    { value: "Madagascar", label: "Madagascar" },
    { value: "Malawi", label: "Malawi" },
    { value: "Malaysia", label: "Malaysia" },
    { value: "Maldives", label: "Maldives" },
    { value: "Mali", label: "Mali" },
    { value: "Malta", label: "Malta" },
    { value: "Marshall Islands", label: "Marshall Islands" },
    { value: "Mauritania", label: "Mauritania" },
    { value: "Mauritius", label: "Mauritius" },
    { value: "Mexico", label: "Mexico" },
    { value: "Micronesia", label: "Micronesia" },
    { value: "Moldova", label: "Moldova" },
    { value: "Monaco", label: "Monaco" },
    { value: "Mongolia", label: "Mongolia" },
    { value: "Montenegro", label: "Montenegro" },
    { value: "Morocco", label: "Morocco" },
    { value: "Mozambique", label: "Mozambique" },
    { value: "Myanmar (Burma)", label: "Myanmar (Burma)" },
    { value: "Namibia", label: "Namibia" },
    { value: "Nauru", label: "Nauru" },
    { value: "Nepal", label: "Nepal" },
    { value: "Netherlands", label: "Netherlands" },
    { value: "New Zealand", label: "New Zealand" },
    { value: "Nicaragua", label: "Nicaragua" },
    { value: "Niger", label: "Niger" },
    { value: "Nigeria", label: "Nigeria" },
    { value: "North Korea", label: "North Korea" },
    { value: "North Macedonia", label: "North Macedonia" },
    { value: "Norway", label: "Norway" },
    { value: "Oman", label: "Oman" },
    { value: "Pakistan", label: "Pakistan" },
    { value: "Palau", label: "Palau" },
    { value: "Palestine State", label: "Palestine State" },
    { value: "Panama", label: "Panama" },
    { value: "Papua New Guinea", label: "Papua New Guinea" },
    { value: "Paraguay", label: "Paraguay" },
    { value: "Peru", label: "Peru" },
    { value: "Philippines", label: "Philippines" },
    { value: "Poland", label: "Poland" },
    { value: "Portugal", label: "Portugal" },
    { value: "Qatar", label: "Qatar" },
    { value: "Romania", label: "Romania" },
    { value: "Russia", label: "Russia" },
    { value: "Rwanda", label: "Rwanda" },
    { value: "Saint Kitts and Nevis", label: "Saint Kitts and Nevis" },
    { value: "Saint Lucia", label: "Saint Lucia" },
    {
      value: "Saint Vincent and the Grenadines",
      label: "Saint Vincent and the Grenadines",
    },
    { value: "Samoa", label: "Samoa" },
    { value: "San Marino", label: "San Marino" },
    { value: "Sao Tome and Principe", label: "Sao Tome and Principe" },
    { value: "Saudi Arabia", label: "Saudi Arabia" },
    { value: "Senegal", label: "Senegal" },
    { value: "Serbia", label: "Serbia" },
    { value: "Seychelles", label: "Seychelles" },
    { value: "Sierra Leone", label: "Sierra Leone" },
    { value: "Singapore", label: "Singapore" },
    { value: "Slovakia", label: "Slovakia" },
    { value: "Slovenia", label: "Slovenia" },
    { value: "Solomon Islands", label: "Solomon Islands" },
    { value: "Somalia", label: "Somalia" },
    { value: "South Africa", label: "South Africa" },
    { value: "South Korea", label: "South Korea" },
    { value: "South Sudan", label: "South Sudan" },
    { value: "Spain", label: "Spain" },
    { value: "Sri Lanka", label: "Sri Lanka" },
    { value: "Sudan", label: "Sudan" },
    { value: "Suriname", label: "Suriname" },
    { value: "Sweden", label: "Sweden" },
    { value: "Switzerland", label: "Switzerland" },
    { value: "Syria", label: "Syria" },
    { value: "Taiwan", label: "Taiwan" },
    { value: "Tajikistan", label: "Tajikistan" },
    { value: "Tanzania", label: "Tanzania" },
    { value: "Thailand", label: "Thailand" },
    { value: "Timor-Leste", label: "Timor-Leste" },
    { value: "Togo", label: "Togo" },
    { value: "Tonga", label: "Tonga" },
    { value: "Trinidad and Tobago", label: "Trinidad and Tobago" },
    { value: "Tunisia", label: "Tunisia" },
    { value: "Turkey", label: "Turkey" },
    { value: "Turkmenistan", label: "Turkmenistan" },
    { value: "Tuvalu", label: "Tuvalu" },
    { value: "Uganda", label: "Uganda" },
    { value: "Ukraine", label: "Ukraine" },
    { value: "United Arab Emirates", label: "United Arab Emirates" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "United States of America", label: "United States of America" },
    { value: "Uruguay", label: "Uruguay" },
    { value: "Uzbekistan", label: "Uzbekistan" },
    { value: "Vanuatu", label: "Vanuatu" },
    { value: "Venezuela", label: "Venezuela" },
    { value: "Vietnam", label: "Vietnam" },
    { value: "Yemen", label: "Yemen" },
    { value: "Zambia", label: "Zambia" },
    { value: "Zimbabwe", label: "Zimbabwe" },
  ];

  const serviceOptions = [
    { value: "Visa Processing", label: "Visa Processing" },
    { value: "Hotel", label: "Hotel" },
    { value: "Air Ticket", label: "Air Ticket" },
    { value: "Transfer", label: "Transfer" },
    { value: "Tour Package", label: "Tour Package" },
    { value: "Appointment Date", label: "Appointment Date" },
  ];

  // Work Records Modal State
  const [workRecords, setWorkRecords] = useState([]);
  const [isRecordsModalOpen, setIsRecordsModalOpen] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [assignServiceUsers, setAssignServiceUsers] = useState([]);

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

  const fetchAssignServiceUsers = async () => {
    try {
      const res = await axios.get("/users/findAllUsers");
      setAssignServiceUsers(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch assign service users");
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
    Promise.all([
      fetchWorks(),
      fetchEmployees(),
      fetchAssignServiceUsers(),
    ]).finally(() => setLoading(false));
  }, [userRole]);

  useEffect(() => {
    const filtered = workData.filter((work) =>
      work.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWorkData(filtered);
  }, [searchTerm, workData]);

  // const handleUpdate = async (id, updatedFields) => {
  //   setUpdatingId(id);
  //   try {
  //     if (userRole === "AccountAdmin") {
  //       await axios.patch(`/works/update-work-account-admin/${id}`, {
  //         payment: updatedFields.payment,
  //         paymentStatus: updatedFields.paymentStatus,
  //       });
  //     } else {
  //       await axios.patch(`/works/update-work-employee/${id}`, updatedFields);
  //     }
  //     toast.success("Work updated successfully");
  //     await fetchWorks();
  //   } catch (err) {
  //     toast.error("Failed to update work");
  //   } finally {
  //     setUpdatingId(null);
  //   }
  // };

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
                  "Assign Service",

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
                    <Select
                      isMulti
                      options={serviceOptions}
                      value={serviceOptions.filter((option) =>
                        Array.isArray(work.service)
                          ? work.service.includes(option.value)
                          : work.service === option.value
                      )}
                      onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : [];
                        handleFieldChange(work._id, "service", selectedValues);
                      }}
                      className=" w-48 text-sm"
                      classNamePrefix="select"
                      placeholder="Select services..."
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                    />
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <select
                      value={work.assignedServiceUser || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          work._id,
                          "assignedServiceUser",
                          e.target.value
                        )
                      }
                      disabled={work.workStatus !== "Completed"}
                      className={`px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm ${
                        work.workStatus !== "Completed"
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <option value="">Select User</option>
                      {assignServiceUsers.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email})
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
                    <Select
                      isMulti
                      options={countries}
                      value={countries.filter((option) =>
                        Array.isArray(work.country)
                          ? work.country.includes(option.value)
                          : work.country === option.value
                      )}
                      onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : [];
                        handleFieldChange(work._id, "country", selectedValues);
                      }}
                      className="w-48 text-sm"
                      classNamePrefix="select"
                      placeholder="Select countries..."
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      isSearchable={true}
                    />
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
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(
                          work.payment
                        )}`}
                      >
                        {work.payment || "N/A"}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(
                        work.paymentStatus
                      )}`}
                    >
                      {work.paymentStatus || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(
                        work.workStatus
                      )}`}
                    >
                      {work.workStatus || "N/A"}
                    </span>
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
                      disabled={work.workStatus !== "Completed"}
                      className={`px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm ${
                        work.workStatus !== "Completed"
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }`}
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
                      // onClick={() =>
                      //   handleUpdate(work._id, {
                      //     uniqueName: work.uniqueName,
                      //     service: work.service,
                      //     pax: work.pax,
                      //     country: work.country,
                      //     submissionDate: work.submissionDate,
                      //     payment: work.payment,
                      //     paymentStatus: work.paymentStatus,
                      //     employeeEmail: work.employeeEmail,
                      //     status: work.status,
                      //   })
                      // }
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
