import {HOUR_MS, MINUTE_MS, PLAYER_COLORS, SECOND_MS} from './consts';

export function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomValue<T>(arr: T[]): T {
  return arr[randomBetween(0, arr.length - 1)];
}

export function randomPlayerColor(exclude?: string[]): string {
  return randomValue(Object.values(PLAYER_COLORS).filter((color) => !exclude || !exclude.includes(color)));
}

export function formatDuration(duration: number) {
  let remaining = duration;

  const hours = Math.floor(remaining / HOUR_MS);
  remaining -= hours * HOUR_MS;

  const minutes = Math.floor(remaining / MINUTE_MS);
  remaining -= minutes * 60000;

  const seconds = Math.floor(remaining / SECOND_MS);

  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
