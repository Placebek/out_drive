import { createSlice } from '@reduxjs/toolkit'
import {
	registerUsers,
	loginUsers,
	registerTaxies,
} from '../actions/authActions'

const initialState = {
	loading: false,
	error: null, 
	user: null, 
	taxi: null, 
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {}, 
	extraReducers: builder => {

		builder
			.addCase(registerUsers.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(registerUsers.fulfilled, (state, action) => {
				state.loading = false
				state.user = action.payload 
			})
			.addCase(registerUsers.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})

	
		builder
			.addCase(loginUsers.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(loginUsers.fulfilled, (state, action) => {
				state.loading = false
				state.user = action.payload 
			})
			.addCase(loginUsers.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})

	
		builder
			.addCase(registerTaxies.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(registerTaxies.fulfilled, (state, action) => {
				state.loading = false
				state.taxi = action.payload 
			})
			.addCase(registerTaxies.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})
	},
})

export default authSlice.reducer
