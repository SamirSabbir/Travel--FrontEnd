import React from "react";
import {
  Card,
  CardContent,
  Typography,
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

const DashboardCard = styled(Card)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 30px 0 rgba(0,0,0,0.15)",
  },
}));

const AccountTransactions = ({ accounts }) => {
  return (
    <>
      <DashboardCard sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Account Transactions
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Revenue</TableCell>
                  <TableCell>Expense</TableCell>
                  <TableCell>Commission</TableCell>
                  <TableCell>Income</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>Receipt</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account._id}>
                    <TableCell>
                      {new Date(account.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${account.revenue.toLocaleString()}</TableCell>
                    <TableCell>${account.expense.toLocaleString()}</TableCell>
                    <TableCell>
                      ${account.commission.toLocaleString()}
                    </TableCell>
                    <TableCell>${account.income.toLocaleString()}</TableCell>
                    <TableCell>{account.accountAdminEmail}</TableCell>
                    <TableCell>
                      <Box
                        component="a"
                        href={account.receipt}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: "inline-block",
                          px: 2,
                          py: 1,
                          backgroundColor: "#FFEB3B", // yellow
                          color: "#000",
                          textDecoration: "none",
                          borderRadius: "6px",
                          fontWeight: "500",
                          transition: "0.3s",
                          "&:hover": {
                            backgroundColor: "#FDD835",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        View Receipt
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </DashboardCard>

      <DashboardCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detailed Commission Breakdown
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Sales Person</TableCell>
                  <TableCell align="right">Commission Rate</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Admin</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.flatMap((account) =>
                  account.commissionDetails.map((detail, index) => (
                    <TableRow key={`${account._id}-${index}`}>
                      <TableCell>
                        {new Date(account.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{detail.salesPersonEmail}</TableCell>
                      <TableCell align="right">
                        {detail.commissionRate}%
                      </TableCell>
                      <TableCell align="right">
                        ${detail.commissionAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>{account.accountAdminEmail}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </DashboardCard>
    </>
  );
};

export default AccountTransactions;
