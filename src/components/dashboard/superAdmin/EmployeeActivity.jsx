import React, { useState } from "react";
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
} from "lucide-react";

const activityTypes = {
  login: { icon: User, color: "bg-blue-500", label: "Login" },
  task: { icon: FileText, color: "bg-indigo-500", label: "Task Update" },
  meeting: { icon: Video, color: "bg-purple-500", label: "Meeting" },
  upload: { icon: Upload, color: "bg-green-500", label: "File Upload" },
  complete: {
    icon: CheckCircle,
    color: "bg-emerald-500",
    label: "Task Complete",
  },
  alert: { icon: AlertCircle, color: "bg-red-500", label: "Alert" },
};

const EmployeeActivity = ({
  userData,
  onlineUsers,
  activities,
  stats,
  setActivities,
}) => {
  const user = userData;
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredActivities = activities.filter((activity) => {
    const matchesFilter =
      selectedFilter === "all" || activity.action === selectedFilter;
    const matchesSearch =
      activity.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.message?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const ts = new Date(timestamp);
    const diff = now.getTime() - ts.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Employee Activity Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor real-time employee activities and system events
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Online Employees
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.onlineEmployees}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completed Tasks
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedTasks}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Employee Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Employee Status
              </h2>
              <div className="space-y-3">
                {onlineUsers.length === 0 ? (
                  <p className="text-gray-500 text-sm">No employees online</p>
                ) : (
                  onlineUsers.map((employee) => (
                    <div
                      key={employee.userEmail}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                          {employee.userName?.[0] || "?"}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            employee.isOnline ? "bg-green-500" : "bg-gray-400"
                          }`}
                        ></div>
                        {employee.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 animate-ping opacity-75"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {employee.userName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {employee.userEmail}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Live Activity Feed
                </h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Activities</option>
                      {Object.entries(activityTypes).map(([key, type]) => (
                        <option key={key} value={key}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto space-y-4">
                {filteredActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <Eye className="w-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">
                      No activities match your filters
                    </p>
                  </div>
                ) : (
                  filteredActivities.map((activity) => {
                    const type =
                      activityTypes[activity.action] || activityTypes.task;
                    const ActivityIcon = type.icon;
                    const colorClass = type.color;

                    return (
                      <div
                        key={activity._id}
                        className="flex items-start space-x-4 p-4 rounded-lg border bg-gray-50 hover:bg-gray-100"
                      >
                        <div
                          className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center`}
                        >
                          <ActivityIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">
                                {activity.userName}
                              </span>
                              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                {activity.userEmail}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{formatTimeAgo(activity.createdAt)}</span>
                            </div>
                          </div>
                          <p className="text-gray-700 mt-1">
                            {activity.message}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 mt-2 inline-block rounded-full text-white ${colorClass}`}
                          >
                            {type.label}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeActivity;
