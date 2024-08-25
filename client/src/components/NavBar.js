import React, { useState } from "react";
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import SportsHockeyIcon from "@mui/icons-material/SportsHockey";
import { CssBaseline, Container, Menu, MenuItem } from "@mui/material";
import { CssBaseline, Container, Menu, MenuItem } from "@mui/material";

function NavBar() {
  // State for Tool menu
  const [toolAnchorEl, setToolAnchorEl] = useState(null);
  const isToolMenuOpen = Boolean(toolAnchorEl);

  // State for Admin menu
  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const isAdminMenuOpen = Boolean(adminAnchorEl);

  const handleToolMenuClick = (event) => {
    setToolAnchorEl(event.currentTarget);
  };

  const handleAdminMenuClick = (event) => {
    setAdminAnchorEl(event.currentTarget);
  };

  const handleToolMenuClose = () => {
    setToolAnchorEl(null);
  };

  const handleAdminMenuClose = () => {
    setAdminAnchorEl(null);
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Container>
          <Toolbar disableGutters>
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
              <Button color="inherit" component={Link} to="/rumors">
                Rumors
              </Button>
              <Button color="inherit" component={Link} to="/draftTracker">
                Draft Tracker
              </Button>

              {/* Tool Menu */}
              <Button
                color="inherit"
                onClick={handleToolMenuClick}
                aria-controls={isToolMenuOpen ? "tool-menu" : undefined}
                aria-haspopup="true"
              >
                Tool
              </Button>
              <Menu
                id="tool-menu"
                anchorEl={toolAnchorEl}
                open={isToolMenuOpen}
                onClose={handleToolMenuClose}
              >
                <MenuItem
                  component={Link}
                  to="/tradeSimulator"
                  onClick={handleToolMenuClose}
                >
                  Trade Simulator
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/fantasyPool"
                  onClick={handleToolMenuClose}
                >
                  Fantasy Pool
                </MenuItem>
              </Menu>

              {/* Admin Menu */}
              <Button
                color="inherit"
                onClick={handleAdminMenuClick}
                aria-controls={isAdminMenuOpen ? "admin-menu" : undefined}
                aria-haspopup="true"
              >
                Admin
              </Button>
              <Menu
                id="admin-menu"
                anchorEl={adminAnchorEl}
                open={isAdminMenuOpen}
                onClose={handleAdminMenuClose}
              >
                <MenuItem
                  component={Link}
                  to="/admin/rumors"
                  onClick={handleAdminMenuClose}
                >
                  Rumors
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/players"
                  onClick={handleAdminMenuClose}
                >
                  Players
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default NavBar;
