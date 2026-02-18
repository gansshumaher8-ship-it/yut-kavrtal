"use client";

import * as React from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number];
  onChange?: (value: [number]) => void;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange
}) => {
  const [internal, setInternal] = React.useState(value[0]);

  React.useEffect(() => {
    setInternal(value[0]);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setInternal(v);
    onChange?.([v]);
  };

  const percent = ((internal - min) / (max - min)) * 100;

  return (
    <div className="relative h-6 flex items-center">
      <div className="absolute inset-x-0 h-1 rounded-full bg-slate-200" />
      <div
        className="absolute h-1 rounded-full bg-brand"
        style={{ width: `${percent}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={internal}
        onChange={handleChange}
        className="relative z-10 w-full bg-transparent appearance-none cursor-pointer"
      />
    </div>
  );
};

