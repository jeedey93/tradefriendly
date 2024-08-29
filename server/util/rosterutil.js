import fetch from "node-fetch";

const getRosterData = async (teamCode) => {
  const rosterUrl = `https://api-web.nhle.com/v1/roster/${teamCode}/current`;
  const prospectsUrl = `https://api-web.nhle.com/v1/prospects/${teamCode}`;

  const [rosterResponse, prospectsResponse] = await Promise.all([
    fetch(rosterUrl),
    fetch(prospectsUrl),
  ]);

  const rosterData = await rosterResponse.json();
  const prospectsData = await prospectsResponse.json();

  const rosterPlayers = extractPlayerData(rosterData.forwards)
    .concat(extractPlayerData(rosterData.defensemen))
    .concat(extractPlayerData(rosterData.goalies));

  const prospectsPlayers = extractPlayerData(prospectsData.forwards)
    .concat(extractPlayerData(prospectsData.defensemen))
    .concat(extractPlayerData(prospectsData.goalies));

  const currentRoster = rosterPlayers.filter(
    (player) => !prospectsPlayers.some((prospect) => prospect.id === player.id)
  );

  return currentRoster;
};

function extractPlayerData(players) {
  return players.map((player) => ({
    id: player.id,
    headshot: player.headshot,
    firstName: player.firstName.default,
    lastName: player.lastName.default,
    sweaterNumber: player.sweaterNumber,
    positionCode:
      player.positionCode === "R"
        ? "RW"
        : player.positionCode === "L"
        ? "LW"
        : player.positionCode,
    shootsCatches: player.shootsCatches,
    heightInCentimeters: player.heightInCentimeters,
    weightInPounds: player.weightInPounds,
    birthCountry: player.birthCountry,
  }));
}

export default getRosterData;
