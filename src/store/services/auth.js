import API from './api'

export const registerUser = async (userData) => {
	const response = await API.post('auth/client/register', userData, {
		headers: {
			'Content-Type': 'application/json',
		},
	})
    console.log(response)
	return response.data
}

export const loginUser = async () => {
	const response = await API.post('//')
	return response.data
}

export const registerTaxi = async () => {
	const response = await API.post('//')
	return response.data
}

export const loginTaxi = async () => {
	const response = await API.post('//')
	return response.data
}