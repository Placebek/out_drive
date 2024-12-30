import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import CityModal from '../modals/CityModal';
import { citiesList } from '../../store/actions/citiesAction'; 

Modal.setAppElement('#root'); 

function Register() {
    const dispatch = useDispatch();
    const { cities } = useSelector(state => state.cities); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    useEffect(() => {
        if (cities.length === 0) {
            dispatch(citiesList());
        }
    }, [dispatch, cities]);

    const handleCitySelect = (city) => {
        setSelectedCity(city); 
        setIsModalOpen(false);
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
                        className="border-[1px] rounded-[10px] h-[4vh] shadow-inner px-[2.5vw] focus:outline-lime-500"
                    />
                    <div className="mt-[2vh] text-gray-600/70 font-medium font-notosans">Last Name</div>
                    <input
                        type="text"
                        className="border-[1px] rounded-[10px] h-[4vh] shadow-inner px-[2.5vw] focus:outline-lime-500"
                    />
                    <div className="mt-[2vh] text-gray-600/70 font-medium font-notosans">Phone number</div>
                    <input
                        type="text"
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
                        <button className="py-[0.5vh] px-[1vw] bg-gradient-to-t from-lime-500 to-lime-300 shadow-xl text-[2.5vh] rounded-lg w-[30vw] font-medium">
                            Register
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
