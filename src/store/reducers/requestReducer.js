import { createSlice } from '@reduxjs/toolkit'
import {
	userRequest,
	driverRequest,
	getRequestsAll,
} from '../actions/requestsAction'

const initialState = {
	loading: false,
	error: null,
	requests: [],
}

const requestSlice = createSlice({
	name: 'request',
	initialState,
	reducers: {
		setRequest(state, action) {
			state.requests = action.payload
		},
	},
	extraReducers: builder => {
		builder
			.addCase(userRequest.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(userRequest.fulfilled, (state, action) => {
				state.loading = false
				state.user = action.payload
			})
			.addCase(userRequest.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})

		builder
			.addCase(driverRequest.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(driverRequest.fulfilled, (state, action) => {
				state.loading = false
				state.user = action.payload
			})
			.addCase(driverRequest.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})

		builder
			.addCase(getRequestsAll.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(getRequestsAll.fulfilled, (state, action) => {
				state.loading = false
				state.requests = action.payload
			})
			.addCase(getRequestsAll.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})
	},
})
export const { setRequest } = requestSlice.actions
export default requestSlice.reducer
