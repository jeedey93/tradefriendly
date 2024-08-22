import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Button,
  Card,
  CardContent,
  IconButton,
  styled,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const TeamLogo = styled("img")(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: 4,
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(1),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(0.5),
}));

const EmptyRow = styled(TableRow)(({ theme }) => ({
  height: 36,
}));

const ValueBar = styled(Box)(({ theme, value }) => ({
  height: 8,
  width: `${value}%`,
  backgroundColor:
    value > 0 ? theme.palette.primary.main : theme.palette.grey[300],
  borderRadius: theme.shape.borderRadius,
  minWidth: "40px",
}));

const TradeSimulator = ({ teamsInfo }) => {
  const [leftTeam, setLeftTeam] = useState("");
  const [rightTeam, setRightTeam] = useState("");
  const [leftTeamPlayers, setLeftTeamPlayers] = useState([]);
  const [rightTeamPlayers, setRightTeamPlayers] = useState([]);
  const [leftSelectedPlayers, setLeftSelectedPlayers] = useState([]);
  const [rightSelectedPlayers, setRightSelectedPlayers] = useState([]);
  const [loadingLeft, setLoadingLeft] = useState(false);
  const [loadingRight, setLoadingRight] = useState(false);
  const [errorLeft, setErrorLeft] = useState(null);
  const [errorRight, setErrorRight] = useState(null);
  const [winner, setWinner] = useState("");

  const teamLogoMap = teamsInfo.reduce((map, team) => {
    map[team.abbreviation] = team.logo;
    return map;
  }, {});

  const teams = Object.keys(teamLogoMap).sort();

  const fetchPlayers = async (team, setPlayers, setLoading, setError) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/nhl/roster/${team}`);
      if (!response.ok) {
        throw new Error("Failed to fetch players");
      }
      const players = await response.json();
      setPlayers(players);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (leftTeam) {
      fetchPlayers(leftTeam, setLeftTeamPlayers, setLoadingLeft, setErrorLeft);
      setLeftSelectedPlayers([]);
    }
  }, [leftTeam]);

  useEffect(() => {
    if (rightTeam) {
      fetchPlayers(
        rightTeam,
        setRightTeamPlayers,
        setLoadingRight,
        setErrorRight
      );
      setRightSelectedPlayers([]);
    }
  }, [rightTeam]);

  useEffect(() => {
    // Calculate values and determine winner
    const leftTeamValue = calculateTeamValue(leftSelectedPlayers);
    const rightTeamValue = calculateTeamValue(rightSelectedPlayers);

    setWinner(
      leftTeamValue > rightTeamValue
        ? leftTeam
        : rightTeamValue > leftTeamValue
        ? rightTeam
        : "Draw"
    );
  }, [leftSelectedPlayers, rightSelectedPlayers, leftTeam, rightTeam]);

  const addPlayerToSelected = (player, setSelectedPlayers, selectedPlayers) => {
    if (!selectedPlayers.some((p) => p.id === player.id)) {
      setSelectedPlayers((prevSelected) => [...prevSelected, player]);
    }
  };

  const removePlayerFromSelected = (player, setSelectedPlayers) => {
    setSelectedPlayers((prevSelected) =>
      prevSelected.filter((p) => p.id !== player.id)
    );
  };

  const renderPlayerTable = (players, onAdd, onRemove, selectedPlayers) => (
    <TableContainer component={Paper} sx={{ mt: 1 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell>
                {player.firstName} {player.lastName}
              </TableCell>
              <TableCell>
                {onAdd ? (
                  <ActionButton
                    variant="contained"
                    size="small"
                    onClick={() => onAdd(player)}
                    disabled={selectedPlayers.some((p) => p.id === player.id)}
                  >
                    Add
                  </ActionButton>
                ) : (
                  <ActionButton
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={() => onRemove(player)}
                  >
                    Remove
                  </ActionButton>
                )}
              </TableCell>
            </TableRow>
          ))}
          {players.length < 5 &&
            Array.from({ length: 5 - players.length }).map((_, index) => (
              <EmptyRow key={`empty-${index}`}>
                <TableCell colSpan={2}></TableCell>
              </EmptyRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const calculateTeamValue = (selectedPlayers) => {
    return selectedPlayers.length * 20;
  };

  const leftTeamValue = calculateTeamValue(leftSelectedPlayers);
  const rightTeamValue = calculateTeamValue(rightSelectedPlayers);

  const leftTeamValuePercentage = leftTeamValue;
  const rightTeamValuePercentage = rightTeamValue;

  return (
    <Container>
      <Box mb={2} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Trade Simulator
        </Typography>
        <Box mb={1}>
          <Typography variant="subtitle1">Trade Winner:</Typography>
          <Typography variant="h5" color="primary">
            {winner || "No trade evaluated yet"}
          </Typography>
        </Box>
      </Box>

      <Box mb={2}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={5} container direction="column" alignItems="center">
            <Box>
              <ValueBar value={leftTeamValuePercentage} />
              <Typography variant="caption" align="center">
                Value: {leftTeamValue}
              </Typography>
            </Box>
          </Grid>

          <Grid
            item
            xs={2}
            container
            justifyContent="center"
            alignItems="center"
          >
            <IconButton aria-label="move-left">
              <ArrowBackIcon />
            </IconButton>
            <IconButton aria-label="move-right">
              <ArrowForwardIcon />
            </IconButton>
          </Grid>

          <Grid item xs={5} container direction="column" alignItems="center">
            <Box>
              <ValueBar value={rightTeamValuePercentage} />
              <Typography variant="caption" align="center">
                Value: {rightTeamValue}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={5}>
          <Card sx={{ p: 1 }}>
            <CardContent>
              <Box mb={1} textAlign="center">
                <Typography variant="subtitle1">Team #1</Typography>
                {leftTeam && (
                  <TeamLogo
                    src={teamLogoMap[leftTeam]}
                    alt={`${leftTeam} logo`}
                  />
                )}
              </Box>
              <FormControl fullWidth>
                <InputLabel id="left-team-select-label">Select Team</InputLabel>
                <Select
                  labelId="left-team-select-label"
                  value={leftTeam}
                  onChange={(e) => setLeftTeam(e.target.value)}
                  label="Select Team"
                >
                  {teams.map((team) => (
                    <MenuItem key={team} value={team}>
                      {team}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box mt={1}>
                <Typography variant="subtitle1">Selected Players</Typography>
                {renderPlayerTable(leftSelectedPlayers, null, (player) =>
                  removePlayerFromSelected(player, setLeftSelectedPlayers)
                )}
              </Box>

              <Box mt={1}>
                <Typography variant="subtitle1">Available Players</Typography>
                {loadingLeft ? (
                  <CircularProgress />
                ) : errorLeft ? (
                  <Alert severity="error">{errorLeft}</Alert>
                ) : (
                  renderPlayerTable(
                    leftTeamPlayers,
                    (player) =>
                      addPlayerToSelected(
                        player,
                        setLeftSelectedPlayers,
                        leftSelectedPlayers
                      ),
                    null,
                    leftSelectedPlayers
                  )
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card sx={{ p: 1 }}>
            <CardContent>
              <Box mb={1} textAlign="center">
                <Typography variant="subtitle1">Team #2</Typography>
                {rightTeam && (
                  <TeamLogo
                    src={teamLogoMap[rightTeam]}
                    alt={`${rightTeam} logo`}
                  />
                )}
              </Box>
              <FormControl fullWidth>
                <InputLabel id="right-team-select-label">
                  Select Team
                </InputLabel>
                <Select
                  labelId="right-team-select-label"
                  value={rightTeam}
                  onChange={(e) => setRightTeam(e.target.value)}
                  label="Select Team"
                >
                  {teams.map((team) => (
                    <MenuItem key={team} value={team}>
                      {team}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box mt={1}>
                <Typography variant="subtitle1">Selected Players</Typography>
                {renderPlayerTable(rightSelectedPlayers, null, (player) =>
                  removePlayerFromSelected(player, setRightSelectedPlayers)
                )}
              </Box>

              <Box mt={1}>
                <Typography variant="subtitle1">Available Players</Typography>
                {loadingRight ? (
                  <CircularProgress />
                ) : errorRight ? (
                  <Alert severity="error">{errorRight}</Alert>
                ) : (
                  renderPlayerTable(
                    rightTeamPlayers,
                    (player) =>
                      addPlayerToSelected(
                        player,
                        setRightSelectedPlayers,
                        rightSelectedPlayers
                      ),
                    null,
                    rightSelectedPlayers
                  )
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TradeSimulator;
