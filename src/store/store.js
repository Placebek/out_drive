import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authReducer'
import citiesReducer from './reducers/citiesReducer'
import requestSlice from './reducers/requestReducer'


const store = configureStore({
	reducer: {
		auth: authReducer,
		cities: citiesReducer,
		request: requestSlice,
	},
})

export default store
