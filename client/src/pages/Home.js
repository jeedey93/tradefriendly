import React from "react";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  CssBaseline,
} from "@mui/material";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        color: "#fff",
      }}
    >
      <CssBaseline /> {/* Normalize CSS */}
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          mb: 4,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          borderRadius: 2,
          p: 3,
        }}
      >
        <Typography variant="h2" align="center" gutterBottom>
          Welcome to Trade Friendly
        </Typography>
        <Typography variant="h5" align="center" paragraph>
          Discover the best NHL teams and players. Manage your roster, analyze
          player stats, and make informed trade decisions.
        </Typography>

        <Box display="flex" justifyContent="center" mb={4}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/teams"
            size="large"
          >
            Explore Teams
          </Button>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/400x200?text=Teams"
                alt="Teams"
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  Teams
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Explore detailed information about NHL teams.
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to="/teams"
                  >
                    View Teams
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/400x200?text=Trade+Simulator"
                alt="Trade Simulator"
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  Trade Simulator
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Simulate trades and see how they impact your team.
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to="/tradeSimulator"
                  >
                    Try Simulator
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/400x200?text=Fantasy+Pool"
                alt="Fantasy Pool"
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  Fantasy Pool
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Manage your fantasy hockey team with advanced tools and stats.
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to="/fantasyPool"
                  >
                    Join Fantasy Pool
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/400x200?text=Draft+Tracker"
                alt="Draft Tracker"
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  Draft Tracker
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Keep track of draft picks and player selections.
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to="/draftTracker"
                  >
                    Track Drafts
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default HomePage;
