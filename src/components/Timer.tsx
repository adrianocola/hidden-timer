import React, { useEffect, useState } from 'react';
import { formatDuration } from '../utils';
import { useTimerStore } from '../store';
import { SECOND_MS, UI_COLORS } from '../consts';

export function Timer() {
  const { running, paused, duration, at } = useTimerStore();
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!running) {
      setTimer(0);
      return;
    }

    const update = () => {
      const current = paused ? duration : (Date.now() - at + duration);
      setTimer(current);
    };

    update();

    if (paused) return;

    const interval = setInterval(update, 100);

    return () => {
      clearInterval(interval);
    };
  }, [paused, running, at, duration]);

  return (
    <div className="font-mono text-[2rem] text-ui-text">
      {formatDuration(timer)}
    </div>
  );
}
