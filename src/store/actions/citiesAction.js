import { createAsyncThunk } from '@reduxjs/toolkit'
import { getCities } from '../services/getCities'

export const citiesList = createAsyncThunk(
	'client/city',
	async (_, { rejectWithValue }) => {
		try {
			const data = await getCities()
			return data
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Something went wrong. Please try again'
			)
		}
	}
)

