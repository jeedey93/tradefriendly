import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  Divider,
} from "@mui/material";

function Teams() {
  const [teamsData, setTeamsData] = useState([]);

  useEffect(() => {
    fetch("/api/teams")
      .then((response) => response.json())
      .then((data) => {
        data.sort((a, b) => a.city.localeCompare(b.city));
        setTeamsData(data);
      })
      .catch((error) => console.error("Error fetching teams data:", error));
  }, []);

  return (
    <main>
      <Container
        maxWidth="lg"
        sx={{ py: 6, bgcolor: "#f9f9f9", borderRadius: 2 }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3" color="primary" gutterBottom>
            NHL Teams
          </Typography>
          <Typography variant="h6" color="textSecondary" paragraph>
            Discover trade-friendly players for your NHL team. Click on a team
            to explore their players, profiles, and stats.
          </Typography>
          <Divider
            variant="middle"
            sx={{ my: 2, borderColor: "primary.main" }}
          />
        </Box>

        <Grid container spacing={4}>
          {teamsData.map((team) => (
            <Grid item key={team.abbreviation} xs={12} sm={6} md={4} lg={3}>
              <Link
                to={`/teams/${team.abbreviation}`}
                style={{ textDecoration: "none" }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 10,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={team.logo}
                    alt={team.name}
                    sx={{
                      objectFit: "contain",
                      p: 2,
                      bgcolor: "#e0e0e0",
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                    <Typography variant="h6" color="textPrimary" gutterBottom>
                      {team.city}
                    </Typography>
                    <Typography variant="h5" color="textSecondary">
                      {team.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
}

export default Teams;
