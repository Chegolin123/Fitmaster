import React, { useState, useEffect, useRef } from 'react'
import { workoutsDatabase } from '../data/workouts'
import WorkoutModal from './WorkoutModal'
import api from '../services/api'

const PopularSlider = () => {
  const [popularWorkouts, setPopularWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const sliderRef = useRef(null)
  const autoPlayRef = useRef(null)
  const loadedRef = useRef(false)

  // Определяем количество карточек в зависимости от размера экрана
  const getCardsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1
      if (window.innerWidth < 768) return 2
      if (window.innerWidth < 1024) return 3
      return 4
    }
    return 4
  }

  const [cardsPerView, setCardsPerView] = useState(getCardsPerView())

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Загружаем данные только один раз
    if (!loadedRef.current) {
      console.log('PopularSlider mounted')
      loadPopularWorkouts()
      loadedRef.current = true
    }
  }, [])

  useEffect(() => {
    if (popularWorkouts.length > 0) {
      startAutoPlay()
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [popularWorkouts.length, currentIndex])

  const startAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
    autoPlayRef.current = setInterval(() => {
      handleNextSlide()
    }, 5000)
  }

  const loadPopularWorkouts = async () => {
    console.log('Loading popular workouts...')
    try {
      const data = await api.getPopularWorkouts()
      
      if (data?.success && data.popular_workouts?.length > 0) {
        const popularWithDetails = data.popular_workouts
          .map(pop => {
            const fullWorkout = workoutsDatabase.find(w => w.id === pop.workout_id)
            return fullWorkout ? { ...fullWorkout, completions: pop.completions } : null
          })
          .filter(w => w !== null)
          .slice(0, 10)
        
        setPopularWorkouts(popularWithDetails)
      } else {
        // Если нет данных, показываем случайные тренировки
        const defaultPopular = [...workoutsDatabase]
          .sort(() => 0.5 - Math.random())
          .slice(0, 10)
        setPopularWorkouts(defaultPopular)
      }
    } catch (error) {
      console.error('Error loading popular workouts:', error)
      const defaultPopular = [...workoutsDatabase]
        .sort(() => 0.5 - Math.random())
        .slice(0, 10)
      setPopularWorkouts(defaultPopular)
    } finally {
      setLoading(false)
    }
  }

  const handlePrevSlide = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
      startAutoPlay()
    }
    
    setCurrentIndex(prev => {
      if (prev === 0) {
        return Math.max(0, popularWorkouts.length - cardsPerView)
      }
      return prev - 1
    })
  }

  const handleNextSlide = () => {
    setCurrentIndex(prev => {
      if (prev >= popularWorkouts.length - cardsPerView) {
        return 0
      }
      return prev + 1
    })
  }

  const handleWorkoutClick = (workout) => {
    setSelectedWorkout(workout)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedWorkout(null)
  }

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-blud-black/50">
        <div className="container-custom">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6 sm:mb-8 text-center">
            <span className="text-blud-red">ТОП 10</span> ТРЕНИРОВОК
          </h2>
          <div className="flex justify-center">
            <div className="text-4xl animate-pulse">💪</div>
          </div>
        </div>
      </section>
    )
  }

  if (popularWorkouts.length === 0) {
    return null
  }

  return (
    <section className="py-12 sm:py-16 bg-blud-black/50">
      <div className="container-custom">
        {/* Заголовок */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3 lg:mb-4">
            <span className="text-blud-red">ТОП 10</span> ТРЕНИРОВОК
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            Самые популярные тренировки среди наших пользователей
          </p>
        </div>

        {/* Слайдер */}
        <div className="relative px-8 sm:px-10 md:px-12 lg:px-16">
          {/* Левая стрелка */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-0 sm:-left-2 md:-left-4 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-blud-gray/80 backdrop-blur-sm flex items-center justify-center text-xl sm:text-2xl transition-all hover:bg-blud-red hover:text-white"
            aria-label="Предыдущие тренировки"
          >
            ‹
          </button>

          {/* Правая стрелка */}
          <button
            onClick={handleNextSlide}
            className="absolute right-0 sm:-right-2 md:-right-4 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-blud-gray/80 backdrop-blur-sm flex items-center justify-center text-xl sm:text-2xl transition-all hover:bg-blud-red hover:text-white"
            aria-label="Следующие тренировки"
          >
            ›
          </button>

          {/* Слайды */}
          <div className="overflow-hidden">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)` }}
            >
              {popularWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  style={{ flex: `0 0 ${100 / cardsPerView}%` }}
                  className="px-2 sm:px-3"
                >
                  <div
                    onClick={() => handleWorkoutClick(workout)}
                    className="blud-card group cursor-pointer hover:scale-105 transition-all duration-300 h-full flex flex-col"
                  >
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 text-center">{workout.image}</div>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 group-hover:text-blud-red transition-colors line-clamp-2 text-center">
                      {workout.name}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 text-center">
                      {workout.description}
                    </p>
                    <div className="flex items-center justify-between text-xs sm:text-sm mt-auto">
                      <span className="text-gray-500">⏱️ {workout.duration} мин</span>
                      <span className="text-blud-red">🔥 {workout.calories} ккал</span>
                    </div>
                    {workout.completions && (
                      <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-500 text-center border-t border-blud-gray pt-1 sm:pt-2">
                        Выполнено {workout.completions} раз
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedWorkout && (
        <WorkoutModal 
          workout={selectedWorkout}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </section>
  )
}

export default PopularSlider