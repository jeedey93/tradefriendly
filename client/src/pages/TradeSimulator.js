import React, { useEffect, useState } from "react";
import Trade from "../components/TradeSimulator";

function TradeSimulator() {
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/teams`)
      .then((response) => response.json())
      .then((data) => {
        setTeams(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching player data: " + error.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Trade teamsInfo={teams} />
    </>
  );
}

export default TradeSimulator;
