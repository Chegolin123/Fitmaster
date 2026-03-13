import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import WorkoutModal from './WorkoutModal'
import { workoutsDatabase } from '../data/workouts'

const Profile = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalTime: 0,
    totalCalories: 0,
    lastWorkout: null
  })
  const [recentWorkouts, setRecentWorkouts] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState('')
  const [avatarSuccess, setAvatarSuccess] = useState('')
  const [expandedAchievement, setExpandedAchievement] = useState(null)
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const achievementsData = [
    { 
      id: 1, 
      name: 'ПЕРВАЯ ТРЕНИРОВКА', 
      achieved: stats.totalWorkouts > 0, 
      icon: '🎯',
      description: 'Выполните свою первую тренировку',
      requirement: 'Завершить 1 тренировку'
    },
    { 
      id: 2, 
      name: '5 ТРЕНИРОВОК', 
      achieved: stats.totalWorkouts >= 5, 
      icon: '💪',
      description: 'Продержитесь 5 тренировок — это уже привычка!',
      requirement: 'Завершить 5 тренировок'
    },
    { 
      id: 3, 
      name: '10 ТРЕНИРОВОК', 
      achieved: stats.totalWorkouts >= 10, 
      icon: '🏆',
      description: 'Двузначное число! Вы официально в деле',
      requirement: 'Завершить 10 тренировок'
    },
    { 
      id: 4, 
      name: '1000 ККАЛ', 
      achieved: stats.totalCalories >= 1000, 
      icon: '🔥',
      description: 'Сожгите 1000 калорий — это около 4 часов тренировок',
      requirement: 'Сжечь 1000 калорий'
    },
    { 
      id: 5, 
      name: '5 ЧАСОВ', 
      achieved: stats.totalTime >= 300, 
      icon: '⏱️',
      description: 'Проведите 5 часов в тренировках',
      requirement: 'Накопить 300 минут тренировок'
    },
    { 
      id: 6, 
      name: 'МАРАФОНЕЦ', 
      achieved: stats.totalWorkouts >= 20, 
      icon: '🏃',
      description: '20 тренировок — вы настоящий марафонец!',
      requirement: 'Завершить 20 тренировок'
    },
    { 
      id: 7, 
      name: 'ЖЕЛЕЗНЫЙ ЧЕЛОВЕК', 
      achieved: stats.totalWorkouts >= 50, 
      icon: '⚡',
      description: '50 тренировок? Да вы железный!',
      requirement: 'Завершить 50 тренировок'
    },
    { 
      id: 8, 
      name: '5000 ККАЛ', 
      achieved: stats.totalCalories >= 5000, 
      icon: '🔥🔥',
      description: 'Сожгите 5000 калорий — это примерно 20 часов тренировок',
      requirement: 'Сжечь 5000 калорий'
    }
  ]

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    loadUserStats()
    loadAvatar()
    loadFavorites()
  }, [user, navigate])

  const loadAvatar = async () => {
    try {
      const data = await api.getAvatar()
      if (data.success && data.avatar_url) {
        setAvatar(data.avatar_url)
      }
    } catch (error) {
      console.error('Error loading avatar:', error)
    }
  }

  const loadFavorites = async () => {
    try {
      const data = await api.getFavorites()
      if (data.success) {
        setFavorites(data.favorites)
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }

  const loadUserStats = async () => {
    try {
      setLoading(true)
      const data = await api.getUserStats()
      
      if (data.success) {
        setStats({
          totalWorkouts: data.stats.total_workouts,
          totalTime: data.stats.total_duration,
          totalCalories: data.stats.total_calories,
          lastWorkout: data.stats.last_workout
        })
        setRecentWorkouts(data.recent_workouts || [])
      }
    } catch (err) {
      setError('Ошибка загрузки статистики')
      console.error('Error loading stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.match('image.*')) {
      setAvatarError('Пожалуйста, выберите изображение')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Файл слишком большой. Максимальный размер 5MB')
      return
    }

    setUploadingAvatar(true)
    setAvatarError('')
    setAvatarSuccess('')

    try {
      const data = await api.uploadAvatar(file)
      
      if (data.success) {
        setAvatar(data.avatar_url + '?t=' + new Date().getTime())
        setAvatarSuccess('Аватар успешно загружен!')
        
        const updatedUser = { ...user, avatar: data.avatar_url }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      } else {
        setAvatarError(data.message || 'Ошибка при загрузке аватара')
      }
    } catch (error) {
      setAvatarError('Ошибка при загрузке файла')
      console.error('Avatar upload error:', error)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleRemoveFavorite = async (workoutId) => {
    try {
      const data = await api.removeFromFavorites(workoutId)
      if (data.success) {
        setFavorites(favorites.filter(f => f.workout_id !== workoutId))
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  const handleWorkoutClick = (favorite) => {
    const fullWorkout = workoutsDatabase.find(w => w.id === favorite.workout_id)
    
    if (fullWorkout) {
      setSelectedWorkout(fullWorkout)
      setIsModalOpen(true)
    } else {
      console.error('Workout not found in database. ID:', favorite.workout_id)
      const fallbackWorkout = {
        id: favorite.workout_id,
        name: favorite.workout_name,
        image: favorite.workout_image || '💪',
        description: 'Подробная информация недоступна',
        duration: 30,
        calories: 200,
        difficulty: 'medium',
        equipment: [],
        muscles: [],
        exercises: [
          { name: 'Упражнение 1', sets: '3x10', rest: '60' }
        ]
      }
      setSelectedWorkout(fallbackWorkout)
      setIsModalOpen(true)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Нет данных'
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleAchievementHover = (id) => {
    setExpandedAchievement(id)
  }

  const handleAchievementLeave = () => {
    setExpandedAchievement(null)
  }

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-blud-black pt-24 flex items-center justify-center">
        <div className="text-4xl animate-pulse">💪</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blud-black pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-10 lg:pb-12">
      <div className="container-custom px-3 sm:px-4 lg:px-6">
        {/* Заголовок профиля - адаптивный */}
        <div className="relative mb-12 sm:mb-16 lg:mb-20">
          {/* Баннер */}
          <div className="h-32 sm:h-40 lg:h-48 rounded-lg overflow-hidden relative bg-gradient-to-r from-gray-800 to-gray-900">
            <div className="absolute inset-0 bg-gradient-to-r from-blud-black via-blud-black/50 to-transparent"></div>
          </div>

          {/* Аватар и информация - адаптивное позиционирование */}
          <div className="absolute -bottom-8 sm:-bottom-10 lg:-bottom-12 left-3 sm:left-4 lg:left-6 flex items-end space-x-3 sm:space-x-4 lg:space-x-6">
            {/* Аватар */}
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-2 sm:border-3 lg:border-4 border-blud-red bg-blud-gray overflow-hidden">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl bg-blud-gray">
                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>
              
              {/* Кнопка загрузки аватара */}
              <label className="absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 lg:-bottom-2 lg:-right-2 w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full bg-blud-red hover:bg-blud-red-dark cursor-pointer flex items-center justify-center transition-all duration-300 shadow-lg">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
                <span className="text-white text-xs sm:text-sm lg:text-base">✎</span>
              </label>
              
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 border-2 border-blud-red border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Имя пользователя */}
            <div className="mb-1 sm:mb-1.5 lg:mb-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{user.name || 'Пользователь'}</h1>
              <p className="text-xs sm:text-sm text-gray-400">{user.email || 'email@example.com'}</p>
              {user.role === 'admin' && (
                <span className="inline-block mt-0.5 sm:mt-1 text-[10px] sm:text-xs border border-blud-red px-1.5 sm:px-2 py-0.5 rounded">
                  АДМИНИСТРАТОР
                </span>
              )}
            </div>
          </div>

          {/* Кнопка выхода */}
          <button 
            onClick={onLogout}
            className="absolute bottom-0 right-0 blud-button py-1.5 px-3 sm:py-2 sm:px-4 lg:py-2.5 lg:px-5 text-xs sm:text-sm"
          >
            ВЫЙТИ
          </button>
        </div>

        {/* Сообщения об ошибках/успехе */}
        <div className="mt-16 sm:mt-20 lg:mt-24 mb-4 sm:mb-6">
          {avatarError && (
            <div className="p-2 sm:p-3 bg-blud-red/10 border border-blud-red text-blud-red rounded text-xs sm:text-sm">
              {avatarError}
            </div>
          )}
          {avatarSuccess && (
            <div className="p-2 sm:p-3 bg-green-500/10 border border-green-500 text-green-500 rounded text-xs sm:text-sm">
              {avatarSuccess}
            </div>
          )}
        </div>

        {/* Навигация по вкладкам - адаптивная */}
        <div className="border-b border-blud-gray overflow-x-auto scrollbar-hide">
          <nav className="flex space-x-4 sm:space-x-6 lg:space-x-8 min-w-max px-1">
            {['overview', 'favorites', 'history', 'achievements'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 sm:pb-3 lg:pb-4 px-2 sm:px-3 text-xs sm:text-sm uppercase tracking-wider transition-colors whitespace-nowrap
                  ${activeTab === tab 
                    ? 'text-blud-red border-b-2 border-blud-red font-bold' 
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                {tab === 'overview' && 'ОБЗОР'}
                {tab === 'favorites' && 'ПОНРАВИЛОСЬ'}
                {tab === 'history' && 'ИСТОРИЯ'}
                {tab === 'achievements' && 'ДОСТИЖЕНИЯ'}
              </button>
            ))}
          </nav>
        </div>

        {/* Контент вкладок - адаптивный */}
        <div className="py-4 sm:py-6 lg:py-8">
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-2 sm:p-3 rounded text-xs sm:text-sm">
                  {error}
                </div>
              )}

              {/* Статистика - адаптивная сетка */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="blud-card text-center p-3 sm:p-4">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blud-red">{stats.totalWorkouts}</div>
                  <div className="text-[10px] sm:text-xs text-gray-400 mt-1">ВСЕГО ТРЕНИРОВОК</div>
                </div>
                <div className="blud-card text-center p-3 sm:p-4">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blud-red">{stats.totalTime}</div>
                  <div className="text-[10px] sm:text-xs text-gray-400 mt-1">МИНУТ ТРЕНИРОВОК</div>
                </div>
                <div className="blud-card text-center p-3 sm:p-4 col-span-1 sm:col-span-2 lg:col-span-1">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blud-red">{stats.totalCalories}</div>
                  <div className="text-[10px] sm:text-xs text-gray-400 mt-1">СОЖЖЕНО ККАЛ</div>
                </div>
              </div>

              {/* Последняя тренировка */}
              {stats.lastWorkout && (
                <div className="blud-card p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-2">ПОСЛЕДНЯЯ ТРЕНИРОВКА</h3>
                  <p className="text-xs sm:text-sm text-gray-300">
                    {formatDate(stats.lastWorkout)}
                  </p>
                </div>
              )}

              {/* Недавние тренировки */}
              {recentWorkouts.length > 0 && (
                <div className="blud-card p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-3">НЕДАВНИЕ ТРЕНИРОВКИ</h3>
                  <div className="space-y-2">
                    {recentWorkouts.map((workout, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-blud-gray/50 rounded gap-2">
                        <div>
                          <p className="font-bold text-xs sm:text-sm">{workout.workout_name}</p>
                          <p className="text-[10px] sm:text-xs text-gray-400">
                            {formatDate(workout.completed_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-blud-red text-xs sm:text-sm">{workout.calories} ккал</p>
                          <p className="text-[10px] sm:text-xs text-gray-500">{workout.duration} мин</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Пустое состояние */}
              {stats.totalWorkouts === 0 && (
                <div className="blud-card text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-5xl lg:text-6xl mb-3">💪</div>
                  <p className="text-xs sm:text-sm text-gray-400">
                    У вас пока нет завершенных тренировок
                  </p>
                  <button
                    onClick={() => navigate('/workouts')}
                    className="blud-button mt-3 sm:mt-4 py-2 px-4 text-xs sm:text-sm"
                  >
                    НАЙТИ ТРЕНИРОВКУ
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-3">ПОНРАВИВШИЕСЯ ТРЕНИРОВКИ</h3>
              {favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favorites.map((fav) => (
                    <div 
                      key={fav.workout_id} 
                      className="blud-card p-3 sm:p-4 relative group hover:border-blud-red hover:scale-105 transition-all duration-300 cursor-pointer"
                      onClick={() => handleWorkoutClick(fav)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl sm:text-3xl">{fav.workout_image || '💪'}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-xs sm:text-sm hover:text-blud-red transition-colors">{fav.workout_name}</h4>
                          <p className="text-[10px] sm:text-xs text-gray-400">
                            {new Date(fav.created_at).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFavorite(fav.workout_id)
                        }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-blud-red transition-colors text-sm sm:text-base"
                        title="Убрать из избранного"
                      >
                        ❤️
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="blud-card text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-5xl lg:text-6xl mb-3">🤍</div>
                  <p className="text-xs sm:text-sm text-gray-400">
                    У вас пока нет понравившихся тренировок
                  </p>
                  <button
                    onClick={() => navigate('/workouts')}
                    className="blud-button mt-3 sm:mt-4 py-2 px-4 text-xs sm:text-sm"
                  >
                    НАЙТИ ТРЕНИРОВКУ
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-3">ИСТОРИЯ ТРЕНИРОВОК</h3>
              {recentWorkouts.length > 0 ? (
                <div className="space-y-2">
                  {recentWorkouts.map((workout, index) => (
                    <div key={index} className="blud-card p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm">{workout.workout_name}</h4>
                          <p className="text-[10px] sm:text-xs text-gray-400">
                            {formatDate(workout.completed_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-blud-red text-xs sm:text-sm">🔥 {workout.calories} ккал</p>
                          <p className="text-[10px] sm:text-xs text-gray-500">⏱️ {workout.duration} мин</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8 text-xs sm:text-sm">
                  История тренировок пуста
                </p>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-3">ДОСТИЖЕНИЯ</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {achievementsData.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`
                      blud-card p-3 sm:p-4 transition-all duration-300 relative overflow-hidden cursor-pointer
                      ${achievement.achieved 
                        ? 'border-blud-red' 
                        : 'opacity-50 grayscale hover:opacity-70'
                      }
                      ${expandedAchievement === achievement.id ? 'sm:row-span-2' : ''}
                    `}
                    onMouseEnter={() => handleAchievementHover(achievement.id)}
                    onMouseLeave={handleAchievementLeave}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="text-2xl sm:text-3xl">{achievement.icon}</div>
                      <div className="font-bold text-[10px] sm:text-xs">{achievement.name}</div>
                      {achievement.achieved && (
                        <div className="ml-auto text-blud-red text-sm sm:text-base">✓</div>
                      )}
                    </div>

                    <div 
                      className={`
                        transition-all duration-300 overflow-hidden
                        ${expandedAchievement === achievement.id ? 'max-h-32 opacity-100 mt-2' : 'max-h-0 opacity-0'}
                      `}
                    >
                      <div className="border-t border-blud-gray pt-2">
                        <p className="text-[10px] sm:text-xs text-gray-300 mb-1">
                          {achievement.description}
                        </p>
                        <div className="text-[8px] sm:text-[10px] text-blud-red font-mono">
                          {achievement.requirement}
                        </div>
                        {!achievement.achieved && (
                          <div className="mt-1 text-[8px] sm:text-[10px] text-gray-500">
                            Прогресс: {
                              achievement.id === 1 ? stats.totalWorkouts + '/1' :
                              achievement.id === 2 ? stats.totalWorkouts + '/5' :
                              achievement.id === 3 ? stats.totalWorkouts + '/10' :
                              achievement.id === 4 ? stats.totalCalories + '/1000' :
                              achievement.id === 5 ? stats.totalTime + '/300' :
                              achievement.id === 6 ? stats.totalWorkouts + '/20' :
                              achievement.id === 7 ? stats.totalWorkouts + '/50' :
                              achievement.id === 8 ? stats.totalCalories + '/5000' : ''
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно */}
      {isModalOpen && selectedWorkout && (
        <WorkoutModal 
          workout={selectedWorkout}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedWorkout(null)
          }}
        />
      )}
    </div>
  )
}

export default Profile