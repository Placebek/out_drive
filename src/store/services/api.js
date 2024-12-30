import axios from 'axios'

const api = axios.create({
	baseURL: process.env.REACT_APP_BASEURL,
	headers: {
		'Content-Type': 'application/json',
	},
})

const getAccessToken = () => localStorage.getItem('access_token')
const getRefreshToken = () => localStorage.getItem('refresh_token')

// Функция для обновления токена
const refreshAccessToken = async () => {
	try {
		const refreshToken = getRefreshToken()
		if (!refreshToken) {
			throw new Error('No refresh token found')
		}

		// Запрос для обновления access токена с использованием refresh токена
		const response = await api.post('/auth/refresh', {
			refresh_token: refreshToken,
		})
		const { access_token } = response.data

		localStorage.setItem('access_token', access_token)

		return access_token
	} catch (error) {
		console.error('Error refreshing token:', error)
		throw error // Прокидываем ошибку дальше
	}
}

// Интерцептор для добавления токена авторизации в каждый запрос
api.interceptors.request.use(
	config => {
		const token = getAccessToken()
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`
		}
		return config
	},
	error => Promise.reject(error)
) 

// Интерцептор для обработки ошибки 401 (неавторизован)
api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config

		// Если получена ошибка 401 (неавторизован), пробуем обновить токен
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			try {
				const newAccessToken = await refreshAccessToken()
				originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
				return api(originalRequest) // Повторно отправляем запрос с новым токеном
			} catch (refreshError) {
				console.error('Failed to refresh token:', refreshError)
				// Здесь можно добавить логику для выхода пользователя из системы
				return Promise.reject(refreshError)
			}
		}

		// Если ошибка не 401 или не удалось обновить токен, возвращаем ошибку
		return Promise.reject(error)
	}
)

export default api
