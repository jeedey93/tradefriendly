import React from 'react';
import PlayerCard from './PlayerCard';

function PlayerList({ players }) {
    return (
        <div className="player-list">
            {players.map((player, index) => (
                <PlayerCard key={index} player={player} />
            ))}
        </div>
    );
}

export default PlayerList;