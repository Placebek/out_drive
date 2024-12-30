import React from 'react';
import Modal from 'react-modal';

function CityModal({ isModalOpen, setIsModalOpen, cities, handleCitySelect, search, setSearch }) {
    
    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            className="bg-white rounded-[15px] shadow-2xl w-[80vw] h-[50vh] p-5 mx-auto mt-[10vh]"
            overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
        >
            <div className="flex flex-col">
                <input
                    type="text"
                    placeholder="Search city..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-[1px] rounded-[10px] h-[4vh]  shadow-inner px-[2.5vw] focus:outline-lime-500 mb-[2vh]"
                />
                <div className="overflow-y-auto max-h-[30vh] border-[1px] p-[1vh] border-lime-500">
                    {cities
                        .filter((city) => city.city_name.toLowerCase().includes(search.toLowerCase()))
                        .map((city) => (
                            <div
                                key={city.id} 
                                className="py-2 px-4 hover:bg-lime-200 cursor-pointer rounded-md border-[1px]"
                                onClick={() => handleCitySelect(city.city_name)} 
                            >
                                {city.city_name} 
                            </div>
                        ))}
                </div>
                <button
                    className=" py-2 px-4 bg-red-500 text-white rounded-md self-end mt-[2vh]"
                    onClick={() => setIsModalOpen(false)}
                >
                    Close
                </button>
            </div>
        </Modal>
    );
}

export default CityModal;
