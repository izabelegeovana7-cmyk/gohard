'use client';

import { Dumbbell, Clock, CheckCircle2, Play } from 'lucide-react';
import { WorkoutTemplate } from '@/lib/types';

interface WorkoutCardProps {
  template: WorkoutTemplate;
  onStart: (template: WorkoutTemplate) => void;
}

export function WorkoutCard({ template, onStart }: WorkoutCardProps) {
  return (
    <div 
      className="relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{ backgroundColor: template.color }}
      onClick={() => onStart(template)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Dumbbell className="w-4 h-4" />
            <span>{template.exercises.length} exercícios</span>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
          <Play className="w-6 h-6 text-white" fill="white" />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {template.exercises.slice(0, 3).map((exercise, idx) => (
          <span 
            key={idx}
            className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full"
          >
            {exercise.name}
          </span>
        ))}
        {template.exercises.length > 3 && (
          <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full">
            +{template.exercises.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}
