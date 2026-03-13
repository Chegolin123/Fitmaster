import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import PopularSlider from './components/PopularSlider'
import EquipmentSelector from './components/EquipmentSelector'
import WorkoutList from './components/WorkoutList'
import Stats from './components/Stats'
import Profile from './components/Profile'
import WorkoutsPage from './pages/WorkoutsPage'
import Footer from './components/Footer'
import api from './services/api'

function App() {
  const [selectedEquipment, setSelectedEquipment] = useState(['none'])
  const [selectedMuscles, setSelectedMuscles] = useState(['fullbody'])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Проверка сессии при загрузке
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const savedUser = api.getCurrentUser();
        const token = api.getToken();
        
        console.log('Checking session:', { savedUser: !!savedUser, token: !!token });

        if (token && savedUser) {
          const sessionData = await api.checkSession();
          console.log('Session check result:', sessionData);
          
          if (sessionData.success && sessionData.session_exists) {
            setUser(sessionData.user);
            localStorage.setItem('user', JSON.stringify(sessionData.user));
          } else {
            console.log('Session invalid, logging out');
            api.logout();
            setUser(null);
          }
        } else {
          console.log('No saved session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
        api.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('selectedEquipment', JSON.stringify(selectedEquipment))
      localStorage.setItem('selectedMuscles', JSON.stringify(selectedMuscles))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }, [selectedEquipment, selectedMuscles])

  const handleSearch = () => {
    setIsSearching(true)
    setShowResults(true)
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }, 100)
  }

  const resetFilters = () => {
    setSelectedEquipment(['none'])
    setSelectedMuscles(['fullbody'])
    setShowResults(false)
    setIsSearching(false)
  }

  const handleEquipmentChange = (newEquipment) => {
    setSelectedEquipment(newEquipment)
    setShowResults(false)
    setIsSearching(false)
  }

  const handleMuscleChange = (newMuscles) => {
    setSelectedMuscles(newMuscles)
    setShowResults(false)
    setIsSearching(false)
  }

  const handleLoginSuccess = (userData) => {
    console.log('Login success:', userData);
    setUser(userData);
  }

  const handleLogout = () => {
    console.log('Logging out');
    api.logout();
    setUser(null);
  }

  // Главная страница
  const HomePage = () => (
    <>
      <Hero />
      <PopularSlider /> {/* Добавляем слайдер после Hero */}
      <section className="container-custom py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blud-black/50 to-blud-black pointer-events-none"></div>
        
        <div className="relative z-10">
          <EquipmentSelector 
            selectedEquipment={selectedEquipment}
            onEquipmentChange={handleEquipmentChange}
            selectedMuscles={selectedMuscles}
            onMuscleChange={handleMuscleChange}
          />
          
          <div className="flex flex-col items-center my-12">
            <button 
              onClick={handleSearch}
              className={`
                blud-button text-lg px-12 py-5 min-w-[300px] relative overflow-hidden group
                ${(!selectedEquipment.length || !selectedMuscles.length) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={!selectedEquipment.length || !selectedMuscles.length}
            >
              <span className="relative z-10 tracking-[0.2em]">
                {isSearching ? 'ПОИСК...' : 'НАЙТИ ТРЕНИРОВКИ'}
              </span>
              <div className="absolute inset-0 bg-blud-red-dark transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            
            {(!selectedEquipment.length || !selectedMuscles.length) && (
              <p className="text-gray-400 text-sm mt-4 tracking-wide">
                ⚠️ Выберите оборудование и мышечные группы
              </p>
            )}
          </div>
          
          <Stats />
          
          {showResults && (
            <div id="results-section" className="scroll-mt-24">
              <WorkoutList 
                selectedEquipment={selectedEquipment}
                selectedMuscles={selectedMuscles}
              />
            </div>
          )}
        </div>
      </section>
    </>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-blud-black flex items-center justify-center">
        <div className="text-4xl animate-pulse">💪</div>
      </div>
    )
  }

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="min-h-screen bg-blud-black text-white flex flex-col">
        <Header 
          resetFilters={resetFilters}
          user={user}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route 
              path="/profile" 
              element={
                user ? (
                  <Profile user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  )
}

export default App