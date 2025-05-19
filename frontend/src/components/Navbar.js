import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Real Estate Management
        </Typography>
        <Box>
          {isLoggedIn ? (
            <>
              <Button color="inherit" component={RouterLink} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={RouterLink} to="/agents">
                Agents
              </Button>
              <Button color="inherit" component={RouterLink} to="/lists">
                Lists
              </Button>
              <Button color="inherit" component={RouterLink} to="/upload">
                Upload
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/">
                Home
              </Button>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
