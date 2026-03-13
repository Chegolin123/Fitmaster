import React from 'react'

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Затемненный фон */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Модальное окно */}
      <div className="relative bg-blud-gray border border-blud-red/20 rounded-lg w-full max-w-md overflow-hidden animate-fadeIn">
        {/* Красная полоса сверху */}
        <div className="h-2 bg-gradient-to-r from-blud-red to-blud-red-dark"></div>
        
        {/* Иконка предупреждения */}
        <div className="flex justify-center mt-8">
          <div className="w-16 h-16 rounded-full bg-blud-red/20 border-2 border-blud-red flex items-center justify-center animate-pulse">
            <span className="text-3xl">⚠️</span>
          </div>
        </div>

        {/* Контент */}
        <div className="px-8 pb-8 pt-4 text-center">
          <h3 className="text-2xl font-bold mb-3">{title || 'ПОДТВЕРДИТЕ ДЕЙСТВИЕ'}</h3>
          <p className="text-gray-400 mb-8">
            {message || 'Вы уверены, что хотите продолжить?'}
          </p>

          {/* Кнопки */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded border border-blud-gray text-gray-400 hover:text-white hover:border-blud-red transition-all duration-300 font-bold uppercase tracking-wider"
            >
              ОТМЕНА
            </button>
            <button
              onClick={() => {
                onConfirm()
              }}
              className="flex-1 py-3 px-4 rounded bg-blud-red text-white hover:bg-blud-red-dark transition-all duration-300 font-bold uppercase tracking-wider"
            >
              ПОДТВЕРДИТЬ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal