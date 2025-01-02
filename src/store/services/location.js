import API from './api'


export const getDriverCoords = async id => {
    const response = await API.get(`/driver/coords/${id}`, {
        headers: {
            'Content-Type': 'application/json',
		},
	})
	return response.data
}

export const updateDriverCoords = async locationData => {
	const response = await API.put('driver/request', locationData, {
		headers: {
			'Content-Type': 'application/json',
		},
	})
	return response.data
}
