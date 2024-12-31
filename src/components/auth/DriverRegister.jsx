import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerTaxies } from '../../store/actions/authActions'; // Path to your actions

function DriverRegister() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        mark_name: "",
        color: "",
        number_car: "",
        photo: "https://cdn-icons-png.flaticon.com/512/1535/1535791.png",  // Default URL
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create the object with data to be sent to the server
        const dataToSend = {
            mark_name: formData.mark_name,
            color: formData.color,
            number_car: formData.number_car,
            photo: formData.photo,  // Sending the photo URL
        };

        try {
            // Send data to the server via dispatch
            const response = await dispatch(registerTaxies(dataToSend));

            // Ensure that registration was successful
            if (response?.payload) {
                // Successful registration, navigate to the main page
                navigate('/');
                alert("Driver successfully registered!");
            }
        } catch (error) {
            alert("Error during driver registration: " + error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "photo") {
            // If uploading a photo, send the URL of the photo to the server
            setFormData((prev) => ({ ...prev, photo: URL.createObjectURL(files[0]) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="w-screen h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col justify-center items-center">
            <Link to="/" className="absolute left-6 top-6 text-white text-xl">
                <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 404.43">
                    <path fill-rule="nonzero" d="m68.69 184.48 443.31.55v34.98l-438.96-.54 173.67 159.15-23.6 25.79L0 199.94 218.6.02l23.6 25.79z" />
                </svg>
            </Link>

            <div className="bg-white/80 border border-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
                <div className="text-center text-3xl font-bold text-blue-700 mb-4">Driver Registration</div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {formData.photo && (
                        <div className="flex justify-center mb-4">
                            <img src={formData.photo} alt="Preview" className="w-32 h-32 object-cover rounded-full border-4 border-blue-500" />
                        </div>
                    )}
                    <div>
                        <label htmlFor="photo" className="block text-sm font-semibold text-gray-700">Photo:</label>
                        <input
                            type="file"
                            id="photo"
                            name="photo"
                            accept="image/*"
                            onChange={handleInputChange}
                            className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="mark_name" className="block text-sm font-semibold text-gray-700">Car Brand:</label>
                        <input
                            type="text"
                            id="mark_name"
                            name="mark_name"
                            value={formData.mark_name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="color" className="block text-sm font-semibold text-gray-700">Color:</label>
                        <input
                            type="text"
                            id="color"
                            name="color"
                            value={formData.color}
                            onChange={handleInputChange}
                            className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="number_car" className="block text-sm font-semibold text-gray-700">Car Number:</label>
                        <input
                            type="text"
                            id="number_car"
                            name="number_car"
                            value={formData.number_car}
                            onChange={handleInputChange}
                            className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-4 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>

                    {error && <div className="text-red-500 text-center mt-2">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default DriverRegister;
