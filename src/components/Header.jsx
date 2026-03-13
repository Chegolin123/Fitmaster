import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthModal from './AuthModal'
import AdminPanel from './AdminPanel'
import api from '../services/api'

const Header = ({ resetFilters, user, onLoginSuccess, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogoClick = () => {
    if (resetFilters) {
      resetFilters()
    }
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const handleLogoutClick = () => {
    onLogout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-blud-black/95 border-b border-blud-gray' : 'bg-transparent'
      }`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4 sm:space-x-8">
              <h1 
                onClick={handleLogoClick}
                className="text-xl sm:text-2xl font-black tracking-tighter cursor-pointer"
              >
                <span className="text-blud-red">FIT</span>MASTER
              </h1>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
                <Link to="/workouts" className="text-xs lg:text-sm uppercase tracking-wider hover:text-blud-red transition-colors">
                  ТРЕНИРОВКИ
                </Link>
                <a 
                  href="https://vk.com/lexa4q4q" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs lg:text-sm uppercase tracking-wider hover:text-blud-red transition-colors"
                >
                  БЛОГ
                </a>
              </nav>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-2xl text-gray-400 hover:text-white"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* Desktop Right side */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              {user ? (
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Link 
                    to="/profile"
                    className="text-xs lg:text-sm uppercase tracking-wider hover:text-blud-red transition-colors"
                  >
                    ПРОФИЛЬ
                  </Link>
                  
                  {user.role === 'admin' && (
                    <button 
                      onClick={() => setIsAdminPanelOpen(true)}
                      className="text-xs lg:text-sm uppercase tracking-wider hover:text-blud-red transition-colors"
                    >
                      АДМИН
                    </button>
                  )}
                  
                  <button 
                    onClick={handleLogoutClick}
                    className="text-xs lg:text-sm uppercase tracking-wider hover:text-blud-red transition-colors"
                  >
                    ВЫЙТИ
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-xs lg:text-sm uppercase tracking-wider hover:text-blud-red transition-colors"
                >
                  ВОЙТИ
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-blud-gray">
              <nav className="flex flex-col space-y-3">
                <Link 
                  to="/workouts" 
                  className="text-sm uppercase tracking-wider hover:text-blud-red transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ТРЕНИРОВКИ
                </Link>
                <a 
                  href="https://vk.com/lexa4q4q" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm uppercase tracking-wider hover:text-blud-red transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  БЛОГ
                </a>
                
                {user ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="text-sm uppercase tracking-wider hover:text-blud-red transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ПРОФИЛЬ
                    </Link>
                    {user.role === 'admin' && (
                      <button 
                        onClick={() => {
                          setIsAdminPanelOpen(true)
                          setIsMobileMenuOpen(false)
                        }}
                        className="text-sm uppercase tracking-wider hover:text-blud-red transition-colors text-left"
                      >
                        АДМИН
                      </button>
                    )}
                    <button 
                      onClick={handleLogoutClick}
                      className="text-sm uppercase tracking-wider hover:text-blud-red transition-colors text-left"
                    >
                      ВЫЙТИ
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => {
                      setIsAuthModalOpen(true)
                      setIsMobileMenuOpen(false)
                    }}
                    className="text-sm uppercase tracking-wider hover:text-blud-red transition-colors text-left"
                  >
                    ВОЙТИ
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={onLoginSuccess}
      />

      {isAdminPanelOpen && (
        <AdminPanel 
          user={user}
          onClose={() => setIsAdminPanelOpen(false)}
        />
      )}
    </>
  )
}

export default Header