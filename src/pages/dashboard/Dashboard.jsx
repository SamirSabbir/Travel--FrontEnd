import React, { useState } from "react";
import Leads from "../../components/dashboard/Leads";
import { FaUserCircle } from "react-icons/fa";
import Sales from "../../components/dashboard/Sales";
import Work from "../../components/dashboard/Work";
import Pipeline from "../../components/dashboard/Pipeline";
import VisaProcessing from "../../components/dashboard/VisaProcessing";

// Dummy user object – can be replaced with context/auth state later
const dummyUser = {
  name: "John Doe",
  role: "employee", // or 'employee', 'hr'
  profilePic: "https://i.pravatar.cc/100?u=john", // Replace with actual path
};

// Tab mapping
const tabs = [
  { name: "Leads", component: Leads },
  { name: "Sales", component: Sales },
  { name: "Work", component: Work },
  { name: "Pipeline", component: Pipeline },
  { name: "Visa Processing", component: VisaProcessing },
  // You can import and add other tabs like:
  // { name: "Sales", component: Sales },
  // { name: "HR", component: HR },
  // ...
];

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("Leads");

  const CurrentTabComponent =
    tabs.find((tab) => tab.name === selectedTab)?.component ||
    (() => <div>Not Found</div>);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200 flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="text-lg font-semibold text-blue-600">
            CRM Dashboard
          </span>
        </div>

        {/* Tab List */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setSelectedTab(tab.name)}
              className={`flex items-center gap-3 w-full px-4 py-2 text-left rounded transition ${
                selectedTab === tab.name
                  ? "bg-blue-100 font-semibold"
                  : "hover:bg-blue-50"
              }`}
            >
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-700">
            Welcome, {dummyUser.name}
          </h1>

          {/* Profile Info */}
          <div className="flex items-center gap-3">
            {dummyUser.profilePic ? (
              <img
                src={dummyUser.profilePic}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="h-10 w-10 text-gray-400" />
            )}
            <div className="text-right">
              <p className="text-sm font-semibold">{dummyUser.name}</p>
              <p className="text-xs text-gray-500 capitalize">
                {dummyUser.role}
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <CurrentTabComponent userRole={dummyUser.role} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
