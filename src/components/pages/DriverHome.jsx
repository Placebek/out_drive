import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import DriverSidebar from '../modals/DriverSidebar';

function DriverHome() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="h-screen w-screen bg-gradient-to-t from-lime-500 to-lime-200 relative overflow-hidden">
            {/* SVG Icon */}
            <div className="pt-[1vh] pl-[2vw]">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-14 h-14 cursor-pointer"
                    onClick={toggleSidebar} // Открытие sidebar
                    viewBox="0 0 100 100"
                    fill="none"
                >
                    <rect
                        x="100"
                        y="100"
                        width="100"
                        height="100"
                        rx="20"
                        transform="rotate(-180 100 100)"
                        className="fill-gray-300 opacity-70"
                    />
                    <path d="M73 66L27 66" stroke="black" strokeWidth="5" strokeLinecap="round" />
                    <path d="M73 50L27 50" stroke="black" strokeWidth="5" strokeLinecap="round" />
                    <path d="M73 34L27 34" stroke="black" strokeWidth="5" strokeLinecap="round" />
                </svg>
            </div>

            {/* Sidebar */}
            <DriverSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

            {/* Заголовок */}
            <div className="text-[4vh] font-semibold font-montserrat text-center pt-[10vh]">
                Gooo???
            </div>
            <Link to={'/travel/driver'} className='flex justify-center mt-[5vh]'>
                <button className='hover:opacity-85 border-[1px] py-[2vh] px-[4vw] bg-gradient-to-t from-lime-600 to-lime-400 text-[4vh] rounded-2xl font-ptsans font-[520]' >Start to taxi</button>
            </Link>

            <Link to={'/travel'} className='flex justify-center mt-[5vh]'>
                <button className='hover:opacity-85 border-[1px] py-[2vh] px-[4vw] bg-gradient-to-t from-lime-600 to-lime-400 text-[4vh] rounded-2xl font-ptsans font-[520]' >Start to travel</button>
            </Link>
        </div>
    );
}

export default DriverHome;
