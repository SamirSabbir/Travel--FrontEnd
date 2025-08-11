import React, { useState, useEffect } from "react";
import Leads from "../../components/dashboard/Leads";
import { FaUserCircle } from "react-icons/fa";
import logo from "../../assets/travelLogo.png";
import Sales from "../../components/dashboard/Sales";
import Work from "../../components/dashboard/Work";
import Pipeline from "../../components/dashboard/Pipeline";
import VisaProcessing from "../../components/dashboard/VisaProcessing";
// import Invoice from "../../components/dashboard/Invoice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import Approval from "../../components/dashboard/Approval";
import AdminPipeline from "../../components/dashboard/AdminPipeline";
import AccountInfo from "../../components/account-admin/AccountInfo";
import Invoice from "../../components/account-admin/Invoice";
import MyBusiness from "../../components/dashboard/superAdmin/MyBusiness";
import MyProfile from "../profile/MyProfile";
import SalaryCommission from "../../components/dashboard/superAdmin/SalaryCommission";
import SalesPipeline from "../../components/dashboard/superAdmin/SalesPipeline";

// Tab mapping with role-based visibility
const allTabs = [
  { name: "Leads", component: Leads, roles: ["superAdmin"] },
  // { name: "Sales", component: Sales, roles: ["employee", "hr", "admin"] },
  { name: "Sales", component: Sales, roles: ["employee", "superAdmin"] },
  {
    name: "Work",
    component: Work,
    roles: ["employee", "AccountAdmin", "superAdmin"],
  },
  // { name: "Pipeline", component: Pipeline, roles: ["hr", "admin"] },
  {
    name: "Visa Processing",
    component: VisaProcessing,
    roles: ["hr", "admin"],
  },
  // { name: "Invoice", component: Invoice, roles: ["admin"] },
  { name: "Approval", component: Approval, roles: ["superAdmin"] },
  { name: "Pipeline", component: AdminPipeline, roles: ["superAdmin"] },
  { name: "Account-Info", component: AccountInfo, roles: ["AccountAdmin"] },
  { name: "Invoice", component: Invoice, roles: ["AccountAdmin"] },
  { name: "My-Business", component: MyBusiness, roles: ["superAdmin"] },
  {
    name: "My Profile",
    component: MyProfile,
    roles: ["employee", "AccountAdmin", "superAdmin"],
  },
  {
    name: "Employees Performance",
    component: SalaryCommission,
    roles: ["superAdmin"],
  },
  {
    name: "Sales Pipeline",
    component: SalesPipeline,
    roles: ["superAdmin"],
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Leads");
  const [user, setUser] = useState(null);
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    const token = Cookies.get("token");
    const userData = JSON.parse(Cookies.get("user"));

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    // Normalize role for comparison (handle both "Admin" and "admin")
    const normalizedUserRole = userData.role.toLowerCase();
    setUser(userData);

    const availableTabs = allTabs.filter((tab) =>
      tab.roles.some((tabRole) => tabRole.toLowerCase() === normalizedUserRole)
    );

    setTabs(availableTabs);

    // Reset to first available tab if current selection not available
    if (!availableTabs.some((tab) => tab.name === selectedTab)) {
      setSelectedTab(availableTabs[0]?.name || "");
    }
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  const CurrentTabComponent =
    tabs.find((tab) => tab.name === selectedTab)?.component ||
    (() => <div>Not Found</div>);

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-12 w-12" />
          <span className="text-lg font-semibold text-[#0F4F55]">
            Trip and Travel
          </span>
        </div>

        {/* Tab List - Make this scrollable */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setSelectedTab(tab.name)}
              className={`w-full text-left p-2 rounded transition ${
                selectedTab === tab.name
                  ? "bg-[#0F4F55] text-white"
                  : "hover:bg-blue-100"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>

        {/* Logout Button - Ensure it stays at bottom */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#ECF4FB]">
        {/* Top Header */}

        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-700">
            Welcome, {user.name}
          </h1>

          {/* Profile Info */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
            onClick={() => setSelectedTab("My Profile")}
          >
            {user.photo ? (
              <img
                src={user.photo}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover"
                loading="lazy"
              />
            ) : (
              <FaUserCircle className="h-10 w-10 text-gray-400" />
            )}
            <div className="text-right">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <CurrentTabComponent userRole={user.role} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
