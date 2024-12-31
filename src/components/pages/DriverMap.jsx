import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRequestsAll } from '../../store/actions/requestsAction';
import WidgetsRequest from '../modals/WidgetsRequest';
import { Link } from 'react-router-dom';
import { setRequest } from '../../store/reducers/requestReducer';

function DriverMap() {
    const dispatch = useDispatch();
    const request = useSelector(state=>state.request.requests)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('wss://192.168.193.31:8000/client/ws');
        setLoading(true);

        socket.onopen = () => {
            console.log("WebSocket connection established.");
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed.");
        };

        socket.onmessage = (event) => {
            console.log("WebSocket message received:", event.data);
            const data = JSON.parse(event.data);
            if (Array.isArray(data.result)) {
                debugger
                setRequest(data.result); 
            } else {
                console.error("Expected an array, but received:", data.result);
            }

            setLoading(false);
        };

        // Очистка при закрытии соединения WebSocket
        return () => {
            socket.close();
        };
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            await dispatch(getRequestsAll());
        } catch (err) {
            setError(err.message || 'Произошла ошибка при загрузке заявок');
        } finally {
            setLoading(false);
        }
    };

    const reversedRequests = [...request].reverse(); // Инвертируем список заявок

    useEffect(() => {
        fetchRequests(); // Загружаем заявки при монтировании компонента
    }, [dispatch]);

    if (loading) {
        return <div>Загрузка заявок...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    return (
        <div className='h-screen w-screen bg-gradient-to-t from-lime-500 to-lime-200 relative overflow-auto py-[2vh] px-[3vw]'>
            <div className='flex flex-row gap-x-[2vh]'>
                <div className='h-[2vh] w-[7vw] mt-[1vh]'>
                    <Link to="/">
                        <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 404.43">
                            <path fill-rule="nonzero" d="m68.69 184.48 443.31.55v34.98l-438.96-.54 173.67 159.15-23.6 25.79L0 199.94 218.6.02l23.6 25.79z" />
                        </svg>
                    </Link>
                </div>
                <div className='text-[3vh] font-montserrat font-semibold mb-[2vh]'>List Requests</div>
            </div>
            {reversedRequests && reversedRequests.length > 0 ? (
                reversedRequests.map((request) => (
                    <WidgetsRequest key={request.id} props={request} />
                ))
            ) : (
                <div>Заявки отсутствуют.</div>
            )}
        </div>
    );
}

export default DriverMap;
