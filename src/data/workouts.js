// Общая база данных тренировок (40 штук)
export const workoutsDatabase = [
  // === ГРУДЬ (CHEST) ===
  {
    id: 1,
    name: 'ЖИМ ГАНТЕЛЕЙ НА НАКЛОННОЙ СКАМЬЕ',
    category: 'chest',
    difficulty: 'medium',
    duration: 35,
    calories: 280,
    equipment: ['dumbbells', 'bench'],
    muscles: ['chest', 'shoulders'],
    image: '🏋️',
    description: 'Классическое упражнение для верхней части груди',
    exercises: [
      { name: 'Жим гантелей под углом 30°', sets: '4x12', rest: '60' },
      { name: 'Сведение гантелей лежа', sets: '3x15', rest: '45' },
      { name: 'Отжимания от скамьи', sets: '3x12', rest: '45' },
    ]
  },
  {
    id: 2,
    name: 'КРОССОВЕР В БЛОЧНОМ ТРЕНАЖЕРЕ',
    category: 'chest',
    difficulty: 'medium',
    duration: 30,
    calories: 220,
    equipment: ['crossover'],
    muscles: ['chest'],
    image: '🔄',
    description: 'Изолированная работа на внутреннюю часть груди',
    exercises: [
      { name: 'Сведение рук стоя', sets: '4x15', rest: '45' },
      { name: 'Сведение рук лежа на скамье', sets: '3x12', rest: '45' },
    ]
  },
  {
    id: 3,
    name: 'ОТЖИМАНИЯ НА БРУСЬЯХ',
    category: 'chest',
    difficulty: 'hard',
    duration: 25,
    calories: 200,
    equipment: ['parallel-bars'],
    muscles: ['chest', 'triceps'],
    image: '⬇️',
    description: 'Базовое упражнение для нижней части груди',
    exercises: [
      { name: 'Отжимания на брусьях', sets: '4x10', rest: '90' },
      { name: 'Отжимания с весом', sets: '3x8', rest: '90' },
    ]
  },
  {
    id: 4,
    name: 'ПУЛЛОВЕР С ГАНТЕЛЬЮ',
    category: 'chest',
    difficulty: 'easy',
    duration: 20,
    calories: 150,
    equipment: ['dumbbells', 'bench'],
    muscles: ['chest', 'back'],
    image: '⬆️',
    description: 'Растяжка и развитие грудной клетки',
    exercises: [
      { name: 'Пулловер лежа', sets: '3x15', rest: '45' },
    ]
  },
  {
    id: 5,
    name: 'ЖИМ ШТАНГИ ЛЕЖА',
    category: 'chest',
    difficulty: 'hard',
    duration: 40,
    calories: 320,
    equipment: ['barbell', 'bench'],
    muscles: ['chest', 'triceps'],
    image: '🏋️',
    description: 'Классика для массы и силы груди',
    exercises: [
      { name: 'Жим штанги', sets: '5x5', rest: '120' },
      { name: 'Жим под углом', sets: '4x8', rest: '90' },
    ]
  },

  // === СПИНА (BACK) ===
  {
    id: 6,
    name: 'ПОДТЯГИВАНИЯ ШИРОКИМ ХВАТОМ',
    category: 'back',
    difficulty: 'hard',
    duration: 30,
    calories: 250,
    equipment: ['pullup-bar'],
    muscles: ['back', 'biceps'],
    image: '⬆️',
    description: 'База для ширины спины',
    exercises: [
      { name: 'Подтягивания', sets: '5x8', rest: '90' },
      { name: 'Подтягивания за голову', sets: '3x8', rest: '90' },
    ]
  },
  {
    id: 7,
    name: 'ТЯГА ГАНТЕЛИ В НАКЛОНЕ',
    category: 'back',
    difficulty: 'medium',
    duration: 35,
    calories: 260,
    equipment: ['dumbbells', 'bench'],
    muscles: ['back'],
    image: '⬇️',
    description: 'Проработка широчайших мышц',
    exercises: [
      { name: 'Тяга гантели', sets: '4x12', rest: '60' },
      { name: 'Тяга двумя руками', sets: '3x12', rest: '60' },
    ]
  },
  {
    id: 8,
    name: 'СТАНОВАЯ ТЯГА',
    category: 'back',
    difficulty: 'hard',
    duration: 40,
    calories: 350,
    equipment: ['barbell'],
    muscles: ['back', 'legs'],
    image: '🏋️',
    description: 'Король упражнений для всей спины',
    exercises: [
      { name: 'Становая тяга', sets: '5x5', rest: '120' },
      { name: 'Румынская тяга', sets: '3x8', rest: '90' },
    ]
  },
  {
    id: 9,
    name: 'ТЯГА ВЕРХНЕГО БЛОКА',
    category: 'back',
    difficulty: 'easy',
    duration: 30,
    calories: 200,
    equipment: ['cable'],
    muscles: ['back'],
    image: '⬆️',
    description: 'Альтернатива подтягиваниям',
    exercises: [
      { name: 'Тяга к груди', sets: '4x12', rest: '60' },
      { name: 'Тяга за голову', sets: '3x12', rest: '60' },
    ]
  },
  {
    id: 10,
    name: 'ГИПЕРЭКСТЕНЗИЯ',
    category: 'back',
    difficulty: 'easy',
    duration: 20,
    calories: 130,
    equipment: ['hyperextension'],
    muscles: ['back'],
    image: '⬇️',
    description: 'Укрепление мышц поясницы',
    exercises: [
      { name: 'Гиперэкстензия', sets: '3x15', rest: '45' },
    ]
  },

  // === НОГИ (LEGS) ===
  {
    id: 11,
    name: 'ПРИСЕДАНИЯ СО ШТАНГОЙ',
    category: 'legs',
    difficulty: 'hard',
    duration: 45,
    calories: 400,
    equipment: ['barbell', 'rack'],
    muscles: ['legs'],
    image: '🏋️',
    description: 'Лучшее упражнение для ног',
    exercises: [
      { name: 'Приседания', sets: '5x5', rest: '120' },
      { name: 'Фронтальные приседания', sets: '3x8', rest: '90' },
    ]
  },
  {
    id: 12,
    name: 'РУМЫНСКАЯ ТЯГА',
    category: 'legs',
    difficulty: 'medium',
    duration: 35,
    calories: 280,
    equipment: ['dumbbells', 'barbell'],
    muscles: ['legs'],
    image: '⬇️',
    description: 'Акцент на бицепс бедра',
    exercises: [
      { name: 'Румынская тяга', sets: '4x10', rest: '90' },
    ]
  },
  {
    id: 13,
    name: 'ВЫПАДЫ С ГАНТЕЛЯМИ',
    category: 'legs',
    difficulty: 'medium',
    duration: 30,
    calories: 250,
    equipment: ['dumbbells'],
    muscles: ['legs'],
    image: '🚶',
    description: 'Функциональное упражнение для ног',
    exercises: [
      { name: 'Выпады вперед', sets: '3x12', rest: '60' },
      { name: 'Выпады назад', sets: '3x12', rest: '60' },
    ]
  },
  {
    id: 14,
    name: 'ЖИМ НОГАМИ',
    category: 'legs',
    difficulty: 'medium',
    duration: 30,
    calories: 240,
    equipment: ['leg-press'],
    muscles: ['legs'],
    image: '⬇️',
    description: 'Изолированная работа на квадрицепсы',
    exercises: [
      { name: 'Жим ногами', sets: '4x15', rest: '60' },
    ]
  },
  {
    id: 15,
    name: 'ПОДЪЕМ НА НОСКИ СТОЯ',
    category: 'legs',
    difficulty: 'easy',
    duration: 20,
    calories: 120,
    equipment: ['smith'],
    muscles: ['legs'],
    image: '🦶',
    description: 'Тренировка икроножных мышц',
    exercises: [
      { name: 'Подъем на носки', sets: '4x20', rest: '45' },
    ]
  },

  // === ПЛЕЧИ (SHOULDERS) ===
  {
    id: 16,
    name: 'ЖИМ ГАНТЕЛЕЙ СИДЯ',
    category: 'shoulders',
    difficulty: 'medium',
    duration: 30,
    calories: 220,
    equipment: ['dumbbells', 'bench'],
    muscles: ['shoulders'],
    image: '⬆️',
    description: 'База для передних и средних дельт',
    exercises: [
      { name: 'Жим гантелей', sets: '4x12', rest: '60' },
      { name: 'Жим Арнольда', sets: '3x10', rest: '60' },
    ]
  },
  {
    id: 17,
    name: 'МАХИ ГАНТЕЛЯМИ В СТОРОНЫ',
    category: 'shoulders',
    difficulty: 'medium',
    duration: 25,
    calories: 180,
    equipment: ['dumbbells'],
    muscles: ['shoulders'],
    image: '↔️',
    description: 'Изоляция средних дельт',
    exercises: [
      { name: 'Махи в стороны', sets: '4x15', rest: '45' },
    ]
  },
  {
    id: 18,
    name: 'ТЯГА ШТАНГИ К ПОДБОРОДКУ',
    category: 'shoulders',
    difficulty: 'medium',
    duration: 25,
    calories: 190,
    equipment: ['barbell'],
    muscles: ['shoulders'],
    image: '⬆️',
    description: 'Работа на передние и средние дельты',
    exercises: [
      { name: 'Тяга к подбородку', sets: '4x12', rest: '60' },
    ]
  },
  {
    id: 19,
    name: 'РАЗВЕДЕНИЕ ГАНТЕЛЕЙ В НАКЛОНЕ',
    category: 'shoulders',
    difficulty: 'easy',
    duration: 25,
    calories: 160,
    equipment: ['dumbbells', 'bench'],
    muscles: ['shoulders'],
    image: '↘️',
    description: 'Тренировка задних дельт',
    exercises: [
      { name: 'Разведение в наклоне', sets: '4x15', rest: '45' },
    ]
  },
  {
    id: 20,
    name: 'ШРАГИ С ГАНТЕЛЯМИ',
    category: 'shoulders',
    difficulty: 'easy',
    duration: 20,
    calories: 140,
    equipment: ['dumbbells'],
    muscles: ['shoulders'],
    image: '⬆️',
    description: 'Укрепление трапеций',
    exercises: [
      { name: 'Шраги', sets: '4x15', rest: '45' },
    ]
  },

  // === РУКИ (ARMS) ===
  {
    id: 21,
    name: 'ПОДЪЕМ ШТАНГИ НА БИЦЕПС',
    category: 'arms',
    difficulty: 'medium',
    duration: 25,
    calories: 160,
    equipment: ['barbell'],
    muscles: ['arms'],
    image: '💪',
    description: 'Классика для бицепса',
    exercises: [
      { name: 'Подъем штанги', sets: '4x10', rest: '60' },
      { name: 'Подъем обратным хватом', sets: '3x10', rest: '60' },
    ]
  },
  {
    id: 22,
    name: 'ФРАНЦУЗСКИЙ ЖИМ',
    category: 'arms',
    difficulty: 'medium',
    duration: 25,
    calories: 150,
    equipment: ['barbell', 'bench'],
    muscles: ['arms'],
    image: '↘️',
    description: 'Изоляция трицепса',
    exercises: [
      { name: 'Французский жим', sets: '4x12', rest: '60' },
    ]
  },
  {
    id: 23,
    name: 'МОЛОТКИ С ГАНТЕЛЯМИ',
    category: 'arms',
    difficulty: 'easy',
    duration: 20,
    calories: 130,
    equipment: ['dumbbells'],
    muscles: ['arms'],
    image: '🔨',
    description: 'Проработка брахиалиса',
    exercises: [
      { name: 'Молотки', sets: '4x12', rest: '45' },
    ]
  },
  {
    id: 24,
    name: 'ОТЖИМАНИЯ УЗКИМ ХВАТОМ',
    category: 'arms',
    difficulty: 'easy',
    duration: 20,
    calories: 140,
    equipment: ['none'],
    muscles: ['arms', 'chest'],
    image: '⬇️',
    description: 'Трицепс с собственным весом',
    exercises: [
      { name: 'Отжимания узким хватом', sets: '4x15', rest: '45' },
    ]
  },
  {
    id: 25,
    name: 'РАЗГИБАНИЕ РУК НА БЛОКЕ',
    category: 'arms',
    difficulty: 'easy',
    duration: 20,
    calories: 120,
    equipment: ['cable'],
    muscles: ['arms'],
    image: '⬇️',
    description: 'Изоляция трицепса',
    exercises: [
      { name: 'Разгибание на блоке', sets: '4x15', rest: '45' },
    ]
  },

  // === ПРЕСС (ABS) ===
  {
    id: 26,
    name: 'СКРУЧИВАНИЯ НА ПРЕСС',
    category: 'abs',
    difficulty: 'easy',
    duration: 20,
    calories: 130,
    equipment: ['none'],
    muscles: ['abs'],
    image: '⬆️',
    description: 'Классика для верхнего пресса',
    exercises: [
      { name: 'Скручивания', sets: '3x20', rest: '30' },
    ]
  },
  {
    id: 27,
    name: 'ПЛАНКА',
    category: 'abs',
    difficulty: 'medium',
    duration: 15,
    calories: 100,
    equipment: ['none'],
    muscles: ['abs'],
    image: '⏱️',
    description: 'Статика для кора',
    exercises: [
      { name: 'Планка', sets: '3x60 сек', rest: '30' },
      { name: 'Боковая планка', sets: '3x45 сек', rest: '30' },
    ]
  },
  {
    id: 28,
    name: 'ПОДЪЕМ НОГ В ВИСЕ',
    category: 'abs',
    difficulty: 'hard',
    duration: 20,
    calories: 150,
    equipment: ['pullup-bar'],
    muscles: ['abs'],
    image: '⬆️',
    description: 'Проработка нижнего пресса',
    exercises: [
      { name: 'Подъем ног', sets: '3x15', rest: '45' },
    ]
  },
  {
    id: 29,
    name: 'ВЕЛОСИПЕД',
    category: 'abs',
    difficulty: 'easy',
    duration: 15,
    calories: 110,
    equipment: ['none'],
    muscles: ['abs'],
    image: '🚲',
    description: 'Динамика для косых мышц',
    exercises: [
      { name: 'Велосипед', sets: '3x20', rest: '30' },
    ]
  },
  {
    id: 30,
    name: 'РУССКИЙ ТВИСТ',
    category: 'abs',
    difficulty: 'medium',
    duration: 15,
    calories: 120,
    equipment: ['none', 'dumbbells'],
    muscles: ['abs'],
    image: '🔄',
    description: 'Косые мышцы живота',
    exercises: [
      { name: 'Русский твист', sets: '3x20', rest: '30' },
    ]
  },

  // === КАРДИО (CARDIO) ===
  {
    id: 31,
    name: 'БЕГ НА ДОРОЖКЕ',
    category: 'cardio',
    difficulty: 'easy',
    duration: 30,
    calories: 300,
    equipment: ['treadmill'],
    muscles: ['cardio', 'legs'],
    image: '🏃',
    description: 'Интервальный бег',
    exercises: [
      { name: 'Разминка', sets: '5 мин' },
      { name: 'Бег 8 км/ч', sets: '10 мин' },
      { name: 'Бег 10 км/ч', sets: '10 мин' },
      { name: 'Заминка', sets: '5 мин' },
    ]
  },
  {
    id: 32,
    name: 'ВЕЛОТРЕНАЖЕР',
    category: 'cardio',
    difficulty: 'easy',
    duration: 30,
    calories: 280,
    equipment: ['bike'],
    muscles: ['cardio', 'legs'],
    image: '🚴',
    description: 'Интервалы на велосипеде',
    exercises: [
      { name: 'Разминка', sets: '5 мин' },
      { name: 'Спринт', sets: '30 сек x10', rest: '30' },
    ]
  },
  {
    id: 33,
    name: 'СКАКАЛКА',
    category: 'cardio',
    difficulty: 'medium',
    duration: 20,
    calories: 250,
    equipment: ['rope'],
    muscles: ['cardio'],
    image: '🪢',
    description: 'Интенсивное кардио',
    exercises: [
      { name: 'Прыжки', sets: '1 мин x10', rest: '15' },
    ]
  },
  {
    id: 34,
    name: 'БЁРПИ',
    category: 'cardio',
    difficulty: 'hard',
    duration: 15,
    calories: 200,
    equipment: ['none'],
    muscles: ['cardio', 'fullbody'],
    image: '⬇️⬆️',
    description: 'Взрывные движения',
    exercises: [
      { name: 'Бёрпи', sets: '15x5', rest: '30' },
    ]
  },
  {
    id: 35,
    name: 'ЭЛЛИПС',
    category: 'cardio',
    difficulty: 'easy',
    duration: 30,
    calories: 270,
    equipment: ['elliptical'],
    muscles: ['cardio', 'legs'],
    image: '🏃',
    description: 'Низкоударное кардио',
    exercises: [
      { name: 'Равномерный темп', sets: '30 мин' },
    ]
  },

  // === FULLBODY ===
  {
    id: 36,
    name: 'КРУГОВАЯ ТРЕНИРОВКА',
    category: 'fullbody',
    difficulty: 'hard',
    duration: 40,
    calories: 400,
    equipment: ['dumbbells'],
    muscles: ['fullbody'],
    image: '🔄',
    description: '5 упражнений в 4 круга',
    exercises: [
      { name: 'Приседания', sets: '15' },
      { name: 'Жим гантелей', sets: '12' },
      { name: 'Тяга в наклоне', sets: '12' },
      { name: 'Махи гантелями', sets: '15' },
      { name: 'Скручивания', sets: '20' },
    ]
  },
  {
    id: 37,
    name: 'ФУНКЦИОНАЛЬНЫЙ ТРЕНИНГ',
    category: 'fullbody',
    difficulty: 'medium',
    duration: 35,
    calories: 320,
    equipment: ['kettlebell'],
    muscles: ['fullbody'],
    image: '⚖️',
    description: 'Работа с гирей',
    exercises: [
      { name: 'Махи гирей', sets: '20' },
      { name: 'Приседания с гирей', sets: '15' },
      { name: 'Рывок гирей', sets: '10' },
    ]
  },
  {
    id: 38,
    name: 'КРОССФИТ WOD',
    category: 'fullbody',
    difficulty: 'hard',
    duration: 25,
    calories: 350,
    equipment: ['none'],
    muscles: ['fullbody'],
    image: '⚡',
    description: 'Максимальная интенсивность',
    exercises: [
      { name: 'Бёрпи', sets: '15' },
      { name: 'Воздушные приседания', sets: '20' },
      { name: 'Отжимания', sets: '15' },
      { name: 'Сит-апы', sets: '20' },
      { name: '3 раунда на время' },
    ]
  },
  {
    id: 39,
    name: 'ТРЕНИРОВКА С РЕЗИНКАМИ',
    category: 'fullbody',
    difficulty: 'easy',
    duration: 30,
    calories: 240,
    equipment: ['bands'],
    muscles: ['fullbody'],
    image: '🔄',
    description: 'Все тело с эспандерами',
    exercises: [
      { name: 'Приседания с резинкой', sets: '15' },
      { name: 'Тяга резинки', sets: '15' },
      { name: 'Жим резинки', sets: '15' },
    ]
  },
  {
    id: 40,
    name: 'STRETCHING',
    category: 'fullbody',
    difficulty: 'easy',
    duration: 20,
    calories: 100,
    equipment: ['none', 'mat'],
    muscles: ['fullbody'],
    image: '🧘',
    description: 'Растяжка всего тела',
    exercises: [
      { name: 'Выпады с растяжкой', sets: '30 сек' },
      { name: 'Складка', sets: '30 сек' },
      { name: 'Бабочка', sets: '30 сек' },
      { name: 'Кошка', sets: '30 сек' },
    ]
  }
]

// Вспомогательные функции для работы с тренировками
export const getWorkoutsByCategory = (category) => {
  if (category === 'all') return workoutsDatabase
  return workoutsDatabase.filter(w => w.category === category)
}

export const getWorkoutsByDifficulty = (difficulty) => {
  if (difficulty === 'all') return workoutsDatabase
  return workoutsDatabase.filter(w => w.difficulty === difficulty)
}

export const getWorkoutsByMuscles = (muscles) => {
  if (!muscles || muscles.length === 0) return workoutsDatabase
  return workoutsDatabase.filter(w => 
    w.muscles.some(m => muscles.includes(m))
  )
}

export const getWorkoutsByEquipment = (equipment) => {
  if (!equipment || equipment.length === 0) return workoutsDatabase
  return workoutsDatabase.filter(w =>
    w.equipment.some(e => equipment.includes(e))
  )
}

export const searchWorkouts = (term) => {
  if (!term) return workoutsDatabase
  const searchLower = term.toLowerCase()
  return workoutsDatabase.filter(w =>
    w.name.toLowerCase().includes(searchLower) ||
    w.description.toLowerCase().includes(searchLower)
  )
}