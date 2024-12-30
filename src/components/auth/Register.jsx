import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); 

function Register() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const cities = ['Almaty', 'Astana', 'Shymkent', 'Karaganda', 'Aktobe']; 

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setIsModalOpen(false);
    };

    return (
        <div className="w-screen h-screen bg-custom-gradient">
            <div className="flex -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 absolute">
                <div className="border-[1px] border-white bg-white/85 h-[60vh] w-[85vw] rounded-[25px] shadow-2xl flex-col py-[2vh] px-[5vw]">
                    <div className="text-center text-[5vh] font-semibold font-ptsans">Register</div>
                    <div className="text-center">
                        Already have an account? <span className="font-medium underline text-blue-400"> Login </span>
                    </div>
                    <div className="flex flex-col">
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
                        <div className="flex justify-center">
                            <button className="mt-[2vh] py-[0.5vh] px-[1vw] bg-gradient-to-t from-lime-500 to-lime-300 shadow-xl text-[2.5vh] rounded-lg w-[30vw] font-medium">
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальное окно */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="bg-white rounded-[15px] shadow-2xl w-[50vw] h-[50vh] p-5 mx-auto mt-[10vh]"
                overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
            >
                <div className="flex flex-col h-full">
                    <input
                        type="text"
                        placeholder="Search city..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border-[1px] rounded-[10px] h-[4vh] shadow-inner px-[2.5vw] focus:outline-lime-500 mb-4"
                    />
                    <div className="overflow-y-auto">
                        {cities
                            .filter((city) => city.toLowerCase().includes(search.toLowerCase()))
                            .map((city) => (
                                <div
                                    key={city}
                                    className="py-2 px-4 hover:bg-lime-200 cursor-pointer rounded-md"
                                    onClick={() => handleCitySelect(city)}
                                >
                                    {city}
                                </div>
                            ))}
                    </div>
                    <button
                        className="mt-auto py-2 px-4 bg-red-500 text-white rounded-md self-end"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default Register;
