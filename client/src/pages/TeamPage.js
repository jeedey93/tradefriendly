import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlayerTable from "../components/PlayerTable";
import Lineup from "../components/Lineup";
import TradeBlock from "../components/TradeBlock";
import {
  Container,
  Typography,
  LinearProgress,
  Paper,
  Box,
  CardMedia,
  Card,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  Avatar,
} from "@mui/material";

function TeamPage() {
  const { teamCode } = useParams();
  const [currentRoster, setCurrentRoster] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(50);
  const [teamImage, setTeamImage] = useState();
  const [teamName, setTeamName] = useState("");
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [tradeblock, setTradeblock] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const [lineup, setLineup] = useState({});

  useEffect(() => {
    fetch(`/nhl/roster/${teamCode}`)
      .then((response) => response.json())
      .then((rosterData) => {
        setCurrentRoster(rosterData);
        setRating(rosterData.rating || 75);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching roster data: " + error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(`/nhl/roster/${teamCode}/prospects`)
      .then((response) => response.json())
      .then((data) => {
        setProspects(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching prospects data: " + error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(`/api/teams/${teamCode}`)
      .then((response) => response.json())
      .then((data) => {
        setTeamImage(data.logo);
        setTeamName(data.city + " " + data.name);
        setStrengths(data.strengths || []);
        setWeaknesses(data.weaknesses || []);
        setTradeblock(data.tradeblock || []);
        setLineup(data.lineup || lineup);
        setContracts(data.contracts || []);
      })
      .catch((error) => {
        setError("Error fetching team data: " + error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(`/api/teams/${teamCode}/lineup`)
      .then((response) => response.json())
      .then((lineup) => {
        setLineup(lineup);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching lineup data: " + error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Fetch data from the API
    fetch(`/api/rumors`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Filter players by currentTeamAbbrev
        const filteredPlayers = data.filter(
          (player) => player.currentTeamAbbrev === teamCode
        );
        setTradeblock(filteredPlayers);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching rumors data:", error);
        setError("Error fetching rumors data.");
        setLoading(false);
      });
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    // If there's no destination (dropped outside the list), do nothing
    if (!destination) return;

    // Reorder only within the same droppable
    if (type === "COLUMN") {
      // Handle reordering for forwards and defensemen sections
      if (source.droppableId !== destination.droppableId) return; // Can only reorder within the same section

      const startIndex = source.index;
      const endIndex = destination.index;

      // Update the lineup based on the source and destination
      const updatedLineup = { ...lineup };
      const section = updatedLineup[source.droppableId];

      const [movedPlayer] = section.players.splice(startIndex, 1);
      section.players.splice(endIndex, 0, movedPlayer);

      // Call your function to update the state or data source here
      updateLineup(updatedLineup);
    }
  };

  // Example of how to use the `updateLineup` function
  const updateLineup = (updatedLineup) => {
    // Update the state or backend with the new lineup
    console.log("Updated Lineup:", updatedLineup);
  };

  const [draftPicks, setDraftPicks] = useState({
    2025: [false, true, false, true, true, true, true], // 1st and 3rd picks are not available
    2026: [true, false, true, true, false, true, true], // 2nd and 5th picks are not available
    2027: [true, true, true, true, true, true, true], // All picks are available
  });

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
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Team Name */}
        <Grid item xs={12} md={8}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {teamName}
          </Typography>
        </Grid>

        {/* Team Image */}
        <Grid item xs={12} md={4} container justifyContent="flex-end">
          {teamImage && (
            <Card elevation={4} sx={{ maxWidth: 200 }}>
              <CardMedia
                component="img"
                image={teamImage}
                alt={`Image of ${teamCode}`}
                sx={{ width: "100%", height: "auto", objectFit: "contain" }}
              />
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="team pages"
        >
          <Tab label="Current Roster" />
          <Tab label="Prospects" />
          <Tab label="Lineup" />
          <Tab label="Strengths & Weaknesses" />
          <Tab label="Trade Block" />
          <Tab label="Contracts" />
          <Tab label="Draft Picks" />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
        <>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {/* Display the PlayerTable for players */}
          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom>
              Current Roster
            </Typography>
            <PlayerTable players={currentRoster} />
          </Box>
        </>
      )}

      {tabIndex === 1 && (
        <>
          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom>
              Prospects
            </Typography>
            <PlayerTable players={prospects} />
          </Box>
        </>
      )}

      {tabIndex === 2 && (
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Lineup
          </Typography>
          <Lineup lineup={lineup} onDragEnd={onDragEnd} />
        </Box>
      )}

      {tabIndex === 3 && (
        <Grid container spacing={3}>
          {/* Team Rating on its own row */}
          <Grid item xs={12}>
            <Box sx={{ my: 4 }}>
              <Typography variant="h6" gutterBottom>
                Team Rating
              </Typography>
              <Paper
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "150px",
                }}
              >
                <Typography variant="h4" gutterBottom>
                  {rating}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={rating}
                  sx={{
                    width: "100%",
                    height: 8,
                    borderRadius: 5,
                    mt: 2,
                  }}
                />
              </Paper>
            </Box>
          </Grid>

          {/* Strengths and Weaknesses on the same row */}
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Strengths
                </Typography>
                <List>
                  {strengths.map((strength, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={strength} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Weaknesses
                </Typography>
                <List>
                  {weaknesses.map((weakness, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={weakness} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      )}

      {tabIndex === 4 && (
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Trade Block
          </Typography>
          <TradeBlock tradeblock={tradeblock} teamImage={teamImage} />
        </Box>
      )}

      {tabIndex === 5 && (
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Contracts
          </Typography>
          <Paper sx={{ p: 2 }}>
            <List>
              {contracts.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      )}

      {tabIndex === 6 && (
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom>
            Draft Picks
          </Typography>
          <Grid container spacing={4}>
            {Object.entries(draftPicks).map(([year, rounds]) => (
              <Grid item xs={12} key={year}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: "background.paper",
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    {year} Draft Picks
                  </Typography>
                  <Grid container spacing={2}>
                    {rounds.map((hasPick, index) => (
                      <Grid item key={index} sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 1, // margin-bottom: 1 (theme spacing)
                            color: hasPick ? "text.primary" : "text.secondary",
                          }}
                        >
                          Round {index + 1}
                        </Typography>
                        <Avatar
                          sx={{
                            bgcolor: hasPick ? "primary.main" : "grey.400",
                            width: 64,
                            height: 64,
                            border: `2px solid ${
                              hasPick ? "primary.dark" : "grey.500"
                            }`,
                            "& img": {
                              objectFit: "contain",
                            },
                          }}
                          src={hasPick ? teamImage : null}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default TeamPage;
