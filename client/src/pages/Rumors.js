import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  CssBaseline,
  Avatar,
  CardActionArea,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import FilterBar from "../components/FilterBar"; // Import the FilterBar component

function Rumors() {
  const [initialRumors, setRumors] = useState([]);
  const [filteredRumors, setFilteredRumors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [teamsData, setTeamsData] = useState([]);
  const [teamNameMap, setTeamNameMap] = useState({}); // Map for teamId to team name

  useEffect(() => {
    // Fetch teams data
    fetch("/api/teams")
      .then((response) => response.json())
      .then((data) => {
        data.sort((a, b) => a.city.localeCompare(b.city));
        setTeamsData(data);
        // Create a map of teamId to team name
        const map = data.reduce((acc, team) => {
          acc[team._id] = team.name;
          return acc;
        }, {});
        setTeamNameMap(map);
      })
      .catch((error) => console.error("Error fetching teams data:", error));
  }, []);

  useEffect(() => {
    // Fetch rumors data
    fetch(`/api/rumors`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setRumors(data);
        setFilteredRumors(data); // Initialize filteredRumors with the fetched data
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching rumors data: " + error.message);
        setLoading(false);
      });
  }, []);

  // Extract unique values for trade reasons and teams
  const tradeReasons = Array.from(
    new Set(initialRumors.map((r) => r.tradeReason))
  );
  const teams = Array.from(
    new Set(initialRumors.flatMap((r) => r.rumoredTeams.map((t) => t.teamId)))
  ).map((teamId) => teamNameMap[teamId]);

  const [selectedTradeReason, setSelectedTradeReason] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTeamLinks, setCurrentTeamLinks] = useState([]);

  useEffect(() => {
    filterRumors(selectedTradeReason, selectedTeam);
  }, [selectedTradeReason, selectedTeam]);

  const handleTradeReasonChange = (event) => {
    const reason = event.target.value;
    setSelectedTradeReason(reason);
  };

  const handleTeamChange = (event) => {
    const team = event.target.value;
    setSelectedTeam(team);
  };

  const filterRumors = (tradeReason, team) => {
    let filtered = initialRumors;

    if (tradeReason) {
      filtered = filtered.filter((r) => r.tradeReason === tradeReason);
    }

    if (team) {
      filtered = filtered.filter((r) =>
        r.rumoredTeams.some((t) => teamNameMap[t.teamId] === team)
      );
    }

    setFilteredRumors(filtered);
  };

  const handleAvatarClick = (teamLinks) => {
    setCurrentTeamLinks(teamLinks);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getTeamLogo = (teamId) => {
    const team = teamsData.find((t) => t._id === teamId);
    return team ? team.logo : "";
  };

  const convertToAbsoluteUrl = (url) => {
    // Check if URL is already absolute
    if (/^(?:[a-z]+:)?\/\//i.test(url)) {
      return url;
    }
    // For relative URLs, just return as is
    return url;
  };

  if (loading) {
    return <Typography align="center">Loading...</Typography>;
  }

  if (error) {
    return (
      <Typography align="center" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.paper",
        color: "text.primary",
        pt: 4,
        pb: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Trade Rumors
        </Typography>

        <FilterBar
          tradeReasons={tradeReasons}
          teams={teams}
          selectedTradeReason={selectedTradeReason}
          selectedTeam={selectedTeam}
          onTradeReasonChange={handleTradeReasonChange}
          onTeamChange={handleTeamChange}
        />

        <Grid container spacing={4}>
          {filteredRumors.map((rumor) => (
            <Grid item xs={12} sm={6} md={4} key={rumor.id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={rumor.playerImage}
                    alt={rumor.playerName}
                    sx={{ objectFit: "contain" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {rumor.playerName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Trade Reason: {rumor.tradeReason}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6">Rumored Teams</Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {rumor.rumoredTeams.map((team) => (
                          <Box
                            key={team.teamId}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Tooltip
                              title={`Chance: ${team.chance}%`} // Display chance in tooltip
                              arrow
                            >
                              <IconButton
                                onClick={() => handleAvatarClick(team.links)}
                                sx={{ mr: 1 }}
                              >
                                <Avatar
                                  src={getTeamLogo(team.teamId)}
                                  sx={{
                                    width: 56,
                                    height: 56,
                                    objectFit: "cover",
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                            <Typography variant="body2">
                              {teamNameMap[team.teamId]}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Team Links</DialogTitle>
        <DialogContent>
          <List>
            {currentTeamLinks.map((link, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={
                    <a
                      href={convertToAbsoluteUrl(link)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link}
                    </a>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Rumors;
