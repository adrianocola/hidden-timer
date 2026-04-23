import React, { useState, useEffect } from 'react';
import { PLAYER_COLORS, UI_COLORS } from '../consts';
import { randomPlayerColor } from '../utils';
import { usePlayersStore } from '../store';

interface PlayerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (name: string, color: string) => void;
  onDelete?: () => void;
  initialName?: string;
  initialColor?: string;
  title: string;
  confirmLabel: string;
}

export function PlayerModal({
  isVisible,
  onClose,
  onConfirm,
  onDelete,
  initialName = '',
  initialColor,
  title,
  confirmLabel
}: PlayerModalProps) {
  const { players } = usePlayersStore();
  const [name, setName] = useState(initialName);
  const [selectedColor, setSelectedColor] = useState(initialColor || '');

  useEffect(() => {
    if (isVisible) {
      setName(initialName);
      setSelectedColor(initialColor || randomPlayerColor(players.map(p => p.color)));
    }
  }, [isVisible, initialName, initialColor, players]);

  if (!isVisible) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm(name.trim(), selectedColor);
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur-[5px] flex items-center justify-center z-[1000]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background border border-border p-[30px] rounded-[15px] w-[90%] max-w-[400px] flex flex-col gap-5"
      >
        <h2 className="text-ui-text m-0 text-center">{title}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            autoFocus
            type="text"
            placeholder="Player Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            className="p-3 rounded-lg border border-border bg-[#2a2a2a] text-white text-lg outline-none"
          />

          <div className="flex flex-wrap gap-[15px] justify-center px-[10px]">
            {Object.values(PLAYER_COLORS).map((color) => (
              <div
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-[45px] h-[45px] rounded-full cursor-pointer box-border transition-transform duration-100 ${
                  selectedColor === color ? 'border-[3px] border-[#3b82f6] scale-110' : 'border border-border scale-100'
                }`}
                style={{
                  backgroundColor: color,
                }}
              />
            ))}
          </div>

          <div className="flex gap-[15px] mt-[10px]">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                className="p-3 rounded-lg border border-[#ef4444] bg-transparent text-[#ef4444] cursor-pointer text-base"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-3 rounded-lg border border-border bg-transparent text-ui-text cursor-pointer text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className={`flex-1 p-3 rounded-lg border-none text-white text-base font-bold ${
                name.trim() ? 'bg-[#3b82f6] cursor-pointer' : 'bg-ui-disabled cursor-default'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
