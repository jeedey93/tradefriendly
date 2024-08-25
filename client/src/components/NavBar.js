import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CssBaseline,
} from "@mui/material";
import { Link } from "react-router-dom";
import SportsHockeyIcon from "@mui/icons-material/SportsHockey";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DraftsIcon from "@mui/icons-material/Drafts";
import SettingsIcon from "@mui/icons-material/Settings";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

function NavBar() {
  const [toolAnchorEl, setToolAnchorEl] = useState(null);
  const isToolMenuOpen = Boolean(toolAnchorEl);

  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const isAdminMenuOpen = Boolean(adminAnchorEl);

  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(45deg, #3f51b5, #1a237e)",
          boxShadow: 3,
        }}
      >
        <Container>
          <Toolbar disableGutters>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: { xs: "flex", md: "none" } }}
              onClick={toggleDrawer}
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
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
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
              <Button color="inherit" onClick={handleToolMenuClick}>
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
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Trade Simulator" />
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/fantasyPool"
                  onClick={handleToolMenuClose}
                >
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Fantasy Pool" />
                </MenuItem>
              </Menu>
              <Button color="inherit" onClick={handleAdminMenuClick}>
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
                  <ListItemIcon>
                    <AdminPanelSettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Rumors" />
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/players"
                  onClick={handleAdminMenuClose}
                >
                  <ListItemIcon>
                    <AdminPanelSettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Players" />
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer for Mobile View */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          <List>
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/teams">
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Teams" />
            </ListItem>
            <ListItem button component={Link} to="/rumors">
              <ListItemIcon>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary="Rumors" />
            </ListItem>
            <ListItem button component={Link} to="/draftTracker">
              <ListItemIcon>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText primary="Draft Tracker" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={handleToolMenuClick}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Tool" />
            </ListItem>
            <ListItem button onClick={handleAdminMenuClick}>
              <ListItemIcon>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Admin" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default NavBar;
