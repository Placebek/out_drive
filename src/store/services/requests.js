import API from './api'

export const postRequestByUser = async (requestData) => {
	const response = await API.post('client/request', requestData, {
		headers: {
			'Content-Type': 'application/json',
		},
	})
	return response.data
}

export const postRequestByDriver = async (requestData) => {
	const response = await API.post('driver/request', requestData, {
		headers: {
			'Content-Type': 'application/json',
		},
	})
	return response.data
}

export const getRequests = async () => {
	const response = await API.get('driver/request/list' , {
		headers: {
			'Content-Type': 'application/json',
		},
	})
	return response.data
}
