import React, { useState, useEffect, useRef } from 'react'
import ConfirmModal from './ConfirmModal'
import api from '../services/api'

const WorkoutSession = ({ workout, onClose }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [isResting, setIsResting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isActive, setIsActive] = useState(true)
  const [completedExercises, setCompletedExercises] = useState([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [progressSaved, setProgressSaved] = useState(false)
  
  const timerRef = useRef(null)
  const saveAttemptedRef = useRef(false) // Защита от двойного сохранения

  // Проверка авторизации при загрузке
  useEffect(() => {
    if (!api.isAuthenticated()) {
      onClose()
      return
    }
  }, [])

  const currentExercise = workout.exercises[currentExerciseIndex]
  const totalSets = parseInt(currentExercise?.sets.split('x')[0]) || 3
  const isLastSet = currentSet === totalSets
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1

  // Звуковой сигнал
  const playBeep = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    gainNode.gain.value = 0.5
    
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.1)
  }

  // Сохранение прогресса тренировки (только один раз)
  const saveProgress = async () => {
    // Проверяем, не сохраняли ли уже
    if (progressSaved || saveAttemptedRef.current || !api.isAuthenticated()) return;

    saveAttemptedRef.current = true;
    setIsSaving(true);
    
    try {
      console.log('Saving workout progress once:', {
        workout_id: workout.id,
        workout_name: workout.name,
        calories: workout.calories,
        duration: workout.duration
      });

      const response = await api.saveWorkoutProgress({
        workout_id: workout.id,
        workout_name: workout.name,
        calories: workout.calories,
        duration: workout.duration
      });

      if (response.success) {
        console.log('Progress saved successfully');
        setProgressSaved(true);
      } else {
        console.error('Failed to save progress:', response.message);
        saveAttemptedRef.current = false; // Сбрасываем флаг при ошибке
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      saveAttemptedRef.current = false; // Сбрасываем флаг при ошибке
    } finally {
      setIsSaving(false);
    }
  };

  // Таймер
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      playBeep()
      
      if (isResting) {
        setIsResting(false)
        setTimeLeft(30)
        
        if (!isLastSet) {
          setCurrentSet(currentSet + 1)
        }
      } else {
        if (!isLastSet) {
          setIsResting(true)
          setTimeLeft(30)
        } else {
          const newCompleted = [...completedExercises, currentExerciseIndex]
          setCompletedExercises(newCompleted)
          
          if (isLastExercise) {
            setIsActive(false)
            // Сохраняем прогресс только при полном завершении тренировки
            saveProgress();
            setShowCompletion(true)
          } else {
            setCurrentExerciseIndex(currentExerciseIndex + 1)
            setCurrentSet(1)
            setIsResting(false)
            setTimeLeft(30)
          }
        }
      }
    }

    return () => clearTimeout(timerRef.current)
  }, [timeLeft, isActive, isResting])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (timeLeft / 30) * 100

  const handleSkipRest = () => {
    if (isResting) {
      setTimeLeft(0)
    }
  }

  const handleSkipExercise = () => {
    if (!isResting) {
      setTimeLeft(0)
    }
  }

  const handlePause = () => {
    setIsActive(!isActive)
  }

  const handleStopClick = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmStop = () => {
    setShowConfirmModal(false)
    onClose()
  }

  const handleCancelStop = () => {
    setShowConfirmModal(false)
  }

  const handleCompleteAndClose = () => {
    onClose()
  }

  const handleRepeatWorkout = () => {
    setShowCompletion(false)
    setCurrentExerciseIndex(0)
    setCurrentSet(1)
    setIsActive(true)
    setTimeLeft(30)
    setCompletedExercises([])
    setProgressSaved(false)
    saveAttemptedRef.current = false // Сбрасываем флаг при повторе
  }

  if (!workout) return null

  // Экран завершения тренировки
  if (showCompletion) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95">
        <div className="relative w-full max-w-2xl text-center animate-fadeIn">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl z-10 transition-colors hover:scale-110 transform"
            title="Закрыть"
          >
            ✕
          </button>

          <div className="absolute inset-0 bg-gradient-to-br from-blud-red/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse"></div>
          
          <div className="relative">
            <div className="text-9xl mb-8 animate-bounce">🏆</div>
            
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              <span className="text-blud-red">ТРЕНИРОВКА</span>
              <br />
              <span className="text-white">ЗАВЕРШЕНА!</span>
            </h2>
            
            <p className="text-xl text-gray-400 mb-8">
              Отличная работа! Вы справились с тренировкой
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <div className="bg-blud-gray/50 backdrop-blur-sm p-4 rounded-lg border border-blud-red/20">
                <div className="text-3xl font-bold text-blud-red">{workout.calories}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">СОЖЖЕНО ККАЛ</div>
              </div>
              <div className="bg-blud-gray/50 backdrop-blur-sm p-4 rounded-lg border border-blud-red/20">
                <div className="text-3xl font-bold text-blud-red">{workout.duration}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">МИНУТ</div>
              </div>
            </div>

            {isSaving && (
              <p className="text-sm text-gray-400 mb-4 animate-pulse">
                Сохраняем прогресс...
              </p>
            )}

            {progressSaved && (
              <p className="text-sm text-green-500 mb-4">
                ✓ Прогресс сохранен
              </p>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCompleteAndClose}
                className="blud-button px-8 py-3 text-lg"
                disabled={isSaving}
              >
                ЗАВЕРШИТЬ
              </button>
              <button
                onClick={handleRepeatWorkout}
                className="px-8 py-3 rounded border border-blud-gray text-gray-400 hover:text-white hover:border-blud-red transition-all duration-300 font-bold uppercase tracking-wider"
                disabled={isSaving}
              >
                ЕЩЕ РАЗ
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/95 overflow-y-auto">
      <div className="relative w-full max-w-4xl py-8">
        {/* Крестик */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={handleStopClick}
            className="text-gray-400 hover:text-white text-3xl transition-colors hover:scale-110 transform bg-blud-black/80 backdrop-blur-sm p-2 rounded-full"
            title="Завершить тренировку"
          >
            ✕
          </button>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">{workout.name}</h1>
          <p className="text-gray-400 text-sm">{workout.description}</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Упражнение {currentExerciseIndex + 1} из {workout.exercises.length}</span>
            <span>Подход {currentSet} из {totalSets}</span>
          </div>
          <div className="w-full h-2 bg-blud-gray rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blud-red to-blud-red-dark transition-all duration-300"
              style={{ 
                width: `${((currentExerciseIndex * totalSets + currentSet) / (workout.exercises.length * totalSets)) * 100}%` 
              }}
            />
          </div>
        </div>

        <div className="blud-card p-6 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blud-red/5 via-transparent to-transparent"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-blud-red text-xs font-bold uppercase tracking-wider mb-1 block">
                  {isResting ? 'ОТДЫХ' : 'ВЫПОЛНЯЙТЕ'}
                </span>
                <h2 className="text-xl md:text-2xl font-bold">
                  {isResting ? 'Отдых между подходами' : currentExercise.name}
                </h2>
              </div>
              <div className="text-5xl animate-pulse">{workout.image}</div>
            </div>

            <div className="relative mb-6">
              <div className="w-40 h-40 mx-auto relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="72"
                    fill="none"
                    stroke="#1a1a1a"
                    strokeWidth="8"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="72"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 72}`}
                    strokeDashoffset={`${2 * Math.PI * 72 * (1 - progress / 100)}`}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-blud-red">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-xl font-bold mb-1">
                {isResting ? 'СЛЕДУЮЩИЙ ПОДХОД' : `ПОДХОД ${currentSet} ИЗ ${totalSets}`}
              </div>
              {!isResting && (
                <div className="text-gray-400 text-sm">
                  {currentExercise.sets} • {currentExercise.rest} отдых
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={handlePause}
                className="blud-button px-6 py-2 min-w-[120px] text-sm"
              >
                {isActive ? '⏸ ПАУЗА' : '▶ ПРОДОЛЖИТЬ'}
              </button>
              
              {isResting ? (
                <button
                  onClick={handleSkipRest}
                  className="blud-button px-6 py-2 min-w-[120px] bg-yellow-600 hover:bg-yellow-700 text-sm"
                >
                  ⏭ ПРОПУСТИТЬ ОТДЫХ
                </button>
              ) : (
                <button
                  onClick={handleSkipExercise}
                  className="blud-button px-6 py-2 min-w-[120px] bg-gray-700 hover:bg-gray-600 text-sm"
                >
                  ⏭ ПРОПУСТИТЬ ПОДХОД
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {workout.exercises.map((ex, index) => (
            <div
              key={index}
              className={`
                p-3 border rounded-lg transition-all relative overflow-hidden
                ${index === currentExerciseIndex 
                  ? 'border-blud-red bg-blud-red/10' 
                  : completedExercises.includes(index)
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-blud-gray hover:border-blud-red/50'
                }
              `}
            >
              {index === currentExerciseIndex && (
                <div className="absolute top-0 left-0 w-1 h-full bg-blud-red"></div>
              )}
              {completedExercises.includes(index) && (
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400">Упражнение {index + 1}</span>
                  <h4 className="text-sm font-bold">{ex.name}</h4>
                </div>
                {completedExercises.includes(index) && (
                  <span className="text-green-500 text-xl">✓</span>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {ex.sets} • отдых {ex.rest}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={handleCancelStop}
        onConfirm={handleConfirmStop}
        title="ЗАВЕРШИТЬ ТРЕНИРОВКУ?"
        message="Вы уверены, что хотите прервать тренировку? Весь прогресс будет потерян."
      />
    </div>
  )
}

export default WorkoutSession