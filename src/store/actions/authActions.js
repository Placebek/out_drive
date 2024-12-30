import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    registerUser,
    loginUser,
    registerTaxi,
} from '../services/auth'

export const registerUsers = createAsyncThunk(
	'auth/register',
	async (userData, { rejectWithValue }) => {
		try {
			const data = await registerUser(userData)
            
			console.log(data)
			return data
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Something went wrong. Please try again'
			)
		}
	}
)


export const loginUsers = createAsyncThunk(
	'auth/login',
	async (_, { rejectWithValue }) => {
		try {
			const data = await loginUser()
			console.log(data)
			return data
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Something went wrong. Please try again'
			)
		}
	}
)

export const registerTaxies = createAsyncThunk(
	'auth/register/taxi',
	async (_, { rejectWithValue }) => {
		try {
			const data = await registerTaxi()
			console.log(data)
			return data
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Something went wrong. Please try again'
			)
		}
	}
)
