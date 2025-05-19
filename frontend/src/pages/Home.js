import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";

function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Real Estate Management
          </Typography>
          <Typography variant="body1" paragraph>
            Manage your real estate agents and property lists efficiently with
            our comprehensive platform.
          </Typography>
          <Typography variant="body1">
            Get started by exploring agents or managing your property lists.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Home;
