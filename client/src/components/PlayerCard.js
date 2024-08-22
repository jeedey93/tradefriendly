import React from 'react';

function PlayerCard({ player }) {
    return (
        <div className="player-card">
            <img 
                src={player.headshot} 
                alt={`${player.firstName} ${player.lastName}`} 
                className="player-headshot" 
            />
            <div className="player-details">
                <h2>{player.firstName} {player.lastName}</h2>
                <p><strong>ID:</strong> {player.id}</p>
                <p><strong>Position:</strong> {player.positionCode}</p>
            </div>
        </div>
    );
}

export default PlayerCard;