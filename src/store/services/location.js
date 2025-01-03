import API from './api'


export const getDriverCoords = async id => {
    const response = await API.get(`driver/coords/${id}`, {
        headers: {
            'Content-Type': 'application/json',
		},
	})
	return response.data
}


export const createDriverCoords = async (data) => {
	const response = await API.post(`driver/coords`, data, {
		headers: {
			'Content-Type': 'application/json',
		},
	})
	return response.data
}



export const updateDriverCoords = async locationData => {
	const response = await API.patch('driver/coords/update', locationData, {
		headers: {
			'Content-Type': 'application/json',
		},
	})
	return response.data
}
