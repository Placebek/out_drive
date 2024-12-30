import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import CityModal from '../modals/CityModal';
import { citiesList } from '../../store/actions/citiesAction';
import { registerUsers } from '../../store/actions/authActions';
import { useNavigate } from 'react-router-dom';
Modal.setAppElement('#root');

function Register() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { cities } = useSelector(state => state.cities);
    const { loading, error, user } = useSelector(state => state.auth); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [phone_number, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [load, setLoading] = useState(false);

    useEffect(() => {
        if (cities.length === 0) {
            dispatch(citiesList());
        }
    }, [dispatch, cities]);

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setIsModalOpen(false);
    };

    const handleRegister = async () => {
        setLoading(true);
        const userData = {
            first_name: first_name,
            last_name: last_name,
            phone_number: phone_number,
            password: password,
            city_name: selectedCity,
        };
        try {
            const response = await dispatch(registerUsers(userData));

            console.log('Registration successful:', response);
            localStorage.setItem('accessToken', response.access_token);
            navigate('/');

        } catch (error) {
            console.error('Registration failed:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen bg-custom-gradient flex justify-center items-center">
            <div className="border-[1px] border-white bg-white/85 h-[60vh] w-[85vw] rounded-[25px] shadow-2xl py-[2vh] px-[5vw]">
                <div className="text-center text-[5vh] font-semibold font-ptsans">Register</div>
                <div className="text-center mt-2">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium underline text-blue-400">Login</Link>
                </div>
                <div className="flex flex-col mt-4">
                    <div className="mt-[2vh] text-gray-600/70 font-medium font-notosans">First Name</div>
                    <input
                        type="text"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="border-[1px] rounded-[10px] h-[4vh] shadow-inner px-[2.5vw] focus:outline-lime-500"
                    />
                    <div className="mt-[2vh] text-gray-600/70 font-medium font-notosans">Last Name</div>
                    <input
                        type="text"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        className="border-[1px] rounded-[10px] h-[4vh] shadow-inner px-[2.5vw] focus:outline-lime-500"
                    />
                    <div className="mt-[2vh] text-gray-600/70 font-medium font-notosans">Phone number</div>
                    <input
                        type="text"
                        value={phone_number}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border-[1px] rounded-[10px] h-[4vh] shadow-inner px-[2.5vw] focus:outline-lime-500"
                    />
                    <div className="mt-[2vh] text-gray-600/70 font-medium font-notosans">Password</div>
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-[1px] rounded-[10px] h-[4vh] shadow-inner px-[2.5vw] focus:outline-lime-500"
                    />
                    <div className="mt-[2vh] text-gray-600/70 font-medium font-notosans">Choose your city</div>
                    <button
                        className="border-[1px] rounded-[10px] h-[4vh] shadow-inner px-[2.5vw] text-left bg-white focus:outline-lime-500"
                        onClick={() => setIsModalOpen(true)}
                    >
                        {selectedCity || 'Select City'}
                    </button>
                    <div className="flex justify-center mt-[2vh]">
                        <button
                            className="py-[0.5vh] px-[1vw] bg-gradient-to-t from-lime-500 to-lime-300 shadow-xl text-[2.5vh] rounded-lg w-[30vw] font-medium"
                            onClick={handleRegister}
                            disabled={loading} 
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </div>
            </div>

            <CityModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                cities={cities}
                handleCitySelect={handleCitySelect}
                search={search}
                setSearch={setSearch}
            />
        </div>
    );
}

export default Register;
