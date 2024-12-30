import { createSlice } from '@reduxjs/toolkit'
import { citiesList } from '../actions/citiesAction' 

const initialState = {
	cities: [],
	loading: false, 
	error: null,
}

const citiesSlice = createSlice({
	name: 'cities',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(citiesList.pending, state => {
				state.loading = true 
				state.error = null 
			})
			.addCase(citiesList.fulfilled, (state, action) => {
				state.loading = false 
				state.cities = action.payload 
			})
			.addCase(citiesList.rejected, (state, action) => {
				state.loading = false 
				state.error = action.payload 
			})
	},
})

export default citiesSlice.reducer
