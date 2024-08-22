import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Teams from "./pages/Teams";
import Players from "./pages/Players";
import TeamPage from "./pages/TeamPage";
import PlayerPage from "./pages/PlayerPage";
import TradeSimulator from "./pages/TradeSimulator";
import FantasyPool from "./pages/FantasyPool";
import DraftTracker from "./pages/DraftTracker";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NavBar from "./components/NavBar";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          //backgroundImage: `url('https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          margin: 0,
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Router>
          <NavBar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/tradeSimulator" element={<TradeSimulator />} />
            <Route path="/fantasyPool" element={<FantasyPool />} />
            <Route path="/draftTracker" element={<DraftTracker />} />
            <Route path="/players" element={<Players />} />
            {/* Dynamic route */}
            <Route path="/teams/:teamCode" element={<TeamPage />} />{" "}
            <Route path="/players/:playerCode" element={<PlayerPage />} />{" "}
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
