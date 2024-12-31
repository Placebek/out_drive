import { createAsyncThunk } from '@reduxjs/toolkit'
import { postRequestByDriver, postRequestByUser, getRequests } from '../services/requests'

export const userRequest = createAsyncThunk(
	'request/user',
	async (requestData, { rejectWithValue }) => {
		try {
			const data = await postRequestByUser(requestData)
			return data
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Something went wrong. Please try again'
			)
		}
	}
)

export const driverRequest = createAsyncThunk(
	'request/driver',
	async (requestData, { rejectWithValue }) => {
		try {
			const data = await postRequestByDriver(requestData)
			return data
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Something went wrong. Please try again'
			)
		}
	}
)


export const getRequestsAll = createAsyncThunk(
	'request/all',
	async (_, { rejectWithValue }) => {
		try {
			const data = await getRequests()
			return data
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Something went wrong. Please try again'
			)
		}
	}
)