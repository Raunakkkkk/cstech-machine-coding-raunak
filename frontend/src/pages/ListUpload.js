import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Input = styled("input")({
  display: "none",
});

function ListUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [distributedItems, setDistributedItems] = useState([]);
  const [agents, setAgents] = useState([]);

  // Create axios instance with auth header
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
      if (res.data.length === 0) {
        setMessage({
          text: "Please add agents before uploading lists",
          type: "warning",
        });
      }
    } catch (err) {
      setMessage({
        text: "Failed to fetch agents. Please try again.",
        type: "error",
      });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const fileType = selectedFile.name.split(".").pop().toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(fileType)) {
      setMessage({
        text: "Only CSV, XLSX and XLS files are allowed",
        type: "error",
      });
      return;
    }

    setFile(selectedFile);
    setMessage({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || agents.length === 0) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await api.post("/lists/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setDistributedItems(res.data.items || []);
      setMessage({
        text: `Successfully distributed ${res.data.items.length} items`,
        type: "success",
      });
      setFile(null);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to upload file",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Upload and Distribute Lists
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "100%", textAlign: "center", mb: 3 }}>
                <label htmlFor="file-upload">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Select File
                  </Button>
                </label>

                {file && (
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={file.name}
                      variant="outlined"
                      color="primary"
                      onDelete={() => setFile(null)}
                    />
                  </Box>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!file || loading || agents.length === 0}
                sx={{ mt: 2, minWidth: 200 }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Upload and Distribute"
                )}
              </Button>
            </Box>
          </form>
        </Paper>

        {distributedItems.length > 0 && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Distributed Items
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>First Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Phone</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Notes</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Agent</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {distributedItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.firstName}</TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>{item.notes || "-"}</TableCell>
                      <TableCell>
                        {agents.find((a) => a._id === item.agentId)?.name ||
                          "Unknown"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default ListUpload;
