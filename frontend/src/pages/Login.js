import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Divider,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <AdminPanelSettingsIcon
              sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
            />
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Admin Login
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              align="center"
            >
              Real Estate Management System
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="email"
              label="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
              variant="outlined"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3 }}
              startIcon={<AdminPanelSettingsIcon />}
            >
              Login as Admin
            </Button>
          </form>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 3 }}
          >
            * Only administrators can access this system.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
