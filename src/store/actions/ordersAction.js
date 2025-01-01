import { createAsyncThunk } from '@reduxjs/toolkit'
import { postOrders, deleteOrders } from '../services/orders'

export const createOrder = createAsyncThunk(
	'order/create',
	async (orderData, { rejectWithValue }) => {
		try {
			const data = await postOrders(orderData)
            debugger
			return data
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Something went wrong. Please try again'
			)
		}
	}
)


export const delOrder = createAsyncThunk(
	'order/delete',
	async (id, { rejectWithValue }) => {
		try {
			const data = await deleteOrders(id)
			debugger
			return data
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Something went wrong. Please try again'
			)
		}
	}
)