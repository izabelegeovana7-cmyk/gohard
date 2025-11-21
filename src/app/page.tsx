'use client';

import { useState, useEffect } from 'react';
import { Dumbbell, TrendingUp, History, Plus, Award, Flame, CreditCard } from 'lucide-react';
import { WorkoutCard } from '@/components/custom/workout-card';
import { ActiveWorkout } from '@/components/custom/active-workout';
import { WorkoutTemplate, Workout, WorkoutHistory } from '@/lib/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'treinos' | 'historico' | 'progresso'>('treinos');
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([]);
  const [streak, setStreak] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);

  // Templates de treino pré-definidos
  const workoutTemplates: WorkoutTemplate[] = [
    {
      id: '1',
      name: 'Peito e Tríceps',
      color: '#ef4444',
      exercises: [
        { id: 'e1', name: 'Supino Reto', category: 'peito' },
        { id: 'e2', name: 'Supino Inclinado', category: 'peito' },
        { id: 'e3', name: 'Crucifixo', category: 'peito' },
        { id: 'e4', name: 'Tríceps Testa', category: 'bracos' },
        { id: 'e5', name: 'Tríceps Corda', category: 'bracos' },
      ],
    },
    {
      id: '2',
      name: 'Costas e Bíceps',
      color: '#3b82f6',
      exercises: [
        { id: 'e6', name: 'Barra Fixa', category: 'costas' },
        { id: 'e7', name: 'Remada Curvada', category: 'costas' },
        { id: 'e8', name: 'Puxada Frontal', category: 'costas' },
        { id: 'e9', name: 'Rosca Direta', category: 'bracos' },
        { id: 'e10', name: 'Rosca Martelo', category: 'bracos' },
      ],
    },
    {
      id: '3',
      name: 'Pernas Completo',
      color: '#10b981',
      exercises: [
        { id: 'e11', name: 'Agachamento Livre', category: 'pernas' },
        { id: 'e12', name: 'Leg Press', category: 'pernas' },
        { id: 'e13', name: 'Cadeira Extensora', category: 'pernas' },
        { id: 'e14', name: 'Mesa Flexora', category: 'pernas' },
        { id: 'e15', name: 'Panturrilha em Pé', category: 'pernas' },
      ],
    },
    {
      id: '4',
      name: 'Ombros e Abdômen',
      color: '#f59e0b',
      exercises: [
        { id: 'e16', name: 'Desenvolvimento', category: 'ombros' },
        { id: 'e17', name: 'Elevação Lateral', category: 'ombros' },
        { id: 'e18', name: 'Elevação Frontal', category: 'ombros' },
        { id: 'e19', name: 'Abdominal Supra', category: 'abdomen' },
        { id: 'e20', name: 'Prancha', category: 'abdomen' },
      ],
    },
  ];

  useEffect(() => {
    // Carregar histórico do localStorage
    const savedHistory = localStorage.getItem('gohard-history');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setWorkoutHistory(history);
      calculateStreak(history);
    }
  }, []);

  const calculateStreak = (history: WorkoutHistory[]) => {
    if (history.length === 0) {
      setStreak(0);
      return;
    }

    const sortedHistory = [...history].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let currentStreak = 0;
    let lastDate = new Date();
    lastDate.setHours(0, 0, 0, 0);

    for (const workout of sortedHistory) {
      const workoutDate = new Date(workout.date);
      workoutDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((lastDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        currentStreak++;
        lastDate = workoutDate;
      } else {
        break;
      }
    }

    setStreak(currentStreak);
  };

  const startWorkout = (template: WorkoutTemplate) => {
    const workout: Workout = {
      id: Date.now().toString(),
      name: template.name,
      date: new Date().toISOString(),
      completed: false,
      exercises: template.exercises.map(ex => ({
        ...ex,
        sets: Array.from({ length: 3 }, (_, i) => ({
          id: `${ex.id}-set-${i}`,
          reps: 12,
          weight: 0,
          completed: false,
        })),
      })),
    };
    setActiveWorkout(workout);
  };

  const finishWorkout = (workout: Workout) => {
    const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const totalReps = workout.exercises.reduce(
      (acc, ex) => acc + ex.sets.reduce((sum, set) => sum + (set.completed ? set.reps : 0), 0),
      0
    );
    const totalWeight = workout.exercises.reduce(
      (acc, ex) => acc + ex.sets.reduce((sum, set) => sum + (set.completed ? set.weight * set.reps : 0), 0),
      0
    );

    const historyEntry: WorkoutHistory = {
      id: workout.id,
      workoutId: workout.id,
      workoutName: workout.name,
      date: workout.date,
      duration: workout.duration || 0,
      totalSets,
      totalReps,
      totalWeight,
    };

    const newHistory = [historyEntry, ...workoutHistory];
    setWorkoutHistory(newHistory);
    localStorage.setItem('gohard-history', JSON.stringify(newHistory));
    calculateStreak(newHistory);
    setActiveWorkout(null);
  };

  const cancelWorkout = () => {
    if (confirm('Tem certeza que deseja cancelar o treino?')) {
      setActiveWorkout(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const handleCheckout = () => {
    window.open('https://link.infinitepay.io/infinit-flittly/VC1DLUMtUg-6jVwwLB84j-14,90', '_blank');
  };

  if (activeWorkout) {
    return (
      <ActiveWorkout
        workout={activeWorkout}
        onFinish={finishWorkout}
        onCancel={cancelWorkout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-b from-black to-black/95 backdrop-blur-lg z-10 border-b border-gray-800">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                GoHard
              </h1>
              <p className="text-gray-400 text-sm mt-1">Seu treino, seu ritmo</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCheckout}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 rounded-full hover:from-green-600 hover:to-green-700 active:scale-95 transition-all shadow-lg shadow-green-500/30"
              >
                <CreditCard className="w-4 h-4" />
                <span className="font-semibold text-sm">Premium</span>
              </button>
              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 px-4 py-2 rounded-full border border-orange-500/30">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-orange-500">{streak}</span>
                <span className="text-sm text-gray-400">dias</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <Dumbbell className="w-4 h-4 text-orange-500" />
                <span className="text-xs text-gray-400">Treinos</span>
              </div>
              <p className="text-xl font-bold">{workoutHistory.length}</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span className="text-xs text-gray-400">Séries</span>
              </div>
              <p className="text-xl font-bold">
                {workoutHistory.reduce((acc, w) => acc + w.totalSets, 0)}
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-orange-500" />
                <span className="text-xs text-gray-400">Volume</span>
              </div>
              <p className="text-xl font-bold">
                {(workoutHistory.reduce((acc, w) => acc + w.totalWeight, 0) / 1000).toFixed(1)}t
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Promocional */}
      <div className="mx-6 mt-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-green-500" />
              <span className="font-bold text-green-500">Plano Premium</span>
            </div>
            <p className="text-sm text-gray-300 mb-2">
              Desbloqueie treinos ilimitados, análises avançadas e muito mais!
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">R$ 14,90</span>
              <span className="text-sm text-gray-400">/mês</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 active:scale-95 transition-all shadow-lg shadow-green-500/50"
          >
            Assinar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-6 py-4 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('treinos')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === 'treinos'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          Treinos
        </button>
        <button
          onClick={() => setActiveTab('historico')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === 'historico'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          Histórico
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'treinos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">Meus Treinos</h2>
              <button className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-500/50">
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
            {workoutTemplates.map(template => (
              <WorkoutCard
                key={template.id}
                template={template}
                onStart={startWorkout}
              />
            ))}
          </div>
        )}

        {activeTab === 'historico' && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold mb-4">Histórico de Treinos</h2>
            {workoutHistory.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400">Nenhum treino registrado ainda</p>
                <p className="text-sm text-gray-500 mt-2">Comece seu primeiro treino!</p>
              </div>
            ) : (
              workoutHistory.map(workout => (
                <div
                  key={workout.id}
                  className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white">{workout.workoutName}</h3>
                      <p className="text-sm text-gray-400">{formatDate(workout.date)}</p>
                    </div>
                    <div className="bg-orange-500/20 px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-orange-500">
                        {formatDuration(workout.duration)}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Séries</p>
                      <p className="text-lg font-bold text-white">{workout.totalSets}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Reps</p>
                      <p className="text-lg font-bold text-white">{workout.totalReps}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Volume</p>
                      <p className="text-lg font-bold text-white">
                        {(workout.totalWeight / 1000).toFixed(1)}t
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
