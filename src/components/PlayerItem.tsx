import React, { useState } from 'react';
import { Player } from '../models';
import { PlayerModal } from './PlayerModal';
import { usePlayersStore, useTimerStore } from '../store';
import { formatDuration } from '../utils';

interface PlayerItemProps {
  index: number;
  player: Player;
}

export function PlayerItem({ index, player }: PlayerItemProps) {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const { updatePlayerColor, updatePlayerName, remPlayer } = usePlayersStore();
  const { running, paused, currentPlayer, at, results, playerToggle, showPlayerTimes } = useTimerStore();

  const isGrid = usePlayersStore(state => {
    const count = state.players.length;
    return count > 3 && count !== 5 && count !== 7;
  });

  const isPolygonal = usePlayersStore(state => {
    const count = state.players.length;
    return count === 5 || count === 7;
  });

  const selected = running && !paused && currentPlayer === index;
  const inactive = running && !paused && currentPlayer !== index;

  const onEditConfirm = (name: string, color: string) => {
    const suffix =
      name.toLowerCase() === 'butt' || name.toLowerCase() === 'murilo'
        ? ' Gay'
        : '';
    updatePlayerName(index, `${name}${suffix}`);
    updatePlayerColor(index, color);
  };

  const onPlayerPress = () => {
    if (!running || paused) {
      setModalIsVisible(true);
      return;
    }
    playerToggle(index);
  };

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    remPlayer(index);
  };

  const currentTime = results[index] ?? 0;
  const [displayTime, setDisplayTime] = useState(currentTime);

  React.useEffect(() => {
    if (!selected) {
      setDisplayTime(currentTime);
      return;
    }

    const interval = setInterval(() => {
      setDisplayTime(currentTime + Date.now());
    }, 100);

    return () => clearInterval(interval);
  }, [selected, currentTime, at]);

  const nameLength = player.name.length;
  const fontSizeClass = nameLength > 15
    ? 'text-lg'
    : nameLength > 10
      ? 'text-xl'
      : 'text-2xl';

  const listFontSizeClass = nameLength > 15
    ? 'text-2xl'
    : nameLength > 10
      ? 'text-3xl'
      : 'text-4xl';

  const currentFontSizeClass = (isGrid || isPolygonal) ? fontSizeClass : listFontSizeClass;

  return (
    <div
      onClick={onPlayerPress}
      onContextMenu={onContextMenu}
      className={`flex-1 p-5 flex items-center justify-center relative cursor-pointer select-none overflow-hidden transition-all duration-200 ${
        selected ? 'ring-inset ring-8 ring-white/30 z-[4]' : ''
      } ${inactive ? 'opacity-40' : 'opacity-100'}`}
      style={{
        backgroundColor: player.color,
      }}
    >
      <PlayerModal
        isVisible={modalIsVisible}
        onClose={() => setModalIsVisible(false)}
        onConfirm={onEditConfirm}
        onDelete={() => remPlayer(index)}
        initialName={player.name}
        initialColor={player.color}
        title="Edit Player"
        confirmLabel="Save"
      />

      <div className={`flex ${(isGrid || isPolygonal) ? 'flex-col' : 'flex-col sm:flex-row'} items-center justify-center gap-2 sm:gap-x-12 z-[3] text-center`}>
        <div className="flex-none flex justify-center overflow-hidden">
          <span
            className={`${currentFontSizeClass} break-words overflow-hidden text-ellipsis ${player.color === '#e5e5e5' ? 'text-black' : 'text-white'}`}
            style={{
              whiteSpace: 'normal',
            }}
          >
            {player.name}
          </span>
        </div>
        {(!running || showPlayerTimes) && (
          <div className="flex-none flex justify-center">
            <span
              className={`${currentFontSizeClass} ${player.color === '#e5e5e5' ? 'text-black' : 'text-white'}`}
            >
              {formatDuration(displayTime)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
