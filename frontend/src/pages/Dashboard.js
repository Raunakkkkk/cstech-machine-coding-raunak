import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    agentCount: 0,
    listItemCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create axios instance with auth header
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch dashboard stats
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      // Get agent count
      const agentsRes = await api.get("/agents");
      const agentCount = agentsRes.data.length;

      // Get list items count
      const listsRes = await api.get("/lists");
      const listItemCount = listsRes.data.length;

      setStats({
        agentCount,
        listItemCount,
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            <DashboardIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Admin Dashboard
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 3 }}>
            {error}
          </Typography>
        )}

        {/* Stats Cards */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: "100%",
                bgcolor: "primary.light",
                color: "white",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Total Agents
              </Typography>
              <Typography variant="h3">{stats.agentCount}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: "100%",
                bgcolor: "secondary.light",
                color: "white",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Total Leads
              </Typography>
              <Typography variant="h3">{stats.listItemCount}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Management Options
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Action Cards */}
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Agent Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Add, view, and manage real estate agents in the system.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="large"
                  variant="contained"
                  fullWidth
                  onClick={() => navigate("/agents")}
                >
                  Manage Agents
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  <CloudUploadIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  List Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Upload and distribute lists to agents in the system.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="large"
                  variant="contained"
                  fullWidth
                  onClick={() => navigate("/upload")}
                >
                  Upload Lists
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;
