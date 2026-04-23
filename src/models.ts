export interface Player {
  name: string;
  color: string;
}

export type TimerEventType = 'start' | 'stop';

export interface TimerEvent {
  at: number;
  type: TimerEventType;
  player?: number;
}
