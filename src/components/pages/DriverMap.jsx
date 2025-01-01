import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRequestsAll } from '../../store/actions/requestsAction';
import WidgetsRequest from '../modals/WidgetsRequest';
import { Link } from 'react-router-dom';
import { setRequest } from '../../store/reducers/requestReducer';
import { de } from 'date-fns/locale';

function DriverMap() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const request = useSelector(state=>state.request.requests)
    
    useEffect(() => {
        const socket = new WebSocket('wss://192.168.193.31:8000/client/ws/requests');
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
            if (data) {
                dispatch(setRequest(data)); 
            } else {
                console.error("Expected an array, but received:", data.result);
            }
            setLoading(false);


        };
        return () => {
            socket.close();
        };
    }, [dispatch]);

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

    const reversedRequests = [...request].reverse(); 

    useEffect(() => {
        fetchRequests(); 
    }, []);

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
            {request && request.length > 0 ? (
                request.map((request) => (
                    <WidgetsRequest key={request.id} props={request} />
                ))
            ) : (
                <div>Заявки отсутствуют.</div>
            )}
        </div>
    );
}

export default DriverMap;
