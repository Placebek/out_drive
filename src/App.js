import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { Routes, Route } from 'react-router-dom'


function App() {
  return (
    <div className="App">
      <Routes>
				<Route
					path='/register'
					element={
						<>
							<Register />
						</>
					}
				/>
        <Route path="/login" element={
          <>
          <Login />
          </>
        }
        />
        
      </Routes>
    </div>
  );
}

export default App;
