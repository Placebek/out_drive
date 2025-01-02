import { createAsyncThunk } from '@reduxjs/toolkit'
import { getDriverCoords, updateDriverCoords } from '../services/location'

export const driverLocation = createAsyncThunk(
	'driver/location',
	async (_, { rejectWithValue }) => {
		try {
			const data = await getDriverCoords()
			return data
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Something went wrong. Please try again'
			)
		}
	}
)

export const updateDriverLocation = createAsyncThunk(
	'driver/update/location',
	async (_, { rejectWithValue }) => {
		try {
			const data = await updateDriverCoords()
			return data
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Something went wrong. Please try again'
			)
		}
	}
)