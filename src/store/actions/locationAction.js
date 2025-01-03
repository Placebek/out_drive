import { createAsyncThunk } from '@reduxjs/toolkit'
import { getDriverCoords, updateDriverCoords, createDriverCoords } from '../services/location'

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
	async (locationData, { rejectWithValue }) => {
		try {
			const data = await updateDriverCoords(locationData)
			return data
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Something went wrong. Please try again'
			)
		}
	}
)

export const createDriverLocation = createAsyncThunk(
	'driver/create/location',
	async (locationData, { rejectWithValue }) => {
		try {
			const data = await updateDriverCoords(locationData)
			return data
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Something went wrong. Please try again'
			)
		}
	}
)