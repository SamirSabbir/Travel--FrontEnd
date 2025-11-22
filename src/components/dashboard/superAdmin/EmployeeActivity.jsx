import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import {
  User,
  Clock,
  FileText,
  Video,
  Upload,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Users,
  Eye,
  X,
  Calendar,
  Mail,
  Activity,
  Shield,
  Info,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const activityTypes = {
  login: { icon: User, color: "bg-blue-500", label: "User Login" },
  task: { icon: FileText, color: "bg-indigo-500", label: "Task Update" },
  meeting: { icon: Video, color: "bg-purple-500", label: "Meeting" },
  upload: { icon: Upload, color: "bg-green-500", label: "File Upload" },
  complete: {
    icon: CheckCircle,
    color: "bg-emerald-500",
    label: "Task Completed",
  },
  alert: { icon: AlertCircle, color: "bg-red-500", label: "System Alert" },
};

const EmployeeActivity = ({ userData, onlineUsers, stats, socket }) => {
  const [activities, setActivities] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);
  const [loading, setLoading] = useState(false);

  const ITEMS_PER_PAGE = 6;

  // Fetch activities with pagination
  const fetchActivities = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...filters,
      });

      const res = await axios.get(`/activities/?${params}`);
      if (res.data.success) {
        const { items, total, pages } = res.data.data;
        setActivities(items);
        setTotalActivities(total);
        setTotalPages(pages);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("Failed to fetch activities:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchActivities(1);
  }, []);

  // Handle filter changes
  useEffect(() => {
    const filters = {};
    if (selectedFilter !== "all") {
      // Note: This would need backend support for action filtering
      // For now, we'll filter on frontend after fetch
    }
    if (searchTerm) {
      // Note: This would need backend support for search
      // For now, we'll filter on frontend after fetch
    }
    fetchActivities(1, filters);
  }, [selectedFilter]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        fetchActivities(1);
      } else if (searchTerm === "") {
        fetchActivities(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Real-time updates - add new activity to first page
  useEffect(() => {
    if (!socket) return;
    const handleNewActivity = (activity) => {
      if (currentPage === 1) {
        setActivities((prev) => [
          activity,
          ...prev.slice(0, ITEMS_PER_PAGE - 1),
        ]);
        setTotalActivities((prev) => prev + 1);
      }
    };
    socket.on("activity:new", handleNewActivity);
    return () => socket.off("activity:new", handleNewActivity);
  }, [socket, currentPage]);

  // Client-side filtering for search and filter (until backend supports it)
  const filteredActivities = activities.filter((activity) => {
    const matchesFilter =
      selectedFilter === "all" || activity?.action === selectedFilter;
    const matchesSearch =
      !searchTerm ||
      activity?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity?.message?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const ts = new Date(timestamp);
    const diff = now.getTime() - ts.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchActivities(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Workforce Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time insights into employee productivity, engagement, and
            organizational activities
          </p>
        </div>

        {/* Active Employees Summary */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Active Team Members
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.onlineEmployees || onlineUsers.length}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Currently online and active
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Total Activities
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalActivities.toLocaleString()}
                </p>
                <p className="text-sm text-blue-600 mt-1">System-wide events</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Employee Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Team Status</h2>
              </div>
              <div className="space-y-4">
                {onlineUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      No team members online
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Check back later
                    </p>
                  </div>
                ) : (
                  onlineUsers.map((employee) => {
                    return (
                      <div
                        key={employee.userEmail}
                        className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {employee.userName?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div
                            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-white shadow-sm ${
                              employee.isOnline ? "bg-green-500" : "bg-gray-400"
                            }`}
                          ></div>
                          {employee.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 animate-ping opacity-75"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {employee.userName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {employee.userEmail}
                          </p>
                          <div className="flex items-center mt-1">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                employee.isOnline
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            ></div>
                            <span
                              className={`text-xs font-medium ${
                                employee.isOnline
                                  ? "text-green-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {employee.isOnline ? "Active" : "Away"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Activity Feed with Pagination */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Activity Timeline
                      </h2>
                      <p className="text-sm text-gray-500">
                        Live updates from your organization • Page {currentPage}{" "}
                        of {totalPages}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity List */}
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading activities...</p>
                  </div>
                ) : filteredActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Activities Found
                    </h3>
                    <p className="text-gray-500">
                      No activities match your current filters
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {filteredActivities.map((activity) => {
                      const type =
                        activityTypes[activity?.action] || activityTypes.task;
                      const ActivityIcon = type.icon;
                      const colorClass = type.color;

                      return (
                        <div
                          key={activity?._id}
                          onClick={() => setSelectedActivity(activity)}
                          className="cursor-pointer group"
                        >
                          <div className="flex items-start space-x-4 p-5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
                            <div
                              className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                            >
                              <ActivityIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-3">
                                  <span className="font-bold text-gray-900 text-lg">
                                    {activity?.userName}
                                  </span>
                                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                                    {activity?.userEmail}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <Clock className="w-4 h-4" />
                                  <span className="font-medium">
                                    {formatTimeAgo(activity?.createdAt)}
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-700 mb-3 text-base leading-relaxed">
                                {activity?.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-sm px-3 py-1 rounded-full text-white font-medium ${colorClass} shadow-sm`}
                                >
                                  {type.label}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">
                                  Click for details
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Professional Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>Showing</span>
                      <span className="font-semibold text-gray-900">
                        {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                      </span>
                      <span>to</span>
                      <span className="font-semibold text-gray-900">
                        {Math.min(
                          currentPage * ITEMS_PER_PAGE,
                          totalActivities
                        )}
                      </span>
                      <span>of</span>
                      <span className="font-semibold text-gray-900">
                        {totalActivities.toLocaleString()}
                      </span>
                      <span>activities</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* First Page */}
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronsLeft className="w-4 h-4" />
                      </button>

                      {/* Previous Page */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center space-x-1">
                        {getPageNumbers().map((page, index) => (
                          <React.Fragment key={index}>
                            {page === "..." ? (
                              <span className="px-3 py-2 text-gray-500">
                                ...
                              </span>
                            ) : (
                              <button
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  currentPage === page
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                                }`}
                              >
                                {page}
                              </button>
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* Next Page */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Last Page */}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronsRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Professional Modal */}
      {selectedActivity && (
        <BusinessModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  );
};

export default EmployeeActivity;

const BusinessModal = ({ activity, onClose }) => {
  const type = activityTypes[activity?.action] || activityTypes.task;
  const ActivityIcon = type.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden transform transition-all">
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-8 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 rounded-2xl ${type.color} flex items-center justify-center shadow-lg`}
              >
                <ActivityIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Employee Activity Report
                </h2>
                <p className="text-slate-300 text-lg">
                  Detailed Activity Information
                </p>
              </div>
            </div>
            <button
              className="text-slate-300 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-xl"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Activity Type Badge */}
          <div className="mt-6">
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${type.color} text-white shadow-lg`}
            >
              <Shield className="w-5 h-5 mr-2" />
              {type.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-h-96 overflow-y-auto">
          <div className="grid gap-8">
            {/* Employee Information */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Employee Information
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Employee Name
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {activity?.userName || "Not Available"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Email Address
                  </p>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <p className="text-lg font-bold text-gray-900">
                      {activity?.userEmail}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Details */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <div className="flex items-center space-x-3 mb-6">
                <Activity className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Activity Details
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Activity Type
                  </p>
                  <div className="flex items-center space-x-3">
                    <ActivityIcon className="w-5 h-5 text-gray-600" />
                    <span className="text-lg font-bold text-gray-900 capitalize">
                      {activity?.action}
                    </span>
                  </div>
                </div>
                {activity?.message && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                      Description
                    </p>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <p className="text-gray-800 text-base leading-relaxed">
                        {activity?.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Date & Time Information */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
              <div className="flex items-center space-x-3 mb-6">
                <Calendar className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-900">Date & Time</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Date
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(activity?.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Time
                  </p>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(activity?.createdAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {activity?.meta && Object.keys(activity?.meta).length > 0 && (
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                <div className="flex items-center space-x-3 mb-6">
                  <Info className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Additional Information
                  </h3>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="space-y-3">
                    {Object.entries(activity?.meta).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-semibold text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="text-gray-900 font-medium">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reference Information */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <Info className="w-6 h-6 text-gray-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Reference Information
                </h3>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Activity Reference ID
                </p>
                <div className="bg-gray-100 px-4 py-3 rounded-xl border">
                  <code className="text-sm font-mono text-gray-800 break-all">
                    {activity?._id}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Workforce Analytics Dashboard
              </p>
              <p className="text-xs text-gray-500">
                Confidential Employee Data • {new Date().getFullYear()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors text-sm font-semibold shadow-lg"
            >
              Close Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
