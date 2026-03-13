import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-12 sm:mt-16">
      <div className="container-custom py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-center sm:text-left">
          {/* Логотип и описание */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                FITMASTER
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Твой персональный тренер для домашних тренировок
            </p>
          </div>
          
          {/* Тренировки */}
          <div className="text-center">
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">ТРЕНИРОВКИ</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Программы</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Тренеры</a></li>
            </ul>
          </div>
          
          {/* О нас */}
          <div className="text-center sm:text-right col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">О НАС</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">О проекте</a></li>
              <li><a href="https://vk.com/lexa4q4q" className="hover:text-white transition-colors">Блог</a></li>
              <li><a href="https://t.me/NoWayWhile" className="hover:text-white transition-colors">Контакты</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Вакансии</a></li>
            </ul>
          </div>
        </div>
        
        {/* Нижняя часть с копирайтом */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-400">© 2026 FITMASTER. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer