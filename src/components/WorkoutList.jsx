import React, { useState, useEffect } from 'react'
import { workoutsDatabase } from '../data/workouts'
import WorkoutModal from './WorkoutModal'

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

const WorkoutList = ({ selectedEquipment, selectedMuscles }) => {
  const [expandedId, setExpandedId] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleWorkoutClick = (workout) => {
    setSelectedWorkout(workout)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedWorkout(null)
  }

  const filteredWorkouts = workoutsDatabase.filter(workout => {
    const hasEquipment = workout.equipment.some(eq => 
      selectedEquipment.includes(eq) || (selectedEquipment.includes('none') && eq === 'none')
    )
    
    const hasMuscles = selectedMuscles.includes('fullbody') 
      ? true
      : workout.muscles.some(muscle => selectedMuscles.includes(muscle))
    
    return hasEquipment && hasMuscles
  })

  if (filteredWorkouts.length === 0) {
    return (
      <div className={`text-center py-12 sm:py-16 border border-blud-gray bg-black/60 backdrop-blur-sm rounded-lg transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-5xl sm:text-6xl mb-4">⚠️</div>
        <p className="text-blud-red uppercase tracking-wider text-xs sm:text-sm mb-2">
          НЕТ ПОДХОДЯЩИХ ТРЕНИРОВОК
        </p>
        <p className="text-gray-300 text-[10px] sm:text-xs">
          Измени параметры выбора и нажми "Найти тренировки"
        </p>
      </div>
    )
  }

  return (
    <>
      <div className={`mt-12 sm:mt-16 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight text-white text-shadow">
            <span className="text-blud-red">{filteredWorkouts.length}</span> ТРЕНИРОВОК ДОСТУПНО
          </h2>
          <div className="blud-tag border-blud-red/50 self-start sm:self-auto">
            ПО РЕЛЕВАНТНОСТИ ↓
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {filteredWorkouts.map((workout, index) => (
            <div 
              key={workout.id} 
              className="bg-blud-gray/90 backdrop-blur-sm border border-blud-gray p-4 sm:p-5 md:p-6 overflow-hidden transition-all duration-500 hover:border-blud-red hover:shadow-2xl rounded-lg cursor-pointer"
              style={{ 
                transitionDelay: `${index * 100}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
              }}
              onClick={() => handleWorkoutClick(workout)}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="text-3xl sm:text-4xl">{workout.image}</div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 text-white">{workout.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <span className="text-gray-300">{workout.duration} МИН</span>
                      <span className="text-blud-red">🔥 {workout.calories} ККАЛ</span>
                      <span className="blud-tag border-blud-red/50 text-gray-200">
                        {workout.difficulty === 'easy' ? 'НАЧАЛЬНЫЙ' : 
                         workout.difficulty === 'medium' ? 'СРЕДНИЙ' : 'ПРОДВИНУТЫЙ'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 text-xs sm:text-sm mt-2 sm:mt-3">
                {workout.description}
              </p>

              <div className="mt-2 sm:mt-3 flex flex-wrap gap-1">
                {workout.equipment.map(eq => (
                  <span key={eq} className="text-[10px] sm:text-xs bg-blud-gray/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-blud-gray">
                    {translateEquipment(eq)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedWorkout && (
        <WorkoutModal 
          workout={selectedWorkout}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}

export default WorkoutList