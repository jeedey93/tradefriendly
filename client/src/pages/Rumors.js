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
  const [selectedTradeBlock, setSelectedTradeBlock] = useState("");
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

  const tradeBlocks = Array.from(
    new Set(initialRumors.flatMap((r) => r.currentTeamAbbrev))
  );

  useEffect(() => {
    filterRumors(selectedTradeReason, selectedTeam, selectedTradeBlock);
  }, [selectedTradeReason, selectedTeam, selectedTradeBlock]);

  const handleTradeReasonChange = (event) => {
    setSelectedTradeReason(event.target.value);
  };

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const handleTradeBlockChange = (event) => {
    setSelectedTradeBlock(event.target.value);
  };

  const filterRumors = (tradeReason, team, tradeBlock) => {
    let filtered = initialRumors;

    if (tradeReason) {
      filtered = filtered.filter((r) => r.tradeReason === tradeReason);
    }

    if (team) {
      filtered = filtered.filter((r) =>
        r.rumoredTeams.some((t) => teamNameMap[t.teamId] === team)
      );
    }

    if (tradeBlock) {
      filtered = filtered.filter((r) => r.currentTeamAbbrev === tradeBlock);
    }

    setFilteredRumors(filtered);
  };

  const handleAvatarClick = (team) => {
    const teamLinks = team.links;
    setCurrentTeamLinks([
      { teamName: teamNameMap[team.teamId], links: teamLinks },
    ]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getTeamLogo = (teamId) => {
    const team = teamsData.find((t) => t._id === teamId);
    return team ? team.logo : "";
  };

  const getTeamLogoFromTeamAbbrev = (teamAbbrev) => {
    const team = teamsData.find((t) => t.abbreviation === teamAbbrev);
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
          tradeBlocks={tradeBlocks}
          selectedTradeBlock={selectedTradeBlock}
          selectedTradeReason={selectedTradeReason}
          selectedTeam={selectedTeam}
          onTradeReasonChange={handleTradeReasonChange}
          onTeamChange={handleTeamChange}
          onTradeBlockChange={handleTradeBlockChange}
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
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={rumor.playerImage}
                      alt={rumor.playerName}
                      sx={{ objectFit: "contain" }}
                    />
                    <Avatar
                      src={getTeamLogoFromTeamAbbrev(rumor.currentTeamAbbrev)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        width: 56,
                        height: 56,
                        opacity: 1,
                      }}
                    />
                  </Box>
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
                      {rumor.rumoredTeams.map((team) => (
                        <Box
                          key={team.teamId}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <IconButton
                            onClick={() => handleAvatarClick(team)}
                            sx={{ p: 0, mr: 1 }}
                          >
                            <Avatar
                              src={getTeamLogo(team.teamId)}
                              alt={teamNameMap[team.teamId]}
                              sx={{ width: 40, height: 40 }}
                            />
                          </IconButton>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "bold",
                              color: "text.primary",
                              fontSize: "1rem",
                            }}
                          >
                            {team.chance}%
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          sx={{ minWidth: "500px" }}
        >
          <DialogTitle>
            Team Links
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseDialog}
              aria-label="close"
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <List>
              {currentTeamLinks.map((team, teamIndex) =>
                team.links.map((link, index) => (
                  <React.Fragment key={`${teamIndex}-${index}`}>
                    <ListItem
                      button
                      component="a"
                      href={convertToAbsoluteUrl(link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ListItemIcon>
                        <LinkIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${link.title} - Link ${index + 1}`}
                      />
                    </ListItem>
                    {index < team.links.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              )}
            </List>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}

export default Rumors;
