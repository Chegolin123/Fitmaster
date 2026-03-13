import React, { useState, useEffect } from 'react'
import WorkoutSession from './WorkoutSession'
import AuthModal from './AuthModal'
import api from '../services/api'

// Функция для перевода оборудования на русский
const translateEquipment = (eq) => {
  const equipmentMap = {
    'none': 'БЕЗ ОБОРУДОВАНИЯ',
    'dumbbells': 'ГАНТЕЛИ',
    'barbell': 'ШТАНГА',
    'kettlebell': 'ГИРЯ',
    'bands': 'РЕЗИНКИ',
    'pullup-bar': 'ТУРНИК',
    'bench': 'СКАМЬЯ',
    'rope': 'СКАКАЛКА',
    'mat': 'КОВРИК',
    'cable': 'БЛОЧНЫЙ ТРЕНАЖЕР',
    'leg-press': 'ЖИМ НОГАМИ',
    'smith': 'СМИТ',
    'hyperextension': 'ГИПЕРЭКСТЕНЗИЯ',
    'parallel-bars': 'БРУСЬЯ',
    'treadmill': 'БЕГОВАЯ ДОРОЖКА',
    'bike': 'ВЕЛОТРЕНАЖЕР',
    'elliptical': 'ЭЛЛИПС',
    'crossover': 'КРОССОВЕР',
    'rack': 'СТОЙКА'
  };
  return equipmentMap[eq] || eq;
};

const WorkoutModal = ({ workout, isOpen, onClose }) => {
  const [startSession, setStartSession] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showAuthWarning, setShowAuthWarning] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    if (api.isAuthenticated() && workout) {
      checkIfFavorite()
    }
  }, [workout])

  const checkIfFavorite = async () => {
    try {
      const data = await api.getFavorites()
      if (data.success) {
        const isFav = data.favorites.some(fav => fav.workout_id === workout.id)
        setIsFavorite(isFav)
      }
    } catch (error) {
      console.error('Error checking favorites:', error)
    }
  }

  const handleFavoriteClick = async () => {
    if (!api.isAuthenticated()) {
      setShowAuthWarning(true)
      setTimeout(() => setShowAuthWarning(false), 3000)
      return
    }

    setFavoriteLoading(true)
    try {
      if (isFavorite) {
        const data = await api.removeFromFavorites(workout.id)
        if (data.success) {
          setIsFavorite(false)
        }
      } else {
        const data = await api.addToFavorites(workout)
        if (data.success) {
          setIsFavorite(true)
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setFavoriteLoading(false)
    }
  }

  if (!isOpen || !workout) return null

  const handleStartSession = () => {
    if (!api.isAuthenticated()) {
      setShowAuthWarning(true)
      setTimeout(() => setShowAuthWarning(false), 3000)
      return
    }
    setStartSession(true)
  }

  const handleCloseSession = () => {
    setStartSession(false)
    onClose()
  }

  const handleAuthSuccess = (userData) => {
    setShowAuthModal(false)
    setShowAuthWarning(false)
    setStartSession(true)
  }

  if (startSession) {
    return <WorkoutSession workout={workout} onClose={handleCloseSession} />
  }

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'text-green-500 border-green-500'
      case 'medium': return 'text-yellow-500 border-yellow-500'
      case 'hard': return 'text-orange-500 border-orange-500'
      default: return 'text-gray-500 border-gray-500'
    }
  }

  const getDifficultyText = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'НАЧАЛЬНЫЙ'
      case 'medium': return 'СРЕДНИЙ'
      case 'hard': return 'ПРОДВИНУТЫЙ'
      default: return difficulty
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        
        <div className="relative bg-blud-gray border border-blud-red/20 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Заголовок */}
          <div className="sticky top-0 bg-blud-gray border-b border-blud-gray p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-5xl">{workout.image}</div>
                <div>
                  <h2 className="text-2xl font-bold">{workout.name}</h2>
                  <p className="text-gray-400 text-sm mt-1">{workout.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleFavoriteClick}
                  disabled={favoriteLoading}
                  className={`text-2xl transition-all duration-300 hover:scale-110 ${
                    isFavorite ? 'text-blud-red' : 'text-gray-400 hover:text-blud-red'
                  }`}
                  title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                >
                  {favoriteLoading ? (
                    <span className="inline-block w-6 h-6 border-2 border-blud-red border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    isFavorite ? '❤️' : '🤍'
                  )}
                </button>
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Уведомление о необходимости авторизации */}
          {showAuthWarning && (
            <div className="mx-6 mt-4 p-4 bg-blud-red/10 border border-blud-red rounded-lg animate-fadeIn">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">⚠️</div>
                <div>
                  <h3 className="font-bold text-blud-red">Требуется авторизация</h3>
                  <p className="text-sm text-gray-300">
                    {!isFavorite ? 'Чтобы добавить в избранное' : 'Чтобы добавить в избранное'} необходимо войти в систему
                  </p>
                </div>
              </div>
              <div className="flex space-x-3 mt-3">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex-1 blud-button py-2 text-sm"
                >
                  ВОЙТИ
                </button>
                <button
                  onClick={() => {
                    setShowAuthModal(true)
                  }}
                  className="flex-1 py-2 px-4 rounded border border-blud-gray text-gray-400 hover:text-white hover:border-blud-red transition-all duration-300 font-bold uppercase tracking-wider text-sm"
                >
                  РЕГИСТРАЦИЯ
                </button>
              </div>
            </div>
          )}

          {/* Контент */}
          <div className="p-6 space-y-6">
            {/* Мета информация */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border border-blud-gray rounded">
                <div className="text-2xl font-bold text-blud-red">{workout.duration}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">МИНУТ</div>
              </div>
              <div className="text-center p-3 border border-blud-gray rounded">
                <div className="text-2xl font-bold text-blud-red">{workout.calories}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">ККАЛ</div>
              </div>
              <div className="text-center p-3 border border-blud-gray rounded">
                <div className="text-2xl font-bold text-blud-red">
                  {workout.exercises?.length || 0}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">УПРАЖНЕНИЙ</div>
              </div>
              <div className="text-center p-3 border border-blud-gray rounded">
                <div className={`text-2xl font-bold ${getDifficultyColor(workout.difficulty)}`}>
                  {getDifficultyText(workout.difficulty).charAt(0)}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">СЛОЖНОСТЬ</div>
              </div>
            </div>

            {/* Информация о категории и оборудовании */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-blud-gray p-4 rounded">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
                  МЫШЕЧНЫЕ ГРУППЫ
                </h3>
                <div className="flex flex-wrap gap-2">
                  {workout.muscles?.map(muscle => (
                    <span key={muscle} className="blud-tag">
                      {muscle === 'chest' ? 'ГРУДЬ' :
                       muscle === 'back' ? 'СПИНА' :
                       muscle === 'legs' ? 'НОГИ' :
                       muscle === 'shoulders' ? 'ПЛЕЧИ' :
                       muscle === 'arms' ? 'РУКИ' :
                       muscle === 'abs' ? 'ПРЕСС' :
                       muscle === 'cardio' ? 'КАРДИО' :
                       muscle === 'fullbody' ? 'ВСЕ ТЕЛО' : muscle}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border border-blud-gray p-4 rounded">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
                  НЕОБХОДИМОЕ ОБОРУДОВАНИЕ
                </h3>
                <div className="flex flex-wrap gap-2">
                  {workout.equipment?.map(eq => (
                    <span key={eq} className="blud-tag">
                      {translateEquipment(eq)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Список упражнений */}
            <div className="border border-blud-gray p-4 rounded">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                ПРОГРАММА ТРЕНИРОВКИ
              </h3>
              <div className="space-y-3">
                {workout.exercises?.map((ex, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-blud-gray last:border-0">
                    <div className="flex items-center space-x-3">
                      <span className="text-blud-red font-mono text-sm">{index + 1}.</span>
                      <span className="text-white">{ex.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-blud-red font-mono text-sm">{ex.sets}</span>
                      {ex.rest && (
                        <span className="text-gray-500 text-xs">ОТДЫХ {ex.rest}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Кнопка начать тренировку */}
            <button 
              onClick={handleStartSession}
              className="w-full blud-button py-4 text-lg mt-4"
            >
              НАЧАТЬ ТРЕНИРОВКУ
            </button>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false)
          setShowAuthWarning(false)
        }}
        onLoginSuccess={handleAuthSuccess}
      />
    </>
  )
}

export default WorkoutModal