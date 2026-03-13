const API_URL = 'https://s273934.h1n.ru/api'; // Измените http на https

class ApiService {
    async request(endpoint, options = {}) {
        const token = this.getToken();
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers,
            credentials: 'include'
        };

        try {
            const response = await fetch(`${API_URL}/${endpoint}`, config);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error in ${endpoint}:`, error);
            throw error;
        }
    }

    // Методы для избранного
    async getFavorites() {
        return this.request('favorites.php');
    }

    async addToFavorites(workout) {
        return this.request('favorites.php', {
            method: 'POST',
            body: JSON.stringify({
                workout_id: workout.id,
                workout_name: workout.name,
                workout_image: workout.image
            })
        });
    }

    async removeFromFavorites(workoutId) {
        return this.request(`favorites.php?workout_id=${workoutId}`, {
            method: 'DELETE'
        });
    }

    async uploadAvatar(file) {
        const token = this.getToken();
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await fetch(`${API_URL}/upload-avatar.php`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            throw error;
        }
    }

    async getAvatar() {
        return this.request('get-avatar.php');
    }

    async login(credentials) {
        try {
            const data = await this.request('login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });
            
            if (data.success && data.user) {
                this.setToken(data.user.token);
                this.setUser(data.user);
            }
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(userData) {
        try {
            const data = await this.request('register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            
            if (data.success && data.user) {
                this.setToken(data.user.token);
                this.setUser(data.user);
            }
            
            return data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    }

    async checkSession() {
        try {
            return await this.request('check-session.php');
        } catch (error) {
            console.error('Session check error:', error);
            return { success: false, session_exists: false };
        }
    }

    async saveWorkoutProgress(workoutData) {
        return this.request('workout-progress.php', {
            method: 'POST',
            body: JSON.stringify(workoutData)
        });
    }

    async getUserStats() {
        return this.request('workout-progress.php');
    }

    async getPopularWorkouts() {
        return this.request('workout-progress.php?action=popular');
    }

    async getUsers() {
        return this.request('admin/users.php?action=users');
    }

    async getStats() {
        return this.request('admin/stats.php?action=stats');
    }

    async updateUserRole(userId, role) {
        return this.request('admin/users.php?action=role', {
            method: 'PUT',
            body: JSON.stringify({ user_id: userId, role })
        });
    }

    async deleteUser(userId) {
        return this.request(`admin/users.php?action=user&id=${userId}`, {
            method: 'DELETE'
        });
    }

    setToken(token) {
        if (token) {
            localStorage.setItem('token', token);
        }
    }

    setUser(user) {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch {
            return null;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    isAuthenticated() {
        const token = this.getToken();
        const user = this.getCurrentUser();
        return !!(token && user);
    }
}

export default new ApiService();