import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authReducer'
import citiesReducer from './reducers/citiesReducer'


const store = configureStore({
	reducer: {
		auth: authReducer,
		cities: citiesReducer,
	},
})

export default store
