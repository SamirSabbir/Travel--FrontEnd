import React from "react";
import { Card, CardContent, Typography, Grid, Chip, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Paid,
} from "@mui/icons-material";

const DashboardCard = styled(Card)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 30px 0 rgba(0,0,0,0.15)",
  },
}));

const SummaryCards = ({ accounts }) => {
  const totals = accounts.reduce(
    (acc, account) => {
      acc.revenue += account.revenue;
      acc.expense += account.expense;
      acc.commission += account.commission;
      acc.income += account.income;
      return acc;
    },
    { revenue: 0, expense: 0, commission: 0, income: 0 }
  );

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={3}>
        <DashboardCard>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <AccountBalance color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h6" color="textSecondary">
                Total Revenue
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                ${totals.revenue.toLocaleString()}
              </Typography>
              <Chip
                label={`${(
                  ((totals.revenue - totals.expense) / totals.revenue) *
                  100
                ).toFixed(1)}% margin`}
                color="success"
                size="small"
              />
            </Box>
          </CardContent>
        </DashboardCard>
      </Grid>

      <Grid item xs={12} md={3}>
        <DashboardCard>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <TrendingDown color="error" sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h6" color="textSecondary">
                Total Expenses
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              ${totals.expense.toLocaleString()}
            </Typography>
          </CardContent>
        </DashboardCard>
      </Grid>

      <Grid item xs={12} md={3}>
        <DashboardCard>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <Paid color="warning" sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h6" color="textSecondary">
                Total Commission
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              ${totals.commission.toLocaleString()}
            </Typography>
          </CardContent>
        </DashboardCard>
      </Grid>

      <Grid item xs={12} md={3}>
        <DashboardCard>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <TrendingUp color="success" sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h6" color="textSecondary">
                Net Income
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              ${totals.income.toLocaleString()}
            </Typography>
          </CardContent>
        </DashboardCard>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;
