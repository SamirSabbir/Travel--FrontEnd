import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { Card, Typography, Grid, Box, CircularProgress } from "@mui/material";
import SummaryCards from "./SummaryCards";
import FinancialCharts from "./FinancialCharts";
import EmployeeCommission from "./EmployeeCommission";
import AccountTransactions from "./AccountTransactions";

const MyBusiness = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("/account/all-accounts");
        setAccounts(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch accounts");
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!accounts.length) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography variant="h6">No account data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        My Business
      </Typography>

      <SummaryCards accounts={accounts} />
      <FinancialCharts accounts={accounts} />
      <EmployeeCommission accounts={accounts} />
      <AccountTransactions accounts={accounts} />
    </Box>
  );
};

export default MyBusiness;
