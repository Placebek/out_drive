import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { createOrder, delOrder } from '../../store/actions/ordersAction';
import { calculateDistance } from '../../utils/distance';

function DriverMapDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [mapInstance, setMapInstance] = useState(null);
    const [ymapsInstance, setYmapsInstance] = useState(null);
    const selectedRequest = useSelector((state) => state.request.selectedRequest);
    const [driverLocation, setDriverLocation] = useState([0, 0]);
    const [mapState, setMapState] = useState({
        center: [0, 0],
        zoom: 20,
    });

    const [route, setRoute] = useState(null);
    const [step, setStep] = useState('driverToClient');

    const aPoint = useMemo(
        () => [selectedRequest?.a_point_lat, selectedRequest?.a_point_lon],
        [selectedRequest?.a_point_lat, selectedRequest?.a_point_lon]
    );

    const bPoint = useMemo(
        () => [selectedRequest?.b_point_lat, selectedRequest?.b_point_lon],
        [selectedRequest?.b_point_lat, selectedRequest?.b_point_lon]
    );

    const orderData = {
        request_id: selectedRequest.id,
    };
    const distance = calculateDistance(
        parseFloat(selectedRequest.a_point_lat),
        parseFloat(selectedRequest.a_point_lon),
        parseFloat(selectedRequest.b_point_lat),
        parseFloat(selectedRequest.b_point_lon)
    );

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setDriverLocation([latitude, longitude]);
                    setMapState({
                        center: [latitude, longitude],
                        zoom: 9,
                    });
                },
                (error) => {
                    console.error('Ошибка получения геолокации:', error);
                    alert('Не удалось определить ваше местоположение.');
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            alert('Геолокация не поддерживается вашим устройством.');
        }
    }, []);

    const handleConfirm = async () => {
        try {
            await dispatch(createOrder(orderData));
            alert('Заявка подтверждена!');
            setStep('clientToDestination');
            setMapState({ center: driverLocation, zoom: 10 });
        } catch (error) {
            console.error('Ошибка подтверждения заявки:', error);
        }   
    };

    useEffect(() => {
        if (mapInstance && ymapsInstance && driverLocation[0]) {
            createRoute(mapInstance, ymapsInstance, driverLocation, step === 'driverToClient' ? aPoint : bPoint);
        }
    }, [driverLocation, mapInstance, ymapsInstance, step, aPoint, bPoint]);


    const createRoute = (map, ymaps, start, end) => {
        debugger
        if (!ymaps.multiRouter) {
            console.error("Yandex multiRouter is not loaded.");
            return;

        }

        map.geoObjects.removeAll();
        
        const multiRoute = new ymaps.multiRouter.MultiRoute(
            {
                referencePoints: [
                    [start[0], start[1]],
                    [end[0], end[1]],
                ],
                params: {
                    routingMode: 'auto',
                },
            },
            {
                wayPointStartIconColor: 'blue',
                wayPointFinishIconColor: 'red',
                routeStrokeWidth: 4,
                routeActiveStrokeColor: '#1E90FF',
            }
        );

        map.geoObjects.add(multiRoute);
    };



    const handleArrived = () => {
        setStep('clientToDestination');
    };

    if (!selectedRequest) {
        return (
            <div className="text-center text-red-600 font-bold text-xl">
                Заявка не выбрана. Вернитесь к списку заявок.
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-6 p-6 bg-lime-100 min-h-screen">
            <h1 className="text-3xl font-bold text-lime-800">
                Request details <span className="text-lime-600">{selectedRequest.user.first_name} {selectedRequest.user.last_name}</span>
            </h1>
            <div className="text-2xl font-semibold text-lime-700">
                Reward: <span className="text-lime-900">{selectedRequest.summ} Тг</span>
            </div>
            <div className="text-xl text-lime-600">
                Required distance: <span className="text-lime-800">{distance.toFixed(2)} km</span>
            </div>

            {/* Карта */}
            <div className="w-full h-[60vh] border-4 border-lime-500 rounded-xl shadow-lg overflow-hidden">
                <YMaps query={{ apikey: '6c6dd435-4d3f-4042-b687-df5e1b6d5cd6', load: 'package.full' }}>
                    <Map
                        defaultState={mapState}
                        style={{ width: '100%', height: '100%' }}
                        onLoad={(ymaps) => setYmapsInstance(ymaps)}
                        instanceRef={(map) => setMapInstance(map)}

                    >
                        {/* Метка водителя */}
                        {driverLocation[0] && (
                            <Placemark
                                geometry={driverLocation}
                                options={{ preset: 'islands#greenCircleDotIcon' }}
                                properties={{ hintContent: 'Вы (водитель)' }}
                            />
                        )}
                        {/* Метка клиента (точка A) */}
                        {aPoint[0] && (
                            <Placemark
                                geometry={aPoint}
                                options={{ preset: 'islands#blueCircleDotIcon' }}
                                properties={{ hintContent: 'Клиент (точка A)' }}
                            />
                        )}
                        {/* Метка точки назначения (точка B) */}
                        {bPoint[0] && (
                            <Placemark
                                geometry={bPoint}
                                options={{ preset: 'islands#redCircleDotIcon' }}
                                properties={{ hintContent: 'Точка назначения (точка B)' }}
                            />
                        )}
                    </Map>
                </YMaps>
            </div>

            {/* Кнопки */}
            <div className="flex gap-4">
                <button
                    className="bg-lime-600 text-white px-8 py-3 rounded-lg font-semibold text-xl hover:bg-lime-700 transition duration-300 shadow-md"
                    onClick={() => navigate('/travel/driver')}
                >
                    Back
                </button>
                {step === 'driverToClient' && (
                    <button
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-xl hover:bg-blue-700 transition duration-300 shadow-md"
                        onClick={handleConfirm}>
                        Confirm the order
                    </button>
                )}
                {step === 'clientToDestination' && (
                    <button
                        className="bg-lime-600 text-white px-8 py-3 rounded-lg font-semibold text-xl hover:bg-lime-700 transition duration-300 shadow-md"
                        onClick={handleArrived}
                    >
                        Построить маршрут к точке B
                    </button>
                )}
            </div>
        </div>
    );
}

export default DriverMapDetail;
