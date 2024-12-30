import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-[70vw] bg-gradient-to-l from-lime-600 to-lime-500 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold font-notosans">Menu</h2>
                    <button
                        className="text-gray-500 text-xl"
                        onClick={onClose} 
                    >
                        &times;
                    </button>
                </div>
                <div className="p-4">
                    <ul className="space-y-4">
                        <li className="hover:text-lime-500 cursor-pointer text-[2vh]">Profile</li>
                        <Link to={'/driver/register'} ><li className="hover:opacity-85 font-notosans mt-[15vh] font-medium border-white rounded-2xl bg-gradient-to-t from-yellow-300 to-lime-400 border-[2px] p-[1vh] text-center">I WANT TO BE DRIVERRR <br />(Click me)</li></Link>
                        <li className='absolute bottom-[5vh] text-[1.25vh]'> Log out (try click)</li>
                    </ul>
                </div>
            </div>

            {isOpen && (
                <div
                    className={`absolute ml-[70vw] w-[30vw] h-full inset-0 bg-black bg-opacity-30 z-10 duration-300  ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    onClick={onClose} 
                ></div>
            )}
        </>
    );
};

export default Sidebar;
