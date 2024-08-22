import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import SportsHockeyIcon from "@mui/icons-material/SportsHockey";
import { CssBaseline, Container } from "@mui/material";

function NavBar() {
  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Container>
          <Toolbar disableGutters>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            >
              <MenuIcon />
            </IconButton>
            <SportsHockeyIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              color="inherit"
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                color: "inherit",
                flexGrow: 1,
                fontWeight: 600,
              }}
            >
              Trade Friendly
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/teams">
                Teams
              </Button>
              <Button color="inherit" component={Link} to="/tradeSimulator">
                Trade Simulator
              </Button>
              <Button color="inherit" component={Link} to="/fantasyPool">
                Fantasy Pool
              </Button>
              <Button color="inherit" component={Link} to="/draftTracker">
                Draft Tracker
              </Button>
              <Button color="inherit" component={Link} to="/players">
                Players
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default NavBar;
