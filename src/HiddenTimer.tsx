import React, { useState } from 'react';
import { ButtonIcon } from './components/ButtonIcon';
import { MAX_PLAYERS, UI_COLORS } from './consts';
import { usePlayersStore, useTimerStore } from './store';
import PlayersList from './components/PlayersList';
import { Timer } from './components/Timer';
import { PlayerModal } from './components/PlayerModal';

export function HiddenTimer() {
  const { players, addPlayer, reset: resetPlayers } = usePlayersStore();
  const { running, paused, start, stop, pause, unpause, reset: resetTimer, showPlayerTimes, toggleShowPlayerTimes } = useTimerStore();
  const [playerModalVisible, setPlayerModalVisible] = useState(false);

  const onReset = () => {
    resetPlayers();
    resetTimer();
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      <PlayerModal
        isVisible={playerModalVisible}
        onClose={() => setPlayerModalVisible(false)}
        onConfirm={addPlayer}
        title="Add Player"
        confirmLabel="Add"
      />
      <div className="flex-1 flex flex-col min-h-0">
        <PlayersList />
      </div>

      <div className="p-[10px] flex flex-col items-center justify-center">
        <Timer />
      </div>

      <div className="flex flex-row gap-[40px] pb-[20px] pt-[10px] items-center justify-center">
        {running ? (
          <>
            <ButtonIcon
              name={paused ? 'play' : 'pause'}
              onPress={paused ? unpause : pause}
            />
            <ButtonIcon 
              name="stop" 
              onPress={() => {
                if (window.confirm('Are you sure you want to stop the game?')) {
                  stop();
                }
              }} 
            />
          </>
        ) : (
          <>
            <ButtonIcon
              name={showPlayerTimes ? 'eye' : 'eyeOff'}
              onPress={toggleShowPlayerTimes}
            />
            <ButtonIcon
              name="refresh"
              onPress={onReset}
              disabled={!players.length}
            />
            <ButtonIcon
              name="play"
              onPress={start}
              disabled={!players.length}
            />
            <ButtonIcon
              name="add"
              onPress={() => setPlayerModalVisible(true)}
              disabled={players.length >= MAX_PLAYERS}
            />
          </>
        )}
      </div>
    </div>
  );
}
