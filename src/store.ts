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
  start: () => set((state) => {
    const now = Date.now();
    return {
      events: [
        {at: now, type: 'start'},
        {at: now, type: 'start', player: -1}
      ],
      currentPlayer: -1,
      running: true,
      paused: false,
      duration: 0,
      at: now,
      results: {},
    };
  }),
  pause: () => set((state) => {
    const now = Date.now();
    const newEvents: TimerEvent[] = [{at: now, type: 'stop'}];
    if (state.currentPlayer !== -1) {
      newEvents.push({at: now, type: 'stop', player: state.currentPlayer});
    } else {
      newEvents.push({at: now, type: 'stop', player: -1});
    }
    
    const events = [...state.events, ...newEvents];
    const results = events.reduce<Record<string, number>>((acc, event) => {
      if (event.player === undefined) return acc;
      const index = event.player;
      acc[index] = (acc[index] ?? 0) + (event.type === 'start' ? -1 : 1) * event.at;
      return acc;
    }, {});

    const duration = events.reduce((acc, event) => {
      if (event.player !== undefined) return acc;
      return acc + (event.type === 'start' ? -1 : 1) * event.at;
    }, 0);

    return {
      events,
      currentPlayer: -1,
      running: true,
      paused: true,
      duration,
      results,
    };
  }),
  unpause: () => set((state) => {
    const now = Date.now();
    return {
      events: [
        ...state.events,
        {at: now, type: 'start'},
        {at: now, type: 'start', player: -1}
      ],
      running: true,
      paused: false,
      at: now,
    };
  }),
  stop: () => set((state) => {
    const events = [...state.events];
    const now = Date.now();
    if (!state.paused) {
      events.push({at: now, type: 'stop'});
      if (state.currentPlayer !== -1) {
        events.push({at: now, type: 'stop', player: state.currentPlayer});
      } else {
        events.push({at: now, type: 'stop', player: -1});
      }
    }

    const duration = events.reduce((acc, event) => {
      if (event.player !== undefined) return acc;
      return acc + (event.type === 'start' ? -1 : 1) * event.at;
    }, 0);

    return {
      events: events,
      running: false,
      paused: false,
      duration,
      showPlayerTimes: true,
      results: events.reduce<Record<string, number>>((acc, event) => {
        if (event.player === undefined) return acc;
        const index = event.player;
        acc[index] = (acc[index] ?? 0) + (event.type === 'start' ? -1 : 1) * event.at;
        return acc;
      }, {}),
    };
  }),
  reset: () => set({
    running: false,
    paused: false,
    duration: 0,
    at: 0,
    currentPlayer: -1,
    events: [],
    results: {},
    showPlayerTimes: false,
  }),
  playerToggle: (playerIndex) => set((state) => {
    const newEvents: TimerEvent[] = [];
    const now = Date.now();
    if (state.currentPlayer !== -1) {
      newEvents.push({at: now, type: 'stop', player: state.currentPlayer});
    } else {
      newEvents.push({at: now, type: 'stop', player: -1});
    }
    const nextPlayer = state.currentPlayer === playerIndex ? -1 : playerIndex;
    if (nextPlayer !== -1) {
      newEvents.push({at: now, type: 'start', player: nextPlayer});
    } else {
      newEvents.push({at: now, type: 'start', player: -1});
    }
    
    const events = [...state.events, ...newEvents];
    const results = events.reduce<Record<string, number>>((acc, event) => {
      if (event.player === undefined) return acc;
      const index = event.player;
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
