import API from './api'

export const getCities = async () => {
	const response = await API.get('/client/cities')
	return response.data
}
