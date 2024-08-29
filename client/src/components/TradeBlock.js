import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  Avatar,
  CardActionArea,
  IconButton,
} from "@mui/material";

function TradeBlock({ tradeblock, teamImage }) {
  const [teamsData, setTeamsData] = useState([]);
  const [teamNameMap, setTeamNameMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const getTeamLogo = (teamId) => {
    const team = teamsData.find((t) => t._id === teamId);
    return team ? team.logo : "";
  };

  return (
    <Grid container spacing={4}>
      {tradeblock.map((rumor) => (
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
                  src={teamImage}
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
                      <IconButton sx={{ p: 0, mr: 1 }}>
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
  );
}
export default TradeBlock;
