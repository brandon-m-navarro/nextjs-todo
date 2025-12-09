"use client";

import { useState } from "react";

interface ToggleProps {
  label?: string;
  onChange?: (isOn: boolean) => void;
  defaultChecked?: boolean;
  className?: string;
}

export function Toggle({
  label,
  onChange,
  defaultChecked = false,
  className=""
}: ToggleProps) {
  const [isOn, setIsOn] = useState(defaultChecked);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    onChange?.(newState);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
          isOn ? "bg-blue-600" : "bg-gray-300"
        }`}
        aria-pressed={isOn}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOn ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
}
