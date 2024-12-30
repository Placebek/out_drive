import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { Routes, Route } from 'react-router-dom'
import Home from "./components/pages/Home";
import DriverRegister from "./components/auth/DriverRegister";
import Maps from "./components/pages/Map";


function App() {
  return (
		<div className='App'>
			<Routes>
				<Route
					path='/register'
					element={
							<Register />
					}
				/>
				<Route
					path='/login'
					element={
							<Login />
					}
				/>
				<Route
					path='/'
					element={
							<Home />
					}
				/>
				<Route
					path='/driver/register'
					element={
							<DriverRegister/>
					}
				/>
        <Route
					path='/travel'
					element={
							<Maps/>
					}
				/>
			</Routes>
		</div>
	)
}

export default App;
