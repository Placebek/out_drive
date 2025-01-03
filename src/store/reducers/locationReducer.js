import { createSlice } from '@reduxjs/toolkit'
import { updateDriverLocation, driverLocation, createDriverLocation } from '../actions/locationAction'

const initialState = {
	cities: [],
	loading: false,
	error: null,
}

const locationSlice = createSlice({
	name: 'location',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(updateDriverLocation.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(updateDriverLocation.fulfilled, (state, action) => {
				state.loading = false
				state.cities = action.payload
			})
			.addCase(updateDriverLocation.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})
        builder
			.addCase(driverLocation.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(driverLocation.fulfilled, (state, action) => {
				state.loading = false
				state.cities = action.payload
			})
			.addCase(driverLocation.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})
		builder
			.addCase(createDriverLocation.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(createDriverLocation.fulfilled, (state, action) => {
				state.loading = false
				state.cities = action.payload
			})
			.addCase(createDriverLocation.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})
	},
})

export default locationSlice.reducer
