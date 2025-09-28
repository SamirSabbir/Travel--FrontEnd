import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import {
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  Bell,
} from "react-feather";

const NotificationPanel = ({ onClose, userEmail, socket, setUnreadCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    fetchNotifications();

    // Listen for real-time notifications if socket is provided
    if (socket) {
      const handleNewNotification = (notification) => {
        console.log("📨 Received real-time notification:", notification);
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

  const fetchNotifications = async () => {
    try {
      setError(null);
      console.log("🔄 Fetching notifications for:", userEmail);

      const response = await axios.get(`/notifications/${userEmail}`);

      if (response.data.success) {
        console.log(
          "✅ Notifications fetched:",
          response.data.data?.length || 0
        );
        setNotifications(response.data.data || []);

        // Update unread count
        const unread = response.data.data?.filter((n) => n.isNew).length || 0;
        if (setUnreadCount) {
          setUnreadCount(unread);
        }
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
        setNotifications(
          notifications.map((notif) =>
            notif._id === id ? { ...notif, isNew: false } : notif
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
        setNotifications(
          notifications.map((notif) => ({ ...notif, isNew: false }))
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

  const unreadNotifications = notifications.filter((n) => n.isNew).length;

  if (loading) {
    return (
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-gray-700">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading notifications...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-gray-700">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 text-center text-red-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-2" />
          <p>{error}</p>
          <button
            onClick={fetchNotifications}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
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

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium">No notifications yet</p>
            <p className="text-sm mt-1">
              You'll see notifications here when you get them
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                notification.isNew ? "bg-blue-50" : ""
              }`}
              onClick={() => notification.isNew && markAsRead(notification._id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {getTitleFromType(notification.type, notification.message)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatTime(notification.createdAt)}
                  </div>
                </div>
                {notification.isNew && (
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer - Only show if there are notifications */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 text-center">
          <button
            className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
            onClick={() => {
              onClose();
              // Navigate to full notifications page if needed
            }}
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
