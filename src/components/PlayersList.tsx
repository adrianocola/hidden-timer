import React from 'react';
import { usePlayersStore } from '../store';
import { PlayerItem } from './PlayerItem';

function PlayersList() {
  const { players } = usePlayersStore();

  const getLayoutClass = () => {
    const count = players.length;
    if (count <= 3) {
      return 'flex-col';
    }
    if (count === 4) {
      return 'grid-cols-2';
    }
    if (count <= 6) {
      return 'grid-cols-2';
    }
    if (count <= 8) {
      return 'grid-cols-2';
    }
    return 'grid-cols-3';
  };

  const totalItems = players.length;

  return (
    <div className={`flex-1 overflow-y-auto ${totalItems <= 3 ? 'flex flex-col' : 'grid ' + getLayoutClass()}`}>
      {players.map((player, index) => {
        const isLast = index === players.length - 1;
        const isOdd = totalItems % 2 !== 0;
        const isGrid2 = totalItems > 3 && totalItems <= 8;
        const colSpan = isLast && isOdd && isGrid2 ? 'col-span-2' : '';

        return (
          <div key={index} className={`${colSpan} flex flex-1`}>
            <PlayerItem index={index} player={player} />
          </div>
        );
      })}
    </div>
  );
}

export default PlayersList;
