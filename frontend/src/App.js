import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

// Components
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AgentManagement from "./pages/AgentManagement";
import ListUpload from "./pages/ListUpload";
import ListManagement from "./pages/ListManagement";

// import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Container maxWidth="lg">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/agents" element={<AgentManagement />} />
                <Route path="/upload" element={<ListUpload />} />
                <Route path="/lists" element={<ListManagement />} />
              </Routes>
            </Container>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
