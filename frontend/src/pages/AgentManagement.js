import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
  InputAdornment,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function AgentManagement() {
  const [agents, setAgents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Add axios instance with auth header
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await api.get("/agents");
      setAgents(res.data);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to fetch agents",
        severity: "error",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await api.post("/agents", {
        name,
        email,
        mobile,
        password,
      });
      fetchAgents();
      setName("");
      setEmail("");
      setMobile("");
      setPassword("");
      setSnackbar({
        open: true,
        message: "Agent added successfully",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to add agent",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Agent Management
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Add New Agent
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  placeholder="Enter 10 digit mobile number"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                  startIcon={<PersonAddIcon />}
                >
                  Add Agent
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper elevation={3}>
              <TableContainer>
                <Typography variant="h6" sx={{ p: 2 }}>
                  Agents List
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Email</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Mobile</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agents.length > 0 ? (
                      agents.map((agent) => (
                        <TableRow key={agent._id}>
                          <TableCell>{agent.name}</TableCell>
                          <TableCell>{agent.email}</TableCell>
                          <TableCell>{agent.mobile}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No agents found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AgentManagement;
