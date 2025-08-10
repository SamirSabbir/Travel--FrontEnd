import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { Box, Typography, Card, CardContent, Grid, Paper, Divider, CircularProgress, Avatar, Chip, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 24px 0 rgba(0,0,0,0.15)'
  }
}));

const StatusChip = styled(Chip)(({ status, theme }) => {
  let color;
  switch (status) {
    case 'confirmed':
      color = theme.palette.success.main;
      break;
    case 'pending':
      color = theme.palette.warning.main;
      break;
    case 'false':
      color = theme.palette.error.main;
      break;
    default:
      color = theme.palette.info.main;
  }
  return {
    backgroundColor: color,
    color: theme.palette.common.white,
    fontWeight: 'bold'
  };
});

const SalesPipeline = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [pipelineData, setPipelineData] = useState([]);
  const [loading, setLoading] = useState({
    users: true,
    sales: false,
    pipeline: false
  });
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users/findAllUsers');
        setUsers(response.data.data.filter(user => user.role === 'Employee'));
        setLoading(prev => ({ ...prev, users: false }));
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(prev => ({ ...prev, users: false }));
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserData(selectedUser.email);
    }
  }, [selectedUser]);

  const fetchUserData = async (email) => {
    try {
      setLoading(prev => ({ ...prev, sales: true, pipeline: true }));
      
      const [salesRes, pipelineRes] = await Promise.all([
        axios.get(`/sales/employee-sales/${email}`),
        axios.get(`/works/my-pipeline/${email}`)
      ]);
      
      setSalesData(salesRes.data.data);
      setPipelineData(pipelineRes.data.data);
      setLoading(prev => ({ ...prev, sales: false, pipeline: false }));
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(prev => ({ ...prev, sales: false, pipeline: false }));
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setTabValue(0); // Reset to sales tab when selecting new user
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const salesColumns = [
    { field: 'customerName', headerName: 'Customer', width: 150 },
    { field: 'phoneNumber', headerName: 'Phone', width: 130 },
    { 
      field: 'isConfirmed', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <StatusChip 
          label={params.value === 'true' ? 'Confirmed' : 'Pending'} 
          status={params.value === 'true' ? 'confirmed' : 'pending'} 
          size="small" 
        />
      )
    },
    { field: 'description', headerName: 'Description', width: 250 },
    { 
      field: 'createdAt', 
      headerName: 'Date', 
      width: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
  ];

  const pipelineColumns = [
    { field: 'name', headerName: 'Customer', width: 150 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <StatusChip label={params.value} status={params.value} size="small" />
      )
    },
  ];

  const prepareChartData = () => {
    if (!salesData.length) return [];
    
    const statusCounts = salesData.reduce((acc, sale) => {
      const status = sale.isConfirmed === 'true' ? 'Confirmed' : 'Pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(statusCounts).map(([name, count]) => ({ name, count }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Sales Pipeline Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Users List */}
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Employees
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              {loading.users ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {users.map((user) => (
                    <Paper 
                      key={user._id} 
                      elevation={selectedUser?._id === user._id ? 3 : 1} 
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        cursor: 'pointer', 
                        backgroundColor: selectedUser?._id === user._id ? 'action.selected' : 'background.paper',
                        borderRadius: '8px'
                      }}
                      onClick={() => handleUserSelect(user)}
                    >
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">{user.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                          <Box display="flex" mt={1}>
                            <Chip label={`KPI: ${user.KPI}`} size="small" sx={{ mr: 1 }} />
                            <Chip label={`Salary: $${user.salary}`} size="small" color="primary" />
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </StyledCard>
        </Grid>
        
        {/* User Details */}
        <Grid item xs={12} md={8}>
          {selectedUser ? (
            <StyledCard>
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" component="h2" fontWeight="bold">
                      {selectedUser.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {selectedUser.email}
                    </Typography>
                  </Box>
                  <Box ml="auto" display="flex">
                    <Chip 
                      label={`KPI: ${selectedUser.KPI}`} 
                      color="secondary" 
                      sx={{ mr: 1, fontWeight: 'bold' }} 
                    />
                    <Chip 
                      label={`Salary: $${selectedUser.salary.toLocaleString()}`} 
                      color="success" 
                      sx={{ fontWeight: 'bold' }} 
                    />
                  </Box>
                </Box>
                
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                  <Tab label="Sales Performance" />
                  <Tab label="Pipeline" />
                  <Tab label="Analytics" />
                </Tabs>
                
                <Divider sx={{ mb: 3 }} />
                
                {tabValue === 0 && (
                  <Box sx={{ height: 400 }}>
                    {loading.sales ? (
                      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress />
                      </Box>
                    ) : (
                      <DataGrid
                        rows={salesData}
                        columns={salesColumns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        getRowId={(row) => row._id}
                        sx={{
                          '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'primary.main',
                            color: 'common.white',
                            fontSize: '0.875rem'
                          }
                        }}
                      />
                    )}
                  </Box>
                )}
                
                {tabValue === 1 && (
                  <Box sx={{ height: 400 }}>
                    {loading.pipeline ? (
                      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress />
                      </Box>
                    ) : (
                      <DataGrid
                        rows={pipelineData}
                        columns={pipelineColumns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        getRowId={(row) => row._id}
                        sx={{
                          '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'primary.main',
                            color: 'common.white',
                            fontSize: '0.875rem'
                          }
                        }}
                      />
                    )}
                  </Box>
                )}
                
                {tabValue === 2 && (
                  <Box sx={{ height: 400 }}>
                    {loading.sales ? (
                      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress />
                      </Box>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={prepareChartData()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" name="Sales Count" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                )}
              </CardContent>
            </StyledCard>
          ) : (
            <StyledCard>
              <CardContent>
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                  <Typography variant="h6" color="text.secondary">
                    Select an employee to view their sales and pipeline data
                  </Typography>
                </Box>
              </CardContent>
            </StyledCard>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalesPipeline;