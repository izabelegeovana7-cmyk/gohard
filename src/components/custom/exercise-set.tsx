'use client';

import { Check, Minus, Plus } from 'lucide-react';
import { Set } from '@/lib/types';
import { useState } from 'react';

interface ExerciseSetProps {
  set: Set;
  setNumber: number;
  onUpdate: (set: Set) => void;
}

export function ExerciseSet({ set, setNumber, onUpdate }: ExerciseSetProps) {
  const [localSet, setLocalSet] = useState(set);

  const updateReps = (delta: number) => {
    const newReps = Math.max(0, localSet.reps + delta);
    const updated = { ...localSet, reps: newReps };
    setLocalSet(updated);
    onUpdate(updated);
  };

  const updateWeight = (delta: number) => {
    const newWeight = Math.max(0, localSet.weight + delta);
    const updated = { ...localSet, weight: newWeight };
    setLocalSet(updated);
    onUpdate(updated);
  };

  const toggleComplete = () => {
    const updated = { ...localSet, completed: !localSet.completed };
    setLocalSet(updated);
    onUpdate(updated);
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
      localSet.completed 
        ? 'bg-orange-500/10 border-2 border-orange-500' 
        : 'bg-gray-800 border-2 border-transparent'
    }`}>
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-white font-bold text-sm">
        {setNumber}
      </div>

      <div className="flex-1 grid grid-cols-2 gap-3">
        {/* Repetições */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Reps</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateReps(-1)}
              className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center hover:bg-gray-600 active:scale-95 transition-all"
            >
              <Minus className="w-4 h-4 text-white" />
            </button>
            <span className="text-lg font-bold text-white min-w-[2rem] text-center">
              {localSet.reps}
            </span>
            <button
              onClick={() => updateReps(1)}
              className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center hover:bg-gray-600 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Peso */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Peso (kg)</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateWeight(-2.5)}
              className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center hover:bg-gray-600 active:scale-95 transition-all"
            >
              <Minus className="w-4 h-4 text-white" />
            </button>
            <span className="text-lg font-bold text-white min-w-[2rem] text-center">
              {localSet.weight}
            </span>
            <button
              onClick={() => updateWeight(2.5)}
              className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center hover:bg-gray-600 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={toggleComplete}
        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
          localSet.completed
            ? 'bg-orange-500 shadow-lg shadow-orange-500/50'
            : 'bg-gray-700 hover:bg-gray-600'
        }`}
      >
        <Check className={`w-6 h-6 ${localSet.completed ? 'text-white' : 'text-gray-400'}`} />
      </button>
    </div>
  );
}
