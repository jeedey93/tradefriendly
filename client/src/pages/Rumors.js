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
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
} from "@mui/material";
import { Link as LinkIcon, Info as InfoIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import FilterBar from "../components/FilterBar";

function Rumors() {
  const [initialRumors, setRumors] = useState([]);
  const [filteredRumors, setFilteredRumors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamsData, setTeamsData] = useState([]);
  const [teamNameMap, setTeamNameMap] = useState({});
  const [selectedTradeReason, setSelectedTradeReason] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTeamLinks, setCurrentTeamLinks] = useState([]);

  useEffect(() => {
    fetch("/api/teams")
      .then((response) => response.json())
      .then((data) => {
        data.sort((a, b) => a.city.localeCompare(b.city));
        setTeamsData(data);
        const map = data.reduce((acc, team) => {
          acc[team._id] = team.name;
          return acc;
        }, {});
        setTeamNameMap(map);
      })
      .catch((error) => {
        console.error("Error fetching teams data:", error);
        setError("Error fetching teams data.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(`/api/rumors`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setRumors(data);
        setFilteredRumors(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching rumors data:", error);
        setError("Error fetching rumors data.");
        setLoading(false);
      });
  }, []);

  const tradeReasons = Array.from(
    new Set(initialRumors.map((r) => r.tradeReason))
  );
  const teams = Array.from(
    new Set(initialRumors.flatMap((r) => r.rumoredTeams.map((t) => t.teamId)))
  ).map((teamId) => teamNameMap[teamId]);

  useEffect(() => {
    filterRumors(selectedTradeReason, selectedTeam);
  }, [selectedTradeReason, selectedTeam]);

  const handleTradeReasonChange = (event) => {
    setSelectedTradeReason(event.target.value);
  };

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
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
    if (/^(?:[a-z]+:)?\/\//i.test(url)) {
      return url;
    }
    return new URL(url, window.location.origin).href;
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
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: "#aa2e25",
                        bgcolor: "background.default",
                        padding: 1,
                        borderRadius: 1,
                        mb: 2,
                      }}
                    >
                      Trade Reason: {rumor.tradeReason}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: "#357a38",
                        bgcolor: "background.default",
                        padding: 1,
                        borderRadius: 1,
                        mb: 2,
                      }}
                    >
                      Trade Value: {rumor.tradeValue}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6">Rumored Teams</Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {rumor.rumoredTeams.map((team) => (
                          <Box
                            key={team.teamId}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Avatar
                              src={getTeamLogo(team.teamId)}
                              sx={{
                                width: 56,
                                height: 56,
                                objectFit: "cover",
                                mr: 1,
                              }}
                              onClick={() => handleAvatarClick(team.links)}
                            />
                            <Typography variant="body2" sx={{ mr: 1 }}>
                              {teamNameMap[team.teamId]} - {team.chance}%
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
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <InfoIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Sources</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            sx={{ ml: "auto" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <List>
            {currentTeamLinks.map((link, index) => (
              <ListItem key={index} sx={{ padding: 1 }}>
                <ListItemIcon>
                  <LinkIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      component="a"
                      href={convertToAbsoluteUrl(link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body1"
                      sx={{ textDecoration: "none", color: "primary.main" }}
                    >
                      {link.title}
                    </Typography>
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
