import { configureStore } from '@reduxjs/toolkit'
import authSlice from './reducers/authReducer'
import citiesReducer from './reducers/citiesReducer'
import requestSlice from './reducers/requestReducer'
import orderSlice from './reducers/ordersReducer'
import locationSlice from './reducers/locationReducer'


const store = configureStore({
	reducer: {
		auth: authSlice,
		cities: citiesReducer,
		request: requestSlice,
		order: orderSlice,
		location: locationSlice,
	},
})

export default store
