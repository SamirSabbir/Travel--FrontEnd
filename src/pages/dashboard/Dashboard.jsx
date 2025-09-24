import React, { useState, useEffect } from "react";
import Leads from "../../components/dashboard/Leads";
import { FaUserCircle } from "react-icons/fa";
import logo from "../../assets/travelLogo.png";
import Sales from "../../components/dashboard/Sales";
import Work from "../../components/dashboard/Work";
import Pipeline from "../../components/dashboard/Pipeline";
import VisaProcessing from "../../components/dashboard/VisaProcessing";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import Approval from "../../components/dashboard/Approval";
import AccountInfo from "../../components/account-admin/AccountInfo";
import Invoice from "../../components/account-admin/Invoice";
import MyBusiness from "../../components/dashboard/superAdmin/MyBusiness";
import MyProfile from "../profile/MyProfile";
import SalaryCommission from "../../components/dashboard/superAdmin/SalaryCommission";
import SalesPipeline from "../../components/dashboard/superAdmin/SalesPipeline";
import PipelineTable from "../../components/PiplelineTable";
import PaymentApprove from "../../components/dashboard/superAdmin/PaymentApprove";
import NotificationPanel from "../../components/NotificationPanel";
import { FaBell } from "react-icons/fa";
import { io } from "socket.io-client";
import Hotel from "../../components/dashboard/Hotel";
import AirTicket from "../../components/dashboard/AirTicket";
import TourPackage from "../../components/dashboard/TourPackage";
import AppointmentDate from "../../components/dashboard/AppointmentDate";
import Transfer from "../../components/dashboard/Transfer";
import HR from "../../components/dashboard/HR/HR";
import NOC from "../../components/dashboard/HR/NOC";
import SalaryCertificate from "../../components/dashboard/HR/SalaryCertificate";
import SpecialRequest from "../../components/dashboard/HR/SpecialRequest";
import DropdownTab from "../../components/dashboard/HR/DropdownTab";
import HRApproval from "../../components/dashboard/HR-Approval/HRApproval";
import Notary from "../../components/dashboard/Office-Boy/Notary";
import Lunch from "../../components/dashboard/Office-Boy/Lunch";
import OfficeSupplies from "../../components/dashboard/Office-Boy/OfficeSupplies";
import Expense from "../../components/dashboard/Expense";

// Tab mapping with role-based visibility
const allTabs = [
  { name: "Leads Management", component: Leads, roles: ["superAdmin"] },
  { name: "Leads", component: Sales, roles: ["employee", "superAdmin"] },
  {
    name: "Pipeline",
    component: PipelineTable,
    roles: ["employee", "superAdmin"],
  },
  {
    name: "Work",
    component: Work,
    roles: ["employee", "AccountAdmin", "superAdmin"],
  },

  { name: "Approval", component: Approval, roles: ["superAdmin"] },
  {
    name: "Visa Processing",
    component: VisaProcessing,
    roles: ["employee", "superAdmin"],
  },
  {
    name: "Hotel",
    component: Hotel,
    roles: ["employee", "superAdmin"],
  },
  {
    name: "Air Ticket",
    component: AirTicket,
    roles: ["employee", "superAdmin"],
  },
  {
    name: "Transfer",
    component: Transfer,
    roles: ["employee", "superAdmin"],
  },

  {
    name: "Tour Package",
    component: TourPackage,
    roles: ["employee", "superAdmin"],
  },

  {
    name: "Appointment Date",
    component: AppointmentDate,
    roles: ["employee", "superAdmin"],
  },
  {
    name: "HR",
    roles: ["employee", "OfficeBoy", "AccountAdmin"],
    component: HR,
    subTabs: [
      {
        name: "Salary Certificate",
        component: SalaryCertificate,
        roles: ["employee", "OfficeBoy", "AccountAdmin"],
      },
      {
        name: "NOC",
        component: NOC,
        roles: ["employee", "OfficeBoy", "AccountAdmin"],
      },
      {
        name: "Special Request",
        component: SpecialRequest,
        roles: ["employee", "OfficeBoy", "AccountAdmin"],
      },
    ],
  },

  {
    name: "Payment Approve",
    component: PaymentApprove,
    roles: ["superAdmin", "AccountAdmin"],
  },
  {
    name: "HR Approval",
    component: HRApproval,
    roles: ["AccountAdmin", "superAdmin"],
  },
  { name: "Account-Info", component: AccountInfo, roles: ["AccountAdmin"] },
  { name: "My-Business", component: MyBusiness, roles: ["superAdmin"] },
  {
    name: "My Profile",
    component: MyProfile,
    roles: ["employee", "AccountAdmin", "superAdmin"],
  },
  {
    name: "Employees Dashboard",
    component: SalaryCommission,
    roles: ["superAdmin"],
  },
  {
    name: "Sales Pipeline",
    component: SalesPipeline,
    roles: ["superAdmin"],
  },
  {
    name: "Expense",
    component: Expense,
    roles: ["AccountAdmin", "superAdmin"],
  },
  {
    name: "Notary",
    component: Notary,
    roles: ["OfficeBoy"],
  },
  {
    name: "Lunch",
    component: Lunch,
    roles: ["OfficeBoy"],
  },
  {
    name: "Office-Supplies",
    component: OfficeSupplies,
    roles: ["OfficeBoy"],
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Leads");
  const [user, setUser] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = Cookies.get("token");
    const userCookie = Cookies.get("user");

    if (!token || !userCookie) {
      navigate("/login");
      return;
    }

    let userData;
    try {
      userData = JSON.parse(userCookie);
    } catch (error) {
      console.error("Failed to parse user cookie:", error);
      navigate("/login");
      return;
    }

    if (!userData || !userData.role) {
      console.error("Invalid user data:", userData);
      navigate("/login");
      return;
    }

    const normalizedUserRole = userData.role.toLowerCase();
    setUser(userData);

    // const availableTabs = allTabs.filter((tab) =>
    //   tab.roles.some((tabRole) => tabRole.toLowerCase() === normalizedUserRole)
    // );
    const availableTabs = allTabs.filter((tab) => {
      const hasAccess = tab.roles.some(
        (tabRole) => tabRole.toLowerCase() === normalizedUserRole
      );

      // setTabs(availableTabs);

      // if (!availableTabs.some((tab) => tab.name === selectedTab)) {
      //   setSelectedTab(availableTabs[0]?.name || "");
      // }

      if (tab.subTabs) {
        const filteredSubTabs = tab.subTabs.filter((subTab) =>
          subTab.roles.some(
            (subTabRole) => subTabRole.toLowerCase() === normalizedUserRole
          )
        );

        // Only show the tab if it has accessible sub-tabs
        return hasAccess && filteredSubTabs.length > 0;
      }

      return hasAccess;
    });

    const filteredTabsWithSubTabs = availableTabs.map((tab) => {
      if (tab.subTabs) {
        return {
          ...tab,
          subTabs: tab.subTabs.filter((subTab) =>
            subTab.roles.some(
              (subTabRole) => subTabRole.toLowerCase() === normalizedUserRole
            )
          ),
        };
      }
      return tab;
    });

    setTabs(filteredTabsWithSubTabs);

    // Initialize Socket.IO connection
    if (userData.email) {
      const newSocket = io("http://localhost:5000");
      setSocket(newSocket);

      // Join user's room for targeted notifications
      newSocket.emit("join-user-room", userData.email);

      // Listen for new notifications
      newSocket.on("new-notification", (notification) => {
        setUnreadCount((prev) => prev + 1);
        toast.info(notification.message, {
          position: "top-right",
          autoClose: 5000,
        });
      });

      return () => {
        newSocket.close();
      };
    }
  }, [navigate]);

  const handleLogout = () => {
    if (socket) {
      socket.close();
    }
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

  // Find the appropriate component based on selected tab
  const findComponent = () => {
    // First check if it's a main tab with a component
    const mainTab = tabs.find((tab) => tab.name === selectedTab);
    if (mainTab && mainTab.component) return mainTab.component;

    // If not found, check if it's a sub-tab from any dropdown
    for (const tab of tabs) {
      if (tab.subTabs) {
        const subTab = tab.subTabs.find((st) => st.name === selectedTab);
        if (subTab) return subTab.component;
      }
    }

    return () => <div>Component Not Found <span className="text-red-600 font-bold">Please</span> Select a Menu</div>;
  };

  const CurrentTabComponent = findComponent();

  // const CurrentTabComponent =
  //   tabs.find((tab) => tab.name === selectedTab)?.component ||
  //   (() => <div>Not Found</div>);

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

        {/* Tab List */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {tabs.map((tab) =>
            tab.subTabs ? (
              <DropdownTab
                key={tab.name}
                tab={tab}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
            ) : (
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
            )
          )}
        </nav>

        {/* Logout Button */}
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

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-gray-100 relative"
              >
                <FaBell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Panel */}
              {showNotifications && (
                <NotificationPanel
                  onClose={() => setShowNotifications(false)}
                  userEmail={user.email}
                  socket={socket}
                  setUnreadCount={setUnreadCount}
                />
              )}
            </div>

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
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <CurrentTabComponent userRole={user.role} userData={user} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
