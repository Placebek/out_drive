import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DriverRegister({role, setRole}) {
    const navigate = useNavigate() 
    const [formData, setFormData] = useState({
        mark_name: "",
        color: "",
        number_car: "",
        photo: "https://cdn-icons-png.flaticon.com/512/1535/1535791.png",
    });

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "photo" && files && files.length > 0) {
            const file = files[0];
            const fileURL = URL.createObjectURL(file);
            setFormData((prev) => ({ ...prev, photo: fileURL })); 
        } else {
            setFormData((prev) => ({ ...prev, [name]: value })); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            mark_name: formData.mark_name,
            color: formData.color,
            number_car: formData.number_car,
            photo: formData.photo, 
        };

        console.log("Отправляемые данные:", dataToSend);

        try {
            const response = await fetch('https://192.168.0.12:8000/auth/driver/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 
                },
                body: JSON.stringify(dataToSend),
            });
            if (response.ok) {
                localStorage.setItem('original_roles', 'driver');
                setRole('driver')
                alert('Driver successfully registered!');
                navigate('/');
            } else {
                alert('You already have driver account');
                navigate('/')
            }
        } catch (error) {
            console.error("Ошибка регистрации:", error);
            alert('Error during registration!');
        }
    };

    return (
        <div className="w-screen h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col justify-center items-center">
            <div className="bg-white/80 border border-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
                <div className="text-center text-3xl font-bold text-blue-700 mb-4">Driver Registration</div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {formData.photo && (
                        <div className="flex justify-center mb-4">
                            <img src={formData.photo} alt="Preview" className="w-32 h-32 object-cover rounded-full border-4 border-blue-500" />
                        </div>
                    )}
                    <div>
                        <label htmlFor="photo" className="block text-sm font-semibold text-gray-700">Upload Photo:</label>
                        <input
                            type="file"
                            id="photo"
                            name="photo"
                            accept="image/*"
                            onChange={handleInputChange}
                            className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
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
                            className="w-full py-2 px-4 text-white font-semibold bg-blue-500 hover:bg-blue-600 rounded-md"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DriverRegister;
