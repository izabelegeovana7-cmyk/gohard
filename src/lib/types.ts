export interface Exercise {
  id: string;
  name: string;
  category: 'peito' | 'costas' | 'pernas' | 'ombros' | 'bracos' | 'abdomen' | 'cardio';
  sets: Set[];
  notes?: string;
}

export interface Set {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  date: string;
  duration?: number;
  completed: boolean;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Omit<Exercise, 'sets'>[];
  color: string;
}

export interface WorkoutHistory {
  id: string;
  workoutId: string;
  workoutName: string;
  date: string;
  duration: number;
  totalSets: number;
  totalReps: number;
  totalWeight: number;
}
