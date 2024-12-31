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


function App() {
	const [role, setRole] = useState('') 

	useEffect(() => {
		const storedRole = localStorage.getItem('roles')

		if (!storedRole) {
			localStorage.setItem('roles', 'passenger')
			setRole('passenger')
		} else {
			setRole(storedRole)
		}

		const storedOriginalRole = localStorage.getItem('original_roles')
		if (!storedOriginalRole) {
			localStorage.setItem('original_roles', 'passenger')
		}
	}, [])

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
						<ProtectedRoute>
							<DriverRegister />
						</ProtectedRoute>
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
							<DriverMap/>
						</ProtectedRoute>
					}
				/>
			</Routes>
		</div>
	)
}

export default App