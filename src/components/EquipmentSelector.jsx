import React from 'react'

const equipmentOptions = [
  { id: 'none', label: 'БЕЗ ОБОРУДОВАНИЯ', icon: '⛓️', description: 'Только вес тела', color: 'gray' },
  { id: 'dumbbells', label: 'ГАНТЕЛИ', icon: '🏋️', description: 'Разборные или фиксированные', color: 'blue' },
  { id: 'kettlebell', label: 'ГИРЯ', icon: '⚖️', description: 'Одна или несколько', color: 'green' },
  { id: 'bands', label: 'РЕЗИНКИ', icon: '🔄', description: 'Эспандеры разной жесткости', color: 'yellow' },
  { id: 'pullup-bar', label: 'ТУРНИК', icon: '⬆️', description: 'Турник, брусья', color: 'purple' },
  { id: 'bench', label: 'СКАМЬЯ', icon: '🪑', description: 'Регулируемая или горизонтальная', color: 'indigo' },
  { id: 'rope', label: 'СКАКАЛКА', icon: '🪢', description: 'Для кардио', color: 'pink' },
  { id: 'fitball', label: 'ФИТБОЛ', icon: '⚽', description: 'Мяч для упражнений', color: 'orange' },
]

const muscleGroups = [
  { id: 'chest', label: 'ГРУДЬ', icon: '💪' },
  { id: 'back', label: 'СПИНА', icon: '🔱' },
  { id: 'legs', label: 'НОГИ', icon: '🦵' },
  { id: 'shoulders', label: 'ПЛЕЧИ', icon: '🏔️' },
  { id: 'arms', label: 'РУКИ', icon: '💪' },
  { id: 'abs', label: 'ПРЕСС', icon: '🔥' },
  { id: 'cardio', label: 'КАРДИО', icon: '❤️' },
  { id: 'fullbody', label: 'ВСЕ ТЕЛО', icon: '⚡' },
]

const EquipmentSelector = ({ selectedEquipment, onEquipmentChange, selectedMuscles, onMuscleChange }) => {
  
  const toggleEquipment = (id) => {
    if (id === 'none') {
      onEquipmentChange(['none'])
    } else {
      let newSelection
      if (selectedEquipment.includes(id)) {
        newSelection = selectedEquipment.filter(item => item !== id)
        if (newSelection.length === 0) newSelection = ['none']
        if (newSelection.includes('none') && newSelection.length > 1) {
          newSelection = newSelection.filter(item => item !== 'none')
        }
      } else {
        newSelection = [...selectedEquipment.filter(item => item !== 'none'), id]
      }
      onEquipmentChange(newSelection)
    }
  }

  const toggleMuscle = (id) => {
    if (id === 'fullbody') {
      onMuscleChange(['fullbody'])
    } else {
      let newSelection
      if (selectedMuscles.includes(id)) {
        newSelection = selectedMuscles.filter(item => item !== id)
      } else {
        newSelection = [...selectedMuscles.filter(item => item !== 'fullbody'), id]
      }
      onMuscleChange(newSelection.length ? newSelection : ['fullbody'])
    }
  }

  return (
    <div className="space-y-8 sm:space-y-12 lg:space-y-16 relative z-10">
      {/* Equipment section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight text-white text-shadow">
            <span className="text-blud-red">01.</span> ОБОРУДОВАНИЕ
          </h2>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {selectedEquipment.map(id => {
              const eq = equipmentOptions.find(e => e.id === id)
              return eq && (
                <span key={id} className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border border-blud-red/50 bg-black/50 backdrop-blur-sm flex items-center justify-center text-xs sm:text-sm text-white rounded">
                  {eq.icon}
                </span>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {equipmentOptions.map((eq) => {
            const isSelected = selectedEquipment.includes(eq.id)
            return (
              <button
                key={eq.id}
                onClick={() => toggleEquipment(eq.id)}
                className={`
                  blud-card text-left transition-all p-3 sm:p-4 md:p-5 lg:p-6
                  ${isSelected ? 'border-blud-red bg-blud-red/20' : 'bg-blud-gray/80 backdrop-blur-sm'}
                `}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">{eq.icon}</div>
                <div className={`font-bold text-xs sm:text-sm mb-0.5 sm:mb-1 ${isSelected ? 'text-blud-red' : 'text-white'}`}>
                  {eq.label}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-300 line-clamp-2">
                  {eq.description}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Muscles section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight text-white text-shadow">
            <span className="text-blud-red">02.</span> МЫШЕЧНЫЕ ГРУППЫ
          </h2>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {selectedMuscles.map(id => {
              const muscle = muscleGroups.find(m => m.id === id)
              return muscle && (
                <span key={id} className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border border-blud-red/50 bg-black/50 backdrop-blur-sm flex items-center justify-center text-xs sm:text-sm text-white rounded">
                  {muscle.icon}
                </span>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
          {muscleGroups.map((muscle) => {
            const isSelected = selectedMuscles.includes(muscle.id)
            return (
              <button
                key={muscle.id}
                onClick={() => toggleMuscle(muscle.id)}
                className={`
                  blud-card-light text-center p-2 sm:p-3 md:p-4
                  ${isSelected ? 'border-blud-red bg-blud-red/20' : 'bg-blud-gray/80 backdrop-blur-sm'}
                `}
              >
                <div className="text-xl sm:text-2xl md:text-3xl mb-1">{muscle.icon}</div>
                <div className={`text-[10px] sm:text-xs font-bold ${isSelected ? 'text-blud-red' : 'text-white'}`}>
                  {muscle.label}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default EquipmentSelector