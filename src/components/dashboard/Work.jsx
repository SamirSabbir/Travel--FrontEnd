import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import {
  Globe,
  Loader2,
  Save,
  Search,
  Settings,
  UserCheck,
  Lock,
  Info,
  Users,
  X,
  Calendar,
} from "lucide-react";
import WorkRecordsModal from "../work/WorkRecordModal";
import PaymentDetailsModal from "../work/PaymentDetailsModal";
import InvoiceModal from "../work/InvoiceModal";
import Select from "react-select";
import getServiceColor from "../../utils/serviceColor";

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
    { value: "visa", label: "Visa Processing" },
    { value: "hotel", label: "Hotel" },
    { value: "ticket", label: "Air Ticket" },
    { value: "transfer", label: "Transfer" },
    { value: "tourPackage", label: "Tour Package" },
    { value: "appointmentDate", label: "Appointment Date" },
  ];

  // Work Records Modal State
  const [workRecords, setWorkRecords] = useState([]);
  const [isRecordsModalOpen, setIsRecordsModalOpen] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [assignServiceUsers, setAssignServiceUsers] = useState([]);

  //assign work
  const [assigningWorkId, setAssigningWorkId] = useState(null);

  // Payment Details Modal State
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  //Invoice modal
  const [selectedInvoiceWork, setSelectedInvoiceWork] = useState(null);

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

  // Debounce timer for auto-save
  const [debounceTimers, setDebounceTimers] = useState({});

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

  // Auto-save function for pax, country, submissionDate
  const autoSaveWorkDetails = async (workId, field, value) => {
    // Clear existing timer for this workId
    if (debounceTimers[workId]) {
      clearTimeout(debounceTimers[workId]);
    }

    // Set new timer for debounce (500ms delay)
    const timer = setTimeout(async () => {
      try {
        const updateData = {
          pax:
            field === "pax"
              ? value
              : workData.find((w) => w._id === workId)?.pax,
          country:
            field === "country"
              ? value
              : workData.find((w) => w._id === workId)?.country,
          submissionDate:
            field === "submissionDate"
              ? value
              : workData.find((w) => w._id === workId)?.submissionDate,
        };

        await axios.patch(`/works/update-work-employee/${workId}`, updateData);
        toast.success("Work details updated automatically");
        await fetchWorks(); // Refresh the data
      } catch (err) {
        toast.error("Failed to auto-save work details");
      }
    }, 500);

    // Store the timer in state
    setDebounceTimers((prev) => ({
      ...prev,
      [workId]: timer,
    }));
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

    // Cleanup timers on unmount
    return () => {
      Object.values(debounceTimers).forEach((timer) => clearTimeout(timer));
    };
  }, [userRole]);

  useEffect(() => {
    const filtered = workData.filter((work) =>
      work.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWorkData(filtered);
  }, [searchTerm, workData]);

  const handleFieldChange = async (id, field, value) => {
    setWorkData((prev) =>
      prev.map((w) => (w._id === id ? { ...w, [field]: value } : w))
    );

    // Auto-save for pax, country, submissionDate
    if (["pax", "country", "submissionDate"].includes(field)) {
      autoSaveWorkDetails(id, field, value);
    }

    // Auto-assign work when employeeEmail changes
    if (field === "employeeEmail" && value) {
      await handleWorkAssignment(id, value);
    }
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

  //assign work functionality

  const handleWorkAssignment = async (workId, employeeEmail) => {
    setAssigningWorkId(workId);
    try {
      await axios.patch(`/works/assign-work/${workId}`, {
        employeeEmail: employeeEmail,
      });
      toast.success("Work assigned successfully");
      await fetchWorks(); // Refresh data
    } catch (err) {
      toast.error("Failed to assign work");
    } finally {
      setAssigningWorkId(null);
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

  // Save button now only handles service assignment
  // Save button now only handles service assignment
  const handleServiceAssignment = async (workId, updateData) => {
    setUpdatingId(workId);
    try {
      // Update local state optimistically
      setWorkData((prev) =>
        prev.map((w) =>
          w._id === workId
            ? {
                ...w,
                serviceAssigned: true,
                services: updateData.services,
                assignedServiceUser: updateData.assignedTo,
                employeeEmail: updateData.employeeEmail,
                workStatus: updateData.workStatus,
              }
            : w
        )
      );
      setFilteredWorkData((prev) =>
        prev.map((w) =>
          w._id === workId
            ? {
                ...w,
                serviceAssigned: true,
                services: updateData.services,
                assignedServiceUser: updateData.assignedTo,
                employeeEmail: updateData.employeeEmail,
                workStatus: updateData.workStatus,
              }
            : w
        )
      );

      // Only send service-related data for the save button
      const serviceUpdateData = {
        services: updateData.services,
        assignedTo: updateData.assignedTo,
        employeeEmail: updateData.employeeEmail,
        workStatus: updateData.workStatus,
        serviceAssigned: true,
      };

      await axios.patch(`/works/assign-services/${workId}`, serviceUpdateData);
      toast.success("Service assignment updated successfully");

      // Optional: Refresh data to ensure sync with backend
      await fetchWorks();
    } catch (err) {
      // Revert optimistic update on error
      toast.error("Failed to update service assignment");
      // Refresh original data
      await fetchWorks();
    } finally {
      setUpdatingId(null);
    }
  };

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
        workId={paymentDetails?.workId}
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

      <div className="container mx-auto px-4 py-8">
        <div className="overflow-x-auto -mx-6">
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
                  // "Work Records",
                  "Payment Details",
                  "Invoice",
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
                    <div className="relative group">
                      <Select
                        isMulti
                        options={serviceOptions}
                        value={serviceOptions.filter((option) => {
                          const services = !work.services
                            ? []
                            : Array.isArray(work.services)
                            ? work.services
                            : [work.services];
                          return services.includes(option.value);
                        })}
                        onChange={(selectedOptions) => {
                          const selectedValues = selectedOptions
                            ? selectedOptions.map((option) => option.value)
                            : [];
                          handleFieldChange(
                            work._id,
                            "services",
                            selectedValues
                          );
                        }}
                        className="min-w-[200px] max-w-[240px]"
                        classNamePrefix="service-select"
                        placeholder={
                          <div className="flex items-center gap-2 text-gray-500">
                            <Settings className="w-4 h-4" />
                            <span>Select services...</span>
                          </div>
                        }
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        isSearchable={true}
                        maxMenuHeight={200}
                        menuPortalTarget={document.body}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            border: state.isFocused
                              ? "2px solid #8b5cf6"
                              : "2px solid #e5e7eb",
                            borderRadius: "8px",
                            padding: "6px 8px",
                            backgroundColor: "white",
                            boxShadow: state.isFocused
                              ? "0 0 0 3px rgba(139, 92, 246, 0.1)"
                              : "none",
                            transition: "all 0.2s ease",
                            minHeight: "44px",
                            "&:hover": {
                              borderColor: state.isFocused
                                ? "#8b5cf6"
                                : "#d1d5db",
                            },
                          }),
                          menu: (base) => ({
                            ...base,
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                            zIndex: 9999,
                          }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          multiValue: (base, state) => ({
                            ...base,
                            backgroundColor: getServiceColor(state.data.value)
                              .bg,
                            borderRadius: "6px",
                            border: `1px solid ${
                              getServiceColor(state.data.value).border
                            }`,
                          }),
                          multiValueLabel: (base, state) => ({
                            ...base,
                            color: getServiceColor(state.data.value).text,
                            fontWeight: "600",
                            fontSize: "0.75rem",
                            padding: "4px 8px",
                          }),
                          multiValueRemove: (base, state) => ({
                            ...base,
                            color: getServiceColor(state.data.value).text,
                            borderRadius: "0 6px 6px 0",
                            opacity: 0.7,
                            "&:hover": {
                              backgroundColor: getServiceColor(state.data.value)
                                .border,
                              color: "#ef4444",
                              opacity: 1,
                            },
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected
                              ? "#8b5cf6"
                              : state.isFocused
                              ? "#f8fafc"
                              : "white",
                            color: state.isSelected ? "white" : "#374151",
                            fontWeight: state.isSelected ? "600" : "500",
                            padding: "10px 12px",
                            fontSize: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            "&:active": {
                              backgroundColor: "#7c3aed",
                            },
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: "#9ca3af",
                            fontSize: "0.875rem",
                          }),
                        }}
                        formatOptionLabel={({ value, label }) => (
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                getServiceColor(value).dot
                              }`}
                            />
                            <span>{label}</span>
                          </div>
                        )}
                      />

                      {/* Services count badge */}
                      {work.services &&
                        (Array.isArray(work.services)
                          ? work.services.length > 0
                          : !!work.services) && (
                          <div className="absolute -top-2 -right-2">
                            <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border border-white flex items-center justify-center min-w-[24px]">
                              {Array.isArray(work.services)
                                ? work.services.length
                                : 1}
                            </span>
                          </div>
                        )}
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-2 min-w-[180px]">
                      {work.serviceAssignedTo ? (
                        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                            <UserCheck className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-green-900 truncate">
                              {work.serviceAssignedTo}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              Assigned
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            value={work.serviceAssignedTo || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                work._id,
                                "serviceAssignedTo",
                                e.target.value
                              )
                            }
                            disabled={work.workStatus !== "Completed"}
                            className={`
            w-full px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all duration-200
            ${
              work.workStatus !== "Completed"
                ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white border-gray-300 text-gray-700 hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            }
          `}
                          >
                            <option value="" className="text-gray-500">
                              👤 Assign to user...
                            </option>
                            {assignServiceUsers.map((user) => (
                              <option
                                key={user._id}
                                value={user.email}
                                className="text-gray-700"
                              >
                                {user.name} • {user.email}
                              </option>
                            ))}
                          </select>

                          {work.workStatus !== "Completed" && (
                            <div className="absolute inset-y-0 right-3 flex items-center">
                              <Lock className="w-4 h-4 text-gray-400" />
                            </div>
                          )}

                          {/* Helper text */}
                          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            {work.workStatus !== "Completed"
                              ? "Complete work first to assign"
                              : "Select user to assign services"}
                          </p>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative group">
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={work.pax || ""}
                          onChange={(e) =>
                            handleFieldChange(work._id, "pax", e.target.value)
                          }
                          placeholder="0"
                          className="w-24 px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 font-semibold text-center transition-all duration-200
                   focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-blue-50
                   hover:border-gray-300 hover:bg-gray-50
                   group-hover:shadow-md"
                        />

                        {/* Passenger icon */}
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Users className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>

                        {/* Clear button */}
                        {work.pax && (
                          <button
                            onClick={() =>
                              handleFieldChange(work._id, "pax", "")
                            }
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <X className="w-3 h-3 text-gray-400 hover:text-red-500" />
                          </button>
                        )}
                      </div>

                      {/* Helper label */}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative group">
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
                          handleFieldChange(
                            work._id,
                            "country",
                            selectedValues
                          );
                        }}
                        className="min-w-[200px] max-w-[280px] text-sm"
                        classNamePrefix="country-select"
                        placeholder={
                          <div className="flex items-center gap-2 text-gray-500">
                            <Globe className="w-4 h-4" />
                            <span>Select countries...</span>
                          </div>
                        }
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        isSearchable={true}
                        menuPortalTarget={document.body}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            border: state.isFocused
                              ? "2px solid #3b82f6"
                              : "2px solid #e5e7eb",
                            borderRadius: "8px",
                            padding: "4px 8px",
                            backgroundColor: "white",
                            boxShadow: state.isFocused
                              ? "0 0 0 3px rgba(59, 130, 246, 0.1)"
                              : "none",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              borderColor: state.isFocused
                                ? "#3b82f6"
                                : "#d1d5db",
                            },
                          }),
                          menu: (base) => ({
                            ...base,
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            boxShadow:
                              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                            zIndex: 9999,
                          }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: "#eff6ff",
                            borderRadius: "6px",
                            border: "1px solid #dbeafe",
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            color: "#1e40af",
                            fontWeight: "500",
                            fontSize: "0.75rem",
                          }),
                          multiValueRemove: (base) => ({
                            ...base,
                            color: "#93c5fd",
                            borderRadius: "0 6px 6px 0",
                            "&:hover": {
                              backgroundColor: "#dbeafe",
                              color: "#ef4444",
                            },
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected
                              ? "#3b82f6"
                              : state.isFocused
                              ? "#f3f4f6"
                              : "white",
                            color: state.isSelected ? "white" : "#374151",
                            fontWeight: state.isSelected ? "600" : "400",
                            padding: "8px 12px",
                            fontSize: "0.875rem",
                            "&:active": {
                              backgroundColor: "#2563eb",
                            },
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: "#9ca3af",
                            fontSize: "0.875rem",
                          }),
                        }}
                      />

                      {/* Selected countries count badge */}
                      {work.country && work.country.length > 0 && (
                        <div className="absolute -top-2 -right-2">
                          <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg border border-white">
                            {Array.isArray(work.country)
                              ? work.country.length
                              : 1}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative group">
                      <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
                        <div className="pl-3 pr-2 py-2 border-r border-gray-100">
                          <Calendar className="w-4 h-4 text-gray-400" />
                        </div>
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
                          className="w-32 px-2 py-2 bg-transparent border-none outline-none text-gray-900 font-medium text-sm cursor-pointer"
                        />
                        {work.submissionDate && (
                          <button
                            onClick={() =>
                              handleFieldChange(work._id, "submissionDate", "")
                            }
                            className="pr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          ></button>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative group">
                      <div
                        className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all duration-200 ${
                          work.payment
                            ? "bg-gradient-to-br from-green-100 to-green-50 border-green-300 text-green-800 shadow-lg hover:shadow-xl hover:scale-105"
                            : "bg-gradient-to-br from-gray-100 to-gray-50 border-gray-200 text-gray-600"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg">৳</span>
                          <span className="text-base">
                            {work.payment || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Tooltip on hover */}
                      {work.payment && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                          Payment: {work.payment}
                          {work.paymentStatus && ` • ${work.paymentStatus}`}
                        </div>
                      )}
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
                    <div className="relative">
                      <select
                        value={work.employeeEmail || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            work._id,
                            "employeeEmail",
                            e.target.value
                          )
                        }
                        disabled={
                          work.workStatus !== "Completed" ||
                          assigningWorkId === work._id
                        }
                        className={`px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm ${
                          work.workStatus !== "Completed" ||
                          assigningWorkId === work._id
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
                      {assigningWorkId === work._id && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        </div>
                      )}
                    </div>
                  </td>
                  {/* 
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
                  </td> */}

                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handlePaymentDetailsClick(work)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Details
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {work.workStatus === "Completed" && (
                      <button
                        onClick={() => setSelectedInvoiceWork(work)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Invoice
                      </button>
                    )}
                  </td>

                  {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() =>
                        handleServiceAssignment(work._id, {
                          services: work.services,
                          assignedTo: work.serviceAssignedTo,
                          employeeEmail: work.employeeEmail,
                          workStatus: work.workStatus,
                        })
                      }
                      disabled={
                        updatingId === work._id ||
                        work.serviceAssigned ||
                        (work.services && work.services.length > 0)
                      }
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      {updatingId === work._id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving
                        </>
                      ) : work.serviceAssigned ? (
                        "Service Assigned" // Change text when already assigned
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" /> Save Services
                        </>
                      )}
                    </button>
                  </td> */}

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() =>
                        handleServiceAssignment(work._id, {
                          services: work.services,
                          assignedTo: work.serviceAssignedTo,
                          employeeEmail: work.employeeEmail,
                          workStatus: work.workStatus,
                        })
                      }
                      disabled={
                        updatingId === work._id || work.serviceAssigned // Only disable if already assigned
                      }
                      className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                        updatingId === work._id || work.serviceAssigned
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {updatingId === work._id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving
                        </>
                      ) : work.serviceAssigned ? (
                        "Service Assigned"
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" /> Save Services
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination remains the same */}
        <div className="flex items-center justify-between px-6 py-3  border-gray-200 mt-2">
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
      <InvoiceModal
        isOpen={!!selectedInvoiceWork}
        onClose={() => setSelectedInvoiceWork(null)}
        work={selectedInvoiceWork}
      />
    </div>
  );
};

export default Work;
