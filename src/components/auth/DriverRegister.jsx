import React from 'react'
import { Link } from 'react-router-dom'

function DriverRegister() {
    return (
        <div className="w-screen h-screen bg-custom-gradient flex flex-col justify-center items-center">
            <Link to={'/'} className='absolute left-3 top-3  h-[2vh] w-[6vh]'>
                <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 404.43"><path fill-rule="nonzero" d="m68.69 184.48 443.31.55v34.98l-438.96-.54 173.67 159.15-23.6 25.79L0 199.94 218.6.02l23.6 25.79z" /></svg>
            </Link>
            
            <div className="border-[1px] border-white bg-white/85 h-[60vh] w-[85vw] rounded-[25px] shadow-2xl py-[2vh] px-[5vw]">
                <div className="text-center text-[5vh] font-semibold font-ptsans">Register Driver</div>
                <div className="text-center mt-2">
                   
                </div>
            </div>
        </div>

    )
}

export default DriverRegister