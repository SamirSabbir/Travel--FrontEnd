import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

const PaymentApprove = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    fetchUnapprovedWorks();
  }, []);

  const fetchUnapprovedWorks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("/works/unapproved-works");
      if (response.data.success) {
        setWorks(response.data.data);
      } else {
        setError("Failed to fetch unapproved works");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (workId) => {
    try {
      setProcessing((prev) => ({ ...prev, [workId]: "approve" }));
      setError("");
      setSuccess("");

      const response = await axios.patch(`/works/approve-work/${workId}`);

      if (response.data.success) {
        setSuccess("Work approved successfully");
        // Remove the approved work from the list
        setWorks((prev) => prev.filter((work) => work._id !== workId));
      } else {
        setError("Failed to approve work");
      }
    } catch (err) {
      setError(err.message || "An error occurred while approving");
    } finally {
      setProcessing((prev) => ({ ...prev, [workId]: false }));
    }
  };

  const handleCancel = async (workId) => {
    try {
      setProcessing((prev) => ({ ...prev, [workId]: "cancel" }));
      setError("");
      setSuccess("");

      const response = await axios.patch(`works/cancel-work/${workId}`);

      if (response.data.success) {
        setSuccess("Work cancelled successfully");
        // Remove the cancelled work from the list
        setWorks((prev) => prev.filter((work) => work._id !== workId));
      } else {
        setError("Failed to cancel work");
      }
    } catch (err) {
      setError(err.message || "An error occurred while cancelling");
    } finally {
      setProcessing((prev) => ({ ...prev, [workId]: false }));
    }
  };

  const getStatusChip = (status) => {
    let color;
    switch (status) {
      case "Pending":
        color = "warning";
        break;
      case "Confirmed":
        color = "success";
        break;
      case "Draft":
        color = "default";
        break;
      default:
        color = "default";
    }
    return <Chip label={status} color={color} size="small" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Container
        maxWidth="xl" // Changed to xl for maximum width
        sx={{ mt: 4, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}> {/* Changed to xl for maximum width */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Payment Approval Dashboard
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchUnapprovedWorks} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Paper sx={{ width: "100%", overflow: "auto" }}> {/* Changed overflow to auto */}
        <TableContainer> {/* Removed maxHeight to disable scrolling */}
          <Table sx={{ minWidth: 1000 }} aria-label="unapproved works table"> {/* Added minWidth */}
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>UUID</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Work Status</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Leads Status</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Employee Email</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Payment</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Payment Status</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Created At</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1rem" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {works.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="textSecondary">
                      No unapproved works found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                works.map((work) => (
                  <TableRow key={work._id} hover>
                    <TableCell
                      sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
                    >
                      {work.uuId}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.9rem" }}>{work.name}</TableCell>
                    <TableCell sx={{ fontSize: "0.9rem" }}>{work.phone}</TableCell>
                    <TableCell>{getStatusChip(work.workStatus)}</TableCell>
                    <TableCell>{getStatusChip(work.leadsStatus)}</TableCell>
                    <TableCell sx={{ fontSize: "0.9rem" }}>{work.employeeEmail}</TableCell>
                    <TableCell sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>${work.payment}</TableCell>
                    <TableCell>
                      {work.paymentDetails &&
                        getStatusChip(work.paymentDetails.paymentStatus)}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.9rem" }}>{formatDate(work.createdAt)}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={
                            processing[work._id] === "approve" ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <ApproveIcon />
                            )
                          }
                          onClick={() => handleApprove(work._id)}
                          disabled={!!processing[work._id]}
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={
                            processing[work._id] === "cancel" ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <CancelIcon />
                            )
                          }
                          onClick={() => handleCancel(work._id)}
                          disabled={!!processing[work._id]}
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default PaymentApprove;