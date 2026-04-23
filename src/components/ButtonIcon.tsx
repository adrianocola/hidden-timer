import React from 'react';
import { Plus, Play, Square, Pause, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { UI_COLORS } from '../consts';

const ICON_MAP = {
  add: Plus,
  play: Play,
  stop: Square,
  pause: Pause,
  refresh: RotateCcw,
  eye: Eye,
  eyeOff: EyeOff,
};

interface ButtonIconProps {
  name: keyof typeof ICON_MAP;
  onPress: () => void;
  disabled?: boolean;
}

export function ButtonIcon({ name, onPress, disabled }: ButtonIconProps) {
  const Icon = ICON_MAP[name];

  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className={`bg-transparent border-none p-0 flex items-center justify-center ${disabled ? 'cursor-default opacity-50' : 'cursor-pointer opacity-100'}`}
    >
      <Icon
        size={40}
        color={disabled ? UI_COLORS.buttonDisabled : UI_COLORS.button}
        fill={name === 'stop' ? (disabled ? UI_COLORS.buttonDisabled : UI_COLORS.button) : 'none'}
      />
    </button>
  );
}
