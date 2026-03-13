import React from 'react'

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center pt-16 sm:pt-20 overflow-hidden">
      {/* Фоновое изображение */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/gym-background.jpg" 
          alt="Спортивный зал"
          className="w-full h-full object-cover"
        />
        
        {/* Затемняющие оверлеи */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
      </div>

      {/* Контент */}
      <div className="container-custom relative z-10">
        <div className="max-w-4xl">
          <div className="mb-4 sm:mb-6">
            <span className="inline-block blud-tag border-blud-red/50 text-blud-red text-xs sm:text-sm">
              ⚡ СИСТЕМА ТРЕНИРОВОК 2026
            </span>
          </div>
          
          {/* Заголовки */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-4 sm:mb-6 md:mb-8 text-shadow-lg">
            <span className="block text-white tracking-[0.1em] sm:tracking-[0.15em] mb-1">
              СТАНЬ
            </span>
            <span className="block text-blud-red tracking-[0.08em] sm:tracking-[0.12em] mb-1 sm:mb-2">
              СИЛЬНЕЕ
            </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-300 mt-2 sm:mt-4 tracking-[0.05em] sm:tracking-[0.08em] leading-relaxed">
              С ЛЮБЫМ ОБОРУДОВАНИЕМ
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mb-8 sm:mb-12 leading-relaxed text-shadow">
            100+ тренировок для дома. Выбирай оборудование и мышцы — 
            получай персональную программу за 30 секунд.
          </p>

          {/* Статистика */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:gap-8">
            <div className="flex items-center space-x-3 sm:space-x-4 bg-black/30 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-800 w-full sm:w-auto">
              <div className="text-3xl sm:text-4xl font-black text-blud-red tracking-tight">14k+</div>
              <div className="text-xs sm:text-sm text-gray-300 uppercase tracking-wider leading-tight">
                Активных<br />пользователей
              </div>
            </div>

            
            <div className="block sm:hidden w-full h-px bg-gray-700"></div>

            <div className="flex items-center space-x-3 sm:space-x-4 bg-black/30 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-800 w-full sm:w-auto">
              <div className="text-3xl sm:text-4xl font-black text-blud-red tracking-tight">8+</div>
              <div className="text-xs sm:text-sm text-gray-300 uppercase tracking-wider leading-tight">
                Лет<br />практики
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - скрыт на мобильных */}
      
    </section>
  )
}

export default Hero