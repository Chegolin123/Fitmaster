import React, { useState } from 'react'
import api from '../services/api'

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  if (!isOpen) return null

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
    setServerError('')
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email обязателен'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Неверный формат email'
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть минимум 6 символов'
    }

    if (!isLogin) {
      if (!formData.nickname) {
        newErrors.nickname = 'Никнейм обязателен'
      } else if (formData.nickname.length < 3) {
        newErrors.nickname = 'Никнейм должен быть минимум 3 символа'
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.nickname)) {
        newErrors.nickname = 'Никнейм может содержать только буквы, цифры и подчеркивание'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setServerError('')

    try {
      let response
      
      if (isLogin) {
        response = await api.login({
          email: formData.email,
          password: formData.password
        })
      } else {
        response = await api.register({
          nickname: formData.nickname,
          email: formData.email,
          password: formData.password
        })
      }

      console.log('Auth response:', response)

      if (response.user) {
        localStorage.setItem('token', response.user.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        onLoginSuccess(response.user)
        onClose()
        setFormData({
          nickname: '',
          email: '',
          password: '',
          confirmPassword: ''
        })
      } else {
        // Проверяем специфические ошибки от сервера
        if (response.message) {
          if (response.message.includes('Email уже зарегистрирован')) {
            setErrors(prev => ({ ...prev, email: 'Этот email уже используется' }))
          } else if (response.message.includes('Никнейм уже занят')) {
            setErrors(prev => ({ ...prev, nickname: 'Этот никнейм уже занят' }))
          } else {
            setServerError(response.message)
          }
        } else {
          setServerError('Неверный ответ от сервера')
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      
      // Проверяем ошибки от сервера
      if (error.message) {
        if (error.message.includes('Email уже зарегистрирован')) {
          setErrors(prev => ({ ...prev, email: 'Этот email уже используется' }))
        } else if (error.message.includes('Никнейм уже занят')) {
          setErrors(prev => ({ ...prev, nickname: 'Этот никнейм уже занят' }))
        } else {
          setServerError(error.message)
        }
      } else {
        setServerError('Ошибка подключения к серверу')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setServerError('')
    setFormData({
      nickname: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-blud-gray border border-blud-red/20 rounded-lg w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-blud-gray">
          <h2 className="text-2xl font-bold tracking-[0.15em]">
            <span className="text-blud-red">FIT</span>MASTER
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {isLogin ? 'Вход в систему' : 'Создание аккаунта'}
          </p>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
                Придумайте никнейм
              </label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className={`blud-input w-full ${errors.nickname ? 'border-blud-red' : ''}`}
                placeholder="nickname123"
              />
              {errors.nickname && (
                <p className="text-blud-red text-xs mt-1">{errors.nickname}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`blud-input w-full ${errors.email ? 'border-blud-red' : ''}`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-blud-red text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
              Пароль
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`blud-input w-full ${errors.password ? 'border-blud-red' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-blud-red text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
                Подтверждение пароля
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`blud-input w-full ${errors.confirmPassword ? 'border-blud-red' : ''}`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-blud-red text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {serverError && (
            <div className="bg-blud-red/10 border border-blud-red text-blud-red p-3 rounded text-sm">
              {serverError}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="blud-button w-full mt-6 relative"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {isLogin ? 'ВХОД...' : 'РЕГИСТРАЦИЯ...'}
              </span>
            ) : (
              isLogin ? 'ВОЙТИ' : 'ЗАРЕГИСТРИРОВАТЬСЯ'
            )}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={toggleMode}
              className="text-gray-400 hover:text-blud-red text-sm transition-colors"
            >
              {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
            </button>
          </div>
        </form>

        <div className="px-6 pb-6">
          <div className="blud-divider"></div>
          <p className="text-xs text-gray-500 text-center">
            Входя в систему, вы соглашаетесь с нашими условиями использования
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthModal