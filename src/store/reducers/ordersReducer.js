import { createSlice } from '@reduxjs/toolkit'
import { createOrder, delOrder } from '../actions/ordersAction'

const initialState = {
	loading: false,
	error: null,
	orders: [],
}

const orderSlice = createSlice({
	name: 'request',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(createOrder.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(createOrder.fulfilled, (state, action) => {
				state.loading = false
				state.user = action.payload
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})
		builder
			.addCase(delOrder.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(delOrder.fulfilled, (state, action) => {
				state.loading = false
				state.user = action.payload
			})
			.addCase(delOrder.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})
	},
})
export default orderSlice.reducer
