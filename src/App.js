import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Home from './components/pages/Home'
import DriverRegister from './components/auth/DriverRegister'
import Maps from './components/pages/Map'
import ProtectedRoute from './components/logics/ProtectedRoute'
import DriverHome from './components/pages/DriverHome'
import DriverMap from './components/pages/DriverMap'
import DriverMapDetail from './components/pages/DriverMapDetail'
import RealTimeLocation from './components/pages/RealTimeLocation'
import ProtectedRouteDriver from './components/logics/ProtectedRouteDriver'

function App() {
	const [role, setRole] = useState(localStorage.getItem('original_roles') || '')

	useEffect(() => {
		const storedRole = localStorage.getItem('original_roles')
		setRole(storedRole)
	}, []) // Загружаем роль при монтировании компонента

	return (
		<div className='App'>
			<Routes>
				<Route path='/register' element={<Register />} />
				<Route path='/login' element={<Login />} />
				<Route
					path='/'
					element={
						<ProtectedRoute>
							{role === 'passenger' ? <Home /> : <DriverHome />}
						</ProtectedRoute>
					}
				/>
				<Route
					path='/driver/register'
					element={
						<ProtectedRouteDriver>
							<DriverRegister role={role} setRole={setRole} />
						</ProtectedRouteDriver>
					}
				/>

				<Route
					path='/travel'
					element={
						<ProtectedRoute>
							<Maps />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/travel/driver'
					element={
						<ProtectedRoute>
							<DriverMap />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/travel/driver/:id'
					element={
						<ProtectedRoute>
							<DriverMapDetail />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</div>
	)
}

export default App
