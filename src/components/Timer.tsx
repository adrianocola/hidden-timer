import React, {useEffect, useState} from 'react';
import {formatDuration} from '../utils';
import {useTimerStore} from '../store';
import {Timer as TimerIcon, UserX} from 'lucide-react';

export function Timer() {
  const { running, paused, duration, at, showPlayerTimes, results } = useTimerStore();
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!running) {
      setTimer(duration);
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

  if (!running && !showPlayerTimes) {
    return <div className="h-[2rem]" />;
  }

  const noPlayerTime = results['-1'] ?? 0;

  return (
    <div className="flex flex-row items-center gap-8">
      <div className="flex items-center gap-2 font-mono text-[2rem] text-ui-text">
        {!running && showPlayerTimes && <TimerIcon size={32} className="opacity-50" />}
        {formatDuration(timer)}
      </div>
      {!running && showPlayerTimes && (
        <div className="flex items-center gap-2 font-mono text-[1.5rem] text-ui-text opacity-50">
          <UserX size={24} />
          {formatDuration(noPlayerTime)}
        </div>
      )}
    </div>
  );
}
