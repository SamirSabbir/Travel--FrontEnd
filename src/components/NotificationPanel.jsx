import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import {
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  Bell,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "react-feather";
import { useNavigate } from "react-router-dom";

const NotificationPanel = ({ onClose, userEmail, socket, setUnreadCount }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [dropdownNotifications, setDropdownNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullModal, setShowFullModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalNotifications: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const notificationsPerPage = 6;

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    fetchDropdownNotifications();
    fetchAllNotifications(1); // Load first page initially

    // Listen for real-time notifications if socket is provided
    if (socket) {
      const handleNewNotification = (notification) => {
        console.log("📨 Received real-time notification:", notification);
        // Add to both dropdown and main list
        setDropdownNotifications((prev) => [
          notification,
          ...prev.slice(0, notificationsPerPage - 1),
        ]);
        setNotifications((prev) => [notification, ...prev]);
        if (setUnreadCount) {
          setUnreadCount((prev) => prev + 1);
        }
      };

      socket.on("new-notification", handleNewNotification);

      return () => {
        socket.off("new-notification", handleNewNotification);
      };
    }
  }, [userEmail, socket]);

  const fetchDropdownNotifications = async () => {
    try {
      const response = await axios.get(
        `/notifications/${userEmail}/recent?limit=${notificationsPerPage}`
      );

      if (response.data.success) {
        setDropdownNotifications(response.data.data || []);

        // Update unread count from dropdown notifications
        const unread = response.data.data?.filter((n) => n.newIs).length || 0;
        if (setUnreadCount) {
          setUnreadCount(unread);
        }
      }
    } catch (error) {
      console.error("❌ Error fetching dropdown notifications:", error);
    }
  };

  const fetchAllNotifications = async (page = 1) => {
    try {
      setError(null);
      console.log("🔄 Fetching notifications for page:", page);

      const response = await axios.get(
        `/notifications/${userEmail}?page=${page}&limit=${notificationsPerPage}`
      );

      if (response.data.success) {
        console.log(
          "✅ Notifications fetched:",
          response.data.data?.items?.length || 0
        );
        setNotifications(response.data.data.items || []);
        setPagination(
          response.data.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalNotifications: 0,
            hasNextPage: false,
            hasPrevPage: false,
          }
        );
      } else {
        setError("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
      setError("Failed to load notifications. Please try again.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      console.log("📝 Marking notification as read:", id);
      const response = await axios.patch(
        `/notifications/${id}/${userEmail}/read`
      );

      if (response.data.success) {
        // Update in dropdown notifications
        setDropdownNotifications(
          dropdownNotifications.map((notif) =>
            notif._id === id ? { ...notif, newIs: false } : notif
          )
        );

        // Update in main notifications
        setNotifications(
          notifications.map((notif) =>
            notif._id === id ? { ...notif, newIs: false } : notif
          )
        );

        // Update unread count
        if (setUnreadCount) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      console.log("📝 Marking all notifications as read");
      const response = await axios.patch("/notifications/mark-all-read", {
        userEmail,
      });

      if (response.data.success) {
        // Update both dropdown and main notifications
        setDropdownNotifications(
          dropdownNotifications.map((notif) => ({ ...notif, newIs: false }))
        );
        setNotifications(
          notifications.map((notif) => ({ ...notif, newIs: false }))
        );

        // Reset unread count
        if (setUnreadCount) {
          setUnreadCount(0);
        }
      }
    } catch (error) {
      console.error("❌ Error marking all notifications as read:", error);
    }
  };

  // Function to handle notification click and navigation
  const handleNotificationClick = async (notification) => {
    // Mark as read first
    if (notification.newIs) {
      await markAsRead(notification._id);
    }

    // Close notification panel
    onClose();
    setShowFullModal(false);

    // Navigate based on notification type and content
    navigateBasedOnNotification(notification);
  };

  // Function to determine where to navigate based on notification
  const navigateBasedOnNotification = (notification) => {
    const { type, message, context } = notification;

    // Check for lead assignment notifications
    if (
      type === "lead_assignment" ||
      type === "lead_assignment_made" ||
      message.toLowerCase().includes("assigned to a lead") ||
      message.toLowerCase().includes("lead assigned") ||
      message.toLowerCase().includes("new lead")
    ) {
      // Navigate to Leads section
      console.log("📍 Navigating to Leads section");
      // This will trigger the tab change in Dashboard
      window.dispatchEvent(
        new CustomEvent("dashboard-navigate", {
          detail: { tab: "Leads" },
        })
      );
      return;
    }

    // Check for work assignment notifications
    if (
      type === "work_assignment" ||
      type === "work_approved" ||
      message.toLowerCase().includes("work assigned") ||
      message.toLowerCase().includes("work approved") ||
      message.toLowerCase().includes("new work")
    ) {
      // Navigate to Work section
      console.log("📍 Navigating to Work section");
      window.dispatchEvent(
        new CustomEvent("dashboard-navigate", {
          detail: { tab: "Work" },
        })
      );
      return;
    }

    // Check for pipeline notifications
    if (
      type === "pipeline_update" ||
      message.toLowerCase().includes("pipeline") ||
      message.toLowerCase().includes("sales pipeline")
    ) {
      // Navigate to Pipeline section
      console.log("📍 Navigating to Pipeline section");
      window.dispatchEvent(
        new CustomEvent("dashboard-navigate", {
          detail: { tab: "Pipeline" },
        })
      );
      return;
    }

    // Check for approval notifications
    if (
      type === "approval_request" ||
      message.toLowerCase().includes("approval") ||
      message.toLowerCase().includes("needs approval")
    ) {
      // Navigate to Approval section based on user role
      console.log("📍 Navigating to Approval section");
      window.dispatchEvent(
        new CustomEvent("dashboard-navigate", {
          detail: { tab: "User Approval" },
        })
      );
      return;
    }

    // Check for visa processing notifications
    if (
      type === "visa_update" ||
      message.toLowerCase().includes("visa") ||
      message.toLowerCase().includes("processing")
    ) {
      // Navigate to Visa Processing section
      console.log("📍 Navigating to Visa Processing section");
      window.dispatchEvent(
        new CustomEvent("dashboard-navigate", {
          detail: { tab: "Visa Processing" },
        })
      );
      return;
    }

    // Default: Stay on current page or go to dashboard home
    console.log("📍 No specific navigation for this notification type");
  };

  // Check if notification is actionable (has navigation)
  const isActionableNotification = (notification) => {
    const { type, message } = notification;
    return (
      type === "lead_assignment" ||
      type === "lead_assignment_made" ||
      type === "work_assignment" ||
      type === "work_approved" ||
      type === "approval_request" ||
      type === "pipeline_update" ||
      type === "visa_update" ||
      message.toLowerCase().includes("assigned") ||
      message.toLowerCase().includes("lead") ||
      message.toLowerCase().includes("work") ||
      message.toLowerCase().includes("approval") ||
      message.toLowerCase().includes("pipeline") ||
      message.toLowerCase().includes("visa")
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch (error) {
      return "Recently";
    }
  };

  const getTitleFromType = (type, message) => {
    switch (type) {
      case "lead_assignment":
        return "Lead Assigned";
      case "work_assignment":
        return "Work Assigned";
      case "work_approved":
        return "Work Approved";
      case "approval_request":
        return "Approval Request";
      case "lead_created":
        return "New Lead Created";
      case "lead_assignment_made":
        return "Assignment Confirmed";
      case "lead_removal":
        return "Lead Removed";
      default:
        return message.split(":")[0] || "Notification";
    }
  };

  const unreadNotifications = dropdownNotifications.filter(
    (n) => n.newIs
  ).length;

  const handleViewAll = () => {
    setShowFullModal(true);
    setCurrentPage(1);
    fetchAllNotifications(1);
  };

  const handleCloseFullModal = () => {
    setShowFullModal(false);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    fetchAllNotifications(page);
  };

  const goToNextPage = () => {
    if (currentPage < pagination.totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchAllNotifications(nextPage);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchAllNotifications(prevPage);
    }
  };

  // Notification Item Component (reusable)
  const NotificationItem = ({ notification, showFullDetails = false }) => {
    const isActionable = isActionableNotification(notification);

    return (
      <div
        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer group ${
          notification.newIs ? "bg-blue-50" : ""
        } ${showFullDetails ? "border rounded-lg mb-3" : ""}`}
        onClick={() => handleNotificationClick(notification)}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">{getIcon(notification.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-gray-900">
                {getTitleFromType(notification.type, notification.message)}
              </p>
              {isActionable && (
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 ml-2 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            <div className="flex items-center mt-2 text-xs text-gray-400">
              <Calendar className="h-3 w-3 mr-1" />
              {formatTime(notification.createdAt)}
              {showFullDetails && (
                <span className="ml-2 px-2 py-1 bg-gray-200 rounded-full">
                  {notification.type || "general"}
                </span>
              )}
            </div>
            {showFullDetails && notification.newIs && (
              <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                New
              </span>
            )}
            {isActionable && (
              <div className="mt-2 text-xs text-blue-600 font-medium">
                Click to view details →
              </div>
            )}
          </div>
          {!showFullDetails && notification.newIs && (
            <div className="flex-shrink-0">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Dropdown Notification Panel */}
      <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-gray-700">Notifications</h3>
          <div className="flex space-x-2">
            {unreadNotifications > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Notifications List (First 6 from backend) */}
        <div className="max-h-96 overflow-y-auto">
          {dropdownNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium">No notifications yet</p>
              <p className="text-sm mt-1">
                You'll see notifications here when you get them
              </p>
            </div>
          ) : (
            dropdownNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {pagination.totalNotifications > 0 && (
          <div className="p-3 border-t border-gray-200 text-center">
            <button
              className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
              onClick={handleViewAll}
            >
              View all notifications ({pagination.totalNotifications})
            </button>
          </div>
        )}
      </div>

      {/* Full Notifications Modal */}
      {showFullModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  All Notifications
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {pagination.totalNotifications} total notifications •{" "}
                  {unreadNotifications} unread
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {unreadNotifications > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={handleCloseFullModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Notifications List with Pagination */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    showFullDetails={true}
                  />
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={goToPrevPage}
                  disabled={!pagination.hasPrevPage}
                  className={`flex items-center space-x-1 px-3 py-2 rounded ${
                    !pagination.hasPrevPage
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-2">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-8 h-8 rounded-full text-sm ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={!pagination.hasNextPage}
                  className={`flex items-center space-x-1 px-3 py-2 rounded ${
                    !pagination.hasNextPage
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Page Info */}
            <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
              Page {currentPage} of {pagination.totalPages} • Showing{" "}
              {notifications.length} of {pagination.totalNotifications}{" "}
              notifications
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationPanel;
