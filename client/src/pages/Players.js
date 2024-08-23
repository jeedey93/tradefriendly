import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
  Container,
  Pagination,
} from "@mui/material";

function Players() {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const fetchDatabasePlayers = () => {
    setLoading(true);
    fetch(`/api/players`)
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching players data: " + error.message);
        setLoading(false);
      });
  };

  const fetchApiPlayers = () => {
    setLoading(true);
    fetch(`/nhl/stats`)
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching players data: " + error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDatabasePlayers();
  }, []);

  const handleChange = (id, field, value) => {
    const parsedValue =
      field === "capHit" ? parseFloat(value) : parseInt(value, 10);

    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === id
          ? {
              ...player,
              [field]: isNaN(parsedValue) ? player[field] : parsedValue,
            }
          : player
      )
    );
  };

  const handleSave = () => {
    const updatedPlayers = players.map(({ id, ...rest }) => ({ id, ...rest }));

    // Save data to the server
    fetch("/api/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPlayers),
    })
      .then(() => {
        setSnackbarMessage("Players saved successfully!");
        setOpenSnackbar(true); // Show success message
      })
      .catch((error) => {
        setError("Error saving players data: " + error.message);
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleRefresh = () => {
    fetchApiPlayers();
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" variant="h6" align="center" mt={2}>
        {error}
      </Typography>
    );

  // Calculate the data to display based on pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlayers = players.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(players.length / itemsPerPage);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4" gutterBottom>
            Player List
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleRefresh}>
            Refresh
          </Button>
        </Box>
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Points</TableCell>
                <TableCell align="right">Overall Score</TableCell>
                <TableCell align="right">Cap Hit</TableCell>
                <TableCell align="right">Number Of Years Left</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPlayers.map((player, index) => (
                <TableRow key={player.id} hover>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell align="right">{player.points}</TableCell>
                  <TableCell align="right">{player.overallScore}</TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      value={player.capHit || "0"}
                      onChange={(e) =>
                        handleChange(player.id, "capHit", e.target.value)
                      }
                      size="small"
                      inputProps={{ step: "0.1", min: 0 }}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      value={player.yearsLeft || ""}
                      onChange={(e) =>
                        handleChange(player.id, "yearsLeft", e.target.value)
                      }
                      size="small"
                      inputProps={{ step: "1", min: 0 }}
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Container>
      <Box
        component="footer"
        position="sticky"
        bottom={0}
        bgcolor="background.paper"
        py={2}
        boxShadow={3}
      >
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              size="large"
            >
              Save Changes
            </Button>
          </Box>
        </Container>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Players;
