import React from 'react'

const Stats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12">
      <div className="blud-card text-center bg-blud-gray/90 backdrop-blur-sm">
        <div className="blud-stats">100+</div>
        <div className="text-xs uppercase tracking-wider text-gray-300 mt-2">ТРЕНИРОВОК</div>
      </div>
      <div className="blud-card text-center bg-blud-gray/90 backdrop-blur-sm">
        <div className="blud-stats">14K+</div>
        <div className="text-xs uppercase tracking-wider text-gray-300 mt-2">УЧЕНИКОВ</div>
      </div>
      <div className="blud-card text-center bg-blud-gray/90 backdrop-blur-sm">
        <div className="blud-stats">5+</div>
        <div className="text-xs uppercase tracking-wider text-gray-300 mt-2">ЛЕТ ПРАКТИКИ</div>
      </div>
      <div className="blud-card text-center bg-blud-gray/90 backdrop-blur-sm">
        <div className="blud-stats">24/7</div>
        <div className="text-xs uppercase tracking-wider text-gray-300 mt-2">ДОСТУП</div>
      </div>
    </div>
  )
}

export default Stats