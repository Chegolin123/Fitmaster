import React, { useState, useEffect } from 'react'

const AdminPanel = ({ user, onClose }) => {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
    fetchStats()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://fitmaster/api/users?action=users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (err) {
      setError('Ошибка загрузки пользователей')
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('http://fitmaster/api/users?action=stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (err) {
      setError('Ошибка загрузки статистики')
    } finally {
      setLoading(false)
    }
  }

  const changeUserRole = async (userId, newRole) => {
    try {
      const response = await fetch('http://fitmaster/api/users?action=role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ user_id: userId, role: newRole })
      })
      const data = await response.json()
      if (data.success) {
        fetchUsers() // Обновляем список
      }
    } catch (err) {
      setError('Ошибка изменения роли')
    }
  }

  const deleteUser = async (userId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return
    }

    try {
      const response = await fetch(`http://fitmaster/api/users?action=user&id=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (data.success) {
        fetchUsers() // Обновляем список
        fetchStats() // Обновляем статистику
      }
    } catch (err) {
      setError('Ошибка удаления пользователя')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-blud-gray border border-blud-red/20 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-blud-gray sticky top-0 bg-blud-gray">
          <h2 className="text-2xl font-bold tracking-[0.15em]">
            <span className="text-blud-red">ADMIN</span> ПАНЕЛЬ
          </h2>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-blud-red/10 border border-blud-red text-blud-red p-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Статистика */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="blud-card text-center">
                <div className="text-3xl font-bold text-blud-red">{stats.total_users}</div>
                <div className="text-sm text-gray-400 mt-2">Всего пользователей</div>
              </div>
              <div className="blud-card text-center">
                <div className="text-3xl font-bold text-blud-red">{stats.total_admins}</div>
                <div className="text-sm text-gray-400 mt-2">Администраторов</div>
              </div>
              <div className="blud-card text-center">
                <div className="text-3xl font-bold text-blud-red">{stats.new_today}</div>
                <div className="text-sm text-gray-400 mt-2">Новых сегодня</div>
              </div>
            </div>
          )}

          {/* Список пользователей */}
          <h3 className="text-xl font-bold mb-4">Управление пользователями</h3>
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="blud-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold">{u.name}</p>
                  <p className="text-sm text-gray-400">{u.email}</p>
                  <p className="text-xs text-gray-500">Зарегистрирован: {new Date(u.created_at).toLocaleDateString()}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <select
                    value={u.role}
                    onChange={(e) => changeUserRole(u.id, e.target.value)}
                    className="blud-input text-sm py-1 px-2"
                    disabled={u.id === user.id} // Нельзя менять свою роль
                  >
                    <option value="user">Пользователь</option>
                    <option value="admin">Администратор</option>
                  </select>

                  {u.id !== user.id && (
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="text-blud-red hover:text-white transition-colors"
                      title="Удалить пользователя"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel