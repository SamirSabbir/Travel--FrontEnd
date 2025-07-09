import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/profile/Login";
import Register from "./pages/profile/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import PendingApproval from "./pages/profile/PendingApproval";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Routes>
        {/* default route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - Dummy setup for now */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pending" element={<PendingApproval />} />
      </Routes>
    </div>
  );
};

export default App;
