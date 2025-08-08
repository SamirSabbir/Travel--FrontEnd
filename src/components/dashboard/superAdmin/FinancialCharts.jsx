import React from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const FinancialCharts = ({ accounts }) => {
  // Prepare data for charts
  const monthlyData = accounts.reduce((acc, account) => {
    const date = new Date(account.createdAt);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    if (!acc[monthYear]) {
      acc[monthYear] = {
        month: monthYear,
        revenue: 0,
        expense: 0,
        commission: 0,
        income: 0,
      };
    }

    acc[monthYear].revenue += account.revenue;
    acc[monthYear].expense += account.expense;
    acc[monthYear].commission += account.commission;
    acc[monthYear].income += account.income;

    return acc;
  }, {});

  const chartData = Object.values(monthlyData).sort((a, b) =>
    a.month.localeCompare(b.month)
  );

  // Calculate totals for pie chart
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

  const pieData = [
    { name: "Revenue", value: totals.revenue },
    { name: "Expense", value: totals.expense },
    { name: "Commission", value: totals.commission },
    { name: "Income", value: totals.income },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Financial Performance - 40% width */}
      <Grid item xs={12} md={5}>
        <DashboardCard>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Financial Performance Over Time
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stackId="2"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stackId="3"
                    stroke="#ffc658"
                    fill="#ffc658"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </DashboardCard>
      </Grid>

      {/* Revenue Breakdown - 60% width */}
      <Grid item xs={12} md={7}>
        <DashboardCard>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Revenue Breakdown
            </Typography>
            <Box
              sx={{
                height: 450,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 3,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "700px", // increased width
                  minWidth: "500px", // to avoid clipping
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={140} // slightly larger
                      dataKey="value"
                      label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        percent,
                        index,
                      }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = outerRadius + 20;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                          <text
                            x={x}
                            y={y}
                            fill={COLORS[index % COLORS.length]}
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                            fontSize={13}
                          >
                            {`${pieData[index].name}: ${(percent * 100).toFixed(
                              0
                            )}%`}
                          </text>
                        );
                      }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </CardContent>
        </DashboardCard>
      </Grid>
    </Grid>
  );
};

export default FinancialCharts;
