import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DashboardCard = styled(Card)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 30px 0 rgba(0,0,0,0.15)",
  },
}));

const EmployeeCommission = ({ accounts }) => {
  // Prepare commission data
  const commissionData = accounts.flatMap((account) =>
    account.commissionDetails.map((detail) => ({
      ...detail,
      date: new Date(account.createdAt).toLocaleDateString(),
      accountAdmin: account.accountAdminEmail,
    }))
  );

  // Find top employees by commission
  const employeeCommission = commissionData.reduce((acc, detail) => {
    if (!acc[detail.salesPersonEmail]) {
      acc[detail.salesPersonEmail] = {
        email: detail.salesPersonEmail,
        totalCommission: 0,
        count: 0,
        maxRate: 0,
      };
    }
    acc[detail.salesPersonEmail].totalCommission += detail.commissionAmount;
    acc[detail.salesPersonEmail].count += 1;
    if (detail.commissionRate > acc[detail.salesPersonEmail].maxRate) {
      acc[detail.salesPersonEmail].maxRate = detail.commissionRate;
    }
    return acc;
  }, {});

  const topEmployees = Object.values(employeeCommission)
    .sort((a, b) => b.totalCommission - a.totalCommission)
    .slice(0, 5);

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={6}>
        <DashboardCard>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Employees by Commission
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topEmployees}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="email" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      "Total Commission",
                    ]}
                  />
                  <Legend />
                  <Bar
                    dataKey="totalCommission"
                    name="Total Commission"
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </DashboardCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <DashboardCard>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Employee Commission Details
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell align="right">Commission Rate</TableCell>
                    <TableCell align="right">Total Commission</TableCell>
                    <TableCell align="right">Transactions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topEmployees.map((employee) => (
                    <TableRow key={employee.email}>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell align="right">{employee.maxRate}%</TableCell>
                      <TableCell align="right">
                        ${employee.totalCommission.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">{employee.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </DashboardCard>
      </Grid>
    </Grid>
  );
};

export default EmployeeCommission;
