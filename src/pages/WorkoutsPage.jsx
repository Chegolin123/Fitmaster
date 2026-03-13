import React, { useState, useEffect } from 'react'
import { workoutsDatabase } from '../data/workouts'
import WorkoutModal from '../components/WorkoutModal'

const WorkoutsPage = () => {
  const [filteredWorkouts, setFilteredWorkouts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Проверяем, что база данных загружена
    if (workoutsDatabase && workoutsDatabase.length > 0) {
      setFilteredWorkouts(workoutsDatabase)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!workoutsDatabase) return
    
    let filtered = workoutsDatabase

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(w => w.category === selectedCategory)
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(w => w.difficulty === selectedDifficulty)
    }

    if (searchTerm) {
      filtered = filtered.filter(w => 
        w.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredWorkouts(filtered)
  }, [selectedCategory, selectedDifficulty, searchTerm])

  const handleWorkoutClick = (workout) => {
    setSelectedWorkout(workout)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedWorkout(null)
  }

  const translateEquipment = (eq) => {
    const equipmentMap = {
      'none': 'Без оборудования',
      'dumbbells': 'Гантели',
      'barbell': 'Штанга',
      'kettlebell': 'Гиря',
      'bands': 'Резинки',
      'pullup-bar': 'Турник',
      'bench': 'Скамья',
      'rope': 'Скакалка',
      'mat': 'Коврик',
      'cable': 'Блочный тренажер',
      'leg-press': 'Жим ногами',
      'smith': 'Смит',
      'hyperextension': 'Гиперэкстензия',
      'parallel-bars': 'Брусья',
      'treadmill': 'Беговая дорожка',
      'bike': 'Велотренажер',
      'elliptical': 'Эллипс',
      'crossover': 'Кроссовер',
      'rack': 'Стойка'
    };
    return equipmentMap[eq] || eq;
  };

  const categories = [
    { id: 'all', name: 'ВСЕ', icon: '📋' },
    { id: 'chest', name: 'ГРУДЬ', icon: '💪' },
    { id: 'back', name: 'СПИНА', icon: '🔱' },
    { id: 'legs', name: 'НОГИ', icon: '🦵' },
    { id: 'shoulders', name: 'ПЛЕЧИ', icon: '🏔️' },
    { id: 'arms', name: 'РУКИ', icon: '💪' },
    { id: 'abs', name: 'ПРЕСС', icon: '🔥' },
    { id: 'cardio', name: 'КАРДИО', icon: '❤️' },
    { id: 'fullbody', name: 'ВСЕ ТЕЛО', icon: '⚡' },
  ]

  const difficulties = [
    { id: 'all', name: 'ЛЮБАЯ' },
    { id: 'easy', name: 'НАЧАЛЬНЫЙ' },
    { id: 'medium', name: 'СРЕДНИЙ' },
    { id: 'hard', name: 'ПРОДВИНУТЫЙ' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-blud-black pt-24 sm:pt-28 lg:pt-32 flex items-center justify-center">
        <div className="text-4xl animate-pulse">💪</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blud-black pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-10 lg:pb-12">
      <div className="container-custom">
        {/* Заголовок */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 sm:mb-3 lg:mb-4">
            <span className="text-blud-red">ВСЕ</span> ТРЕНИРОВКИ
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            {filteredWorkouts.length} тренировок в базе
          </p>
        </div>

        {/* Фильтры */}
        <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          {/* Поиск */}
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Поиск тренировки..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="blud-input w-full pl-8 sm:pl-10 text-sm sm:text-base"
            />
          </div>

          {/* Категории */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition-all
                  ${selectedCategory === cat.id 
                    ? 'bg-blud-red text-white' 
                    : 'bg-blud-gray/50 text-gray-400 hover:bg-blud-gray'
                  }
                `}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Сложность */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {difficulties.map(diff => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`
                  px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition-all
                  ${selectedDifficulty === diff.id 
                    ? 'bg-blud-red text-white' 
                    : 'bg-blud-gray/50 text-gray-400 hover:bg-blud-gray'
                  }
                `}
              >
                {diff.name}
              </button>
            ))}
          </div>
        </div>

        {/* Сетка тренировок */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredWorkouts.map(workout => (
            <div
              key={workout.id}
              className="blud-card group cursor-pointer hover:scale-105 transition-all duration-300"
              onClick={() => handleWorkoutClick(workout)}
            >
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{workout.image}</div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 group-hover:text-blud-red transition-colors line-clamp-2">
                {workout.name}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                {workout.description}
              </p>
              <div className="flex items-center justify-between text-[10px] sm:text-xs">
                <span className="text-gray-500">⏱️ {workout.duration} мин</span>
                <span className="text-blud-red">🔥 {workout.calories} ккал</span>
              </div>
              <div className="mt-2 sm:mt-3 flex flex-wrap gap-0.5 sm:gap-1">
                {workout.equipment.slice(0, 2).map(eq => (
                  <span key={eq} className="text-[8px] sm:text-[10px] bg-blud-gray/50 px-1 sm:px-1.5 py-0.5 rounded">
                    {translateEquipment(eq)}
                  </span>
                ))}
                {workout.equipment.length > 2 && (
                  <span className="text-[8px] sm:text-[10px] bg-blud-gray/50 px-1 sm:px-1.5 py-0.5 rounded">
                    +{workout.equipment.length - 2}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Если ничего не найдено */}
        {filteredWorkouts.length === 0 && (
          <div className="text-center py-10 sm:py-12">
            <div className="text-5xl sm:text-6xl mb-4">😕</div>
            <p className="text-sm sm:text-base text-gray-400">Ничего не найдено</p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedDifficulty('all')
                setSearchTerm('')
              }}
              className="blud-button mt-4 text-sm sm:text-base"
            >
              СБРОСИТЬ ФИЛЬТРЫ
            </button>
          </div>
        )}
      </div>

      {isModalOpen && selectedWorkout && (
        <WorkoutModal 
          workout={selectedWorkout}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default WorkoutsPage