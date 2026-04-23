import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware';

import {Player, TimerEvent} from './models';
import {randomPlayerColor} from './utils';

interface PlayersState {
  players: Player[];
  addPlayer: (name: string, color: string) => void;
  remPlayer: (index: number) => void;
  updatePlayerName: (index: number, name: string) => void;
  updatePlayerColor: (index: number, color: string) => void;
  reset: () => void;
}

export const usePlayersStore = create(persist<PlayersState>((set) => ({
  players: [],
  addPlayer: (name, color) => set((state) => ({
    players: [
      ...state.players,
      {name: name.slice(0, 20), color}
    ],
  })),
  remPlayer: (index) => set((state) => ({
    players: state.players.filter((_, i) => i !== index),
  })),
  updatePlayerName: (index, name) => set((state) => ({
    players: state.players.map((p, i) => (i === index ? {...p, name: name.slice(0, 20)} : p)),
  })),
  updatePlayerColor: (index, color) => set((state) => ({
    players: state.players.map((p, i) => (i === index ? {...p, color} : p)),
  })),
  reset: () => set({players: []}),
}), {
  name: 'players',
  storage: createJSONStorage(() => localStorage),
}));

interface TimerState {
  running: boolean;
  paused: boolean;
  duration: number;
  at: number;
  currentPlayer: number;
  events: TimerEvent[];
  results: Record<string, number>,
  showPlayerTimes: boolean;
  start: () => void;
  pause: () => void;
  unpause: () => void;
  stop: () => void;
  reset: () => void;
  playerToggle: (playerIndex: number) => void;
  toggleShowPlayerTimes: () => void;
}

export const useTimerStore = create(persist<TimerState>((set) => ({
  running: false,
  paused: false,
  duration: 0,
  at: 0,
  currentPlayer: -1,
  events: [],
  results: {},
  showPlayerTimes: false,
  start: () => set((state) => ({
    events: [{at: Date.now(), type: 'start'}],
    currentPlayer: -1,
    running: true,
    paused: false,
    duration: 0,
    at: Date.now(),
    results: {},
  })),
  pause: () => set((state) => {
    const now = Date.now();
    const newEvents: TimerEvent[] = [{at: now, type: 'stop'}];
    if (state.currentPlayer !== -1) {
      newEvents.push({at: now, type: 'stop', player: state.currentPlayer});
    }
    
    const events = [...state.events, ...newEvents];
    const results = events.reduce<Record<string, number>>((acc, event) => {
      const index = event.player ?? -1;
      if (index === -1) return acc;
      acc[index] = (acc[index] ?? 0) + (event.type === 'start' ? -1 : 1) * event.at;
      return acc;
    }, {});

    return {
      events,
      currentPlayer: -1,
      running: true,
      paused: true,
      duration: state.duration + now - state.at,
      results,
    };
  }),
  unpause: () => set((state) => ({
    events: [...state.events, {at: Date.now(), type: 'start'}],
    running: true,
    paused: false,
    at: Date.now(),
  })),
  stop: () => set((state) => {
    const events = [...state.events];
    if (!state.paused) {
      events.push({at: Date.now(), type: 'stop'});
    }
    if (state.currentPlayer !== -1) {
      events.push({at: Date.now(), type: 'stop', player: state.currentPlayer});
    }
    return {
      events: events,
      running: false,
      paused: false,
      results: events.reduce<Record<string, number>>((acc, event) => {
        const index = event.player ?? -1;
        acc[index] = (acc[index] ?? 0) + (event.type === 'start' ? -1 : 1) * event.at;
        return acc;
      }, {}),
    };
  }),
  reset: () => set({
    events: [],
    results: {},
  }),
  playerToggle: (playerIndex) => set((state) => {
    const newEvents: TimerEvent[] = [];
    const now = Date.now();
    if (state.currentPlayer !== -1) {
      newEvents.push({at: now, type: 'stop', player: state.currentPlayer});
    }
    const nextPlayer = state.currentPlayer === playerIndex ? -1 : playerIndex;
    if (nextPlayer !== -1) {
      newEvents.push({at: now, type: 'start', player: nextPlayer});
    }
    
    const events = [...state.events, ...newEvents];
    const results = events.reduce<Record<string, number>>((acc, event) => {
      const index = event.player ?? -1;
      if (index === -1) return acc;
      acc[index] = (acc[index] ?? 0) + (event.type === 'start' ? -1 : 1) * event.at;
      return acc;
    }, {});

    return {
      events,
      currentPlayer: nextPlayer,
      results,
    };
  }),
  toggleShowPlayerTimes: () => set((state) => ({
    showPlayerTimes: !state.showPlayerTimes,
  })),
}), {
  name: 'timer',
  storage: createJSONStorage(() => localStorage),
}));
