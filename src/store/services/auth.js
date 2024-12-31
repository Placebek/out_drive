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

export const loginUser = async (loginData) => {
    const response = await API.post('auth/client/login', loginData,  {
        headers: {
            'Content-Type': 'application/json',
		}, 
        
    })
	return response.data
}

export const registerTaxi = async (formData) => {
	const response = await API.post('auth/driver/register/', formData)
	return response.data
}

export const loginTaxi = async () => {
	const response = await API.post('//')
	return response.data
}