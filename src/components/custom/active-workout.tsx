'use client';

import { useState, useEffect } from 'react';
import { X, Clock, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { Workout, Exercise, Set } from '@/lib/types';
import { ExerciseSet } from './exercise-set';

interface ActiveWorkoutProps {
  workout: Workout;
  onFinish: (workout: Workout) => void;
  onCancel: () => void;
}

export function ActiveWorkout({ workout, onFinish, onCancel }: ActiveWorkoutProps) {
  const [activeWorkout, setActiveWorkout] = useState(workout);
  const [duration, setDuration] = useState(0);
  const [expandedExercises, setExpandedExercises] = useState<string[]>(
    workout.exercises.map(e => e.id)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateSet = (exerciseId: string, setId: string, updatedSet: Set) => {
    setActiveWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map(s => (s.id === setId ? updatedSet : s))
            }
          : ex
      )
    }));
  };

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercises(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const totalSets = activeWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = activeWorkout.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter(s => s.completed).length,
    0
  );
  const progress = (completedSets / totalSets) * 100;

  const handleFinish = () => {
    onFinish({ ...activeWorkout, duration, completed: true });
  };

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-b from-black to-black/95 backdrop-blur-lg z-10 border-b border-gray-800">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onCancel}
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 active:scale-95 transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-2 text-orange-500">
              <Clock className="w-5 h-5" />
              <span className="text-xl font-bold font-mono">{formatTime(duration)}</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">{activeWorkout.name}</h1>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progresso</span>
              <span className="text-white font-bold">
                {completedSets}/{totalSets} séries
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="p-4 space-y-4 pb-24">
        {activeWorkout.exercises.map((exercise, exIdx) => {
          const isExpanded = expandedExercises.includes(exercise.id);
          const completedInExercise = exercise.sets.filter(s => s.completed).length;
          
          return (
            <div key={exercise.id} className="bg-gray-900 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleExercise(exercise.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <span className="text-orange-500 font-bold">{exIdx + 1}</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-bold">{exercise.name}</h3>
                    <p className="text-sm text-gray-400">
                      {completedInExercise}/{exercise.sets.length} séries
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="p-4 pt-0 space-y-3">
                  {exercise.sets.map((set, setIdx) => (
                    <ExerciseSet
                      key={set.id}
                      set={set}
                      setNumber={setIdx + 1}
                      onUpdate={(updatedSet) => updateSet(exercise.id, set.id, updatedSet)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-black/95 backdrop-blur-lg border-t border-gray-800">
        <button
          onClick={handleFinish}
          disabled={completedSets === 0}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/50"
        >
          <Trophy className="w-5 h-5" />
          Finalizar Treino
        </button>
      </div>
    </div>
  );
}
