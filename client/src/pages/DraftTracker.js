import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

// Utility function to convert inches to feet and inches
function convertInchesToFeetAndInches(inches) {
  if (!inches) return "N/A";
  const feet = Math.floor(inches / 12);
  const remainderInches = inches % 12;
  return `${feet}'${remainderInches}"`;
}

function DraftRanking() {
  const [naSkatersRankings, setNaSkatersRankings] = useState([]);
  const [internationalSkatersRankings, setInternationalSkatersRankings] =
    useState([]);
  const [naGoaliesRankings, setNaGoaliesRankings] = useState([]);
  const [internationalGoaliesRankings, setInternationalGoaliesRankings] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("naSkatersRankings"); // Default view
  const [selectedYear, setSelectedYear] = useState("2024"); // Default year

  // List of available years for the dropdown
  const draftYears = Array.from({ length: 17 }, (_, i) =>
    (2024 - i).toString()
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch(`/nhl/draft/${selectedYear}/ranking/1`),
          fetch(`/nhl/draft/${selectedYear}/ranking/2`),
          fetch(`/nhl/draft/${selectedYear}/ranking/3`),
          fetch(`/nhl/draft/${selectedYear}/ranking/4`),
        ]);

        if (!responses.every((response) => response.ok)) {
          throw new Error("One or more requests failed");
        }

        const [
          naSkaters,
          internationalSkaters,
          naGoalies,
          internationalGoalies,
        ] = await Promise.all(responses.map((response) => response.json()));

        setNaSkatersRankings(naSkaters);
        setInternationalSkatersRankings(internationalSkaters);
        setNaGoaliesRankings(naGoalies);
        setInternationalGoaliesRankings(internationalGoalies);
      } catch (error) {
        setError("Error fetching draft ranking data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress size={60} color="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const dataToDisplay =
    view === "naSkatersRankings"
      ? naSkatersRankings
      : view === "internationalSkatersRankings"
      ? internationalSkatersRankings
      : view === "naGoaliesRankings"
      ? naGoaliesRankings
      : view === "internationalGoaliesRankings"
      ? internationalGoaliesRankings
      : []; // Default case if none of the conditions match

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel id="select-year-label">Draft Year</InputLabel>
            <Select
              labelId="select-year-label"
              value={selectedYear}
              onChange={handleYearChange}
              label="Draft Year"
            >
              {draftYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={9}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="View Type"
            sx={{ mb: 2 }}
          >
            <ToggleButton
              value="naSkatersRankings"
              aria-label="North American Skater"
            >
              North American Skater
            </ToggleButton>
            <ToggleButton
              value="internationalSkatersRankings"
              aria-label="International Skater"
            >
              International Skater
            </ToggleButton>
            <ToggleButton
              value="naGoaliesRankings"
              aria-label="North American Goalie"
            >
              North American Goalie
            </ToggleButton>
            <ToggleButton
              value="internationalGoaliesRankings"
              aria-label="International Goalie"
            >
              International Goalie
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Paper variant="outlined" sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Final Rank
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Player
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Position
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Shoots/Catches
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Height (inches)
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Weight (lbs)
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Last Amateur Club
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Last Amateur League
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Birth Date
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Birth Country
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataToDisplay.map((player, index) => (
                <TableRow key={index}>
                  <TableCell>{player.finalRank || "N/A"}</TableCell>
                  <TableCell>
                    {player.firstName || "N/A"} {player.lastName || "N/A"}
                  </TableCell>
                  <TableCell>{player.positionCode || "N/A"}</TableCell>
                  <TableCell>{player.shootsCatches || "N/A"}</TableCell>
                  <TableCell>
                    {convertInchesToFeetAndInches(player.heightInInches)}
                  </TableCell>
                  <TableCell>{player.weightInPounds || "N/A"}</TableCell>
                  <TableCell>{player.lastAmateurClub || "N/A"}</TableCell>
                  <TableCell>{player.lastAmateurLeague || "N/A"}</TableCell>
                  <TableCell>{player.birthDate || "N/A"}</TableCell>
                  <TableCell>{player.birthCountry || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

export default DraftRanking;
