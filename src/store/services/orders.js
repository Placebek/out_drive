import API from './api'

export const postOrders = async (orderData) => {
	const response = await API.post('driver/request', orderData, {
		headers: {
			'Content-Type': 'application/json',
		},
	})
	return response.data
}

export const deleteOrders = async (id) => {
	const response = await API.delete(`driver/delete/${id}`, {
		headers: {
			'Content-Type': 'application/json',
		},
	})
	return response.data
}


// export const getRequests = async () => {
// 	const response = await API.get('driver/request/list', {
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 	})
// 	return response.data
// }
