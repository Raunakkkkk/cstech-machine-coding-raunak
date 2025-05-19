import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

function ListManagement() {
  const [lists, setLists] = useState([]);
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
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const res = await api.get("/lists");
      setLists(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch lists");
    } finally {
      setLoading(false);
    }
  };

  // Group lists by agent
  const listsByAgent = lists.reduce((acc, list) => {
    const agentId = list.agentId._id;
    if (!acc[agentId]) {
      acc[agentId] = {
        agent: list.agentId,
        items: [],
      };
    }
    acc[agentId].items.push(list);
    return acc;
  }, {});

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
        <Typography variant="h4" component="h1" gutterBottom>
          Distributed Lists
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {Object.entries(listsByAgent).map(([agentId, data]) => (
            <Grid item xs={12} key={agentId}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {data.agent.name} - {data.items.length} Items
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
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.items.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>{item.firstName}</TableCell>
                            <TableCell>{item.phone}</TableCell>
                            <TableCell>{item.notes || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {Object.keys(listsByAgent).length === 0 && (
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6" color="text.secondary">
                  No lists have been distributed yet
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}

export default ListManagement;
