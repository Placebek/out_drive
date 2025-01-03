import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUsers } from '../../store/actions/authActions';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function Login() {
  const navigate = useNavigate()

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const validate = () => {
    const newErrors = {};
    if (!phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required.';
    } else if (!/^\d{8,12}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must contain 10-12 digits.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      phone_number: phoneNumber,
      password: password,
    };

    if (validate()) {
      try {
        const response = await dispatch(loginUsers(loginData));
        localStorage.setItem('access_token', response.payload.access_token);
        localStorage.setItem('roles', response.payload.roles);
        localStorage.setItem('original_roles', response.payload.roles);
        if (response.access_token){
            navigate('/');
        }
      } catch (error) {
        console.error('Registration failed:', error.response?.data || error.message);
      }
    }
  };


  return (
    <div className="w-screen h-screen bg-custom-gradient">
      <form
        className="flex -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 absolute"
      >
        <div className="border-[1px] border-white bg-white/85 h-[45vh] w-[85vw] rounded-[25px] shadow-2xl flex-col py-[2vh] px-[5vw]">
          <div className="text-center text-[5vh] font-semibold font-ptsans">Login</div>
          <div className="text-center">
            Already have an account?{' '}
            <Link to={'/register'} className="font-medium underline text-blue-400">
              Register
            </Link>
          </div>
          <div className="flex flex-col">
            <div className="mt-[2vh] text-gray-600/70 font-medium font-notosans">Phone Number</div>
            <input
              type="number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`border-[1px] rounded-[10px] h-[4vh] shadow-inner px-[2.5vw] focus:outline-lime-500 ${errors.phoneNumber ? 'border-red-500' : ''
                }`}
            />
            {errors.phoneNumber && <div className="text-red-500 text-sm">{errors.phoneNumber}</div>}

            <div className="mt-[2vh] text-gray-600/70 font-medium font-notosans">Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`border-[1px] rounded-[10px] h-[4vh] shadow-inner px-[2.5vw] focus:outline-lime-500 ${errors.password ? 'border-red-500' : ''
                }`}
            />
            {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="mt-[2vh] py-[0.5vh] px-[1vw] bg-gradient-to-t from-lime-500 to-lime-300 shadow-xl text-[2.5vh] rounded-lg w-[30vw] font-medium"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </div>
          {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
        </div>
      </form>
    </div>
  );
}

export default Login;
