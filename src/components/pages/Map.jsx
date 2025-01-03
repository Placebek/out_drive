import React, { useEffect, useState } from 'react';
import { YMaps, Placemark, Map } from '@pbe/react-yandex-maps';
import { useDispatch } from 'react-redux';
import { userRequest } from '../../store/actions/requestsAction';


const Maps = () => {
    const dispatch = useDispatch();
    // const { loading } = useSelector(state => state.request); 
    const [userLocation, setUserLocation] = useState(null); // Текущее местоположение
    const [destination, setDestination] = useState(null); // Точка Б
    const [mapInstance, setMapInstance] = useState(null); // Карта
    const [ymapsInstance, setYmapsInstance] = useState(null); // ymaps API
    const [price, setPrice] = useState(''); // Цена поездки
    const [error, setError] = useState('');
    const [status, setStatus] = useState('chooseDestination'); // Статус (выбор точки, ввод цены, ожидание)



    const connectWebsocket = () => {
        const token = localStorage.getItem('access_token'); 
        const socket = new WebSocket('wss://192.168.193.31:8000/driver/ws/client/');

        socket.onopen = () => {
            console.log('WebSocket connection established');
            socket.send(JSON.stringify({ type: "auth", token: token }));
        };

        socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
            const data = JSON.parse(event.data);
            setStatus('connect');
            if (mapInstance && ymapsInstance && userLocation) {
                createRoute(mapInstance, ymapsInstance, userLocation , {
                    lat: parseFloat(data['latitude']),
                    lon: parseFloat(data['longitude']),
                });
            }
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => socket.close(); 
    }

    // Получение геолокации пользователя
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting user location", error);
                    setError("Не удалось получить ваше местоположение.");
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 10000,
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            setError("Геолокация не поддерживается в вашем браузере.");
        }
    }, []);

    // Обработка клика по карте для выбора точки назначения
    const handleMapClick = (event) => {
        const coords = event.get('coords');
        setDestination({
            lat: coords[0],
            lon: coords[1],
        });

        // Если карта и ymaps загружены, строим маршрут
        if (mapInstance && ymapsInstance && userLocation) {
            createRoute(mapInstance, ymapsInstance, userLocation, {
                lat: coords[0],
                lon: coords[1],
            });
        }
    };

    // Функция построения маршрута
    const createRoute = (map, ymaps, start, end) => {
        if (!ymaps.multiRouter) {
            console.error("Yandex multiRouter is not loaded.");
            return;
        }

        // Удаляем предыдущий маршрут, если он существует
        map.geoObjects.removeAll();

        // Создаем маршрут
        const multiRoute = new ymaps.multiRouter.MultiRoute(
            {
                referencePoints: [
                    [start.lat, start.lon], // Начальная точка
                    [end.lat, end.lon],     // Конечная точка
                ],
                params: {
                    routingMode: 'auto', // Тип маршрута (авто)
                },
            },
            {
                wayPointStartIconColor: 'blue',
                wayPointFinishIconColor: 'red',
                routeStrokeWidth: 4,
                routeActiveStrokeColor: '#1E90FF',
            }
        );

        // Добавляем маршрут на карту
        map.geoObjects.add(multiRoute);
    };

    // Отправка данных на сервер
    const handleSubmit = async () => {
        if (!price || !destination) {
            alert('Пожалуйста, выберите точку назначения и укажите цену.');
            return;
        }

        const requestData = {
            a_point_lat: userLocation.lat.toString(), // Конвертация широты точки A в строку
            a_point_lon: userLocation.lon.toString(), // Конвертация долготы точки A в строку
            b_point_lat: destination.lat.toString(),  // Конвертация широты точки B в строку
            b_point_lon: destination.lon.toString(),  // Конвертация долготы точки B в строку
            summ: price,
        };


        try {
            setStatus('waiting');
            const response = await dispatch(userRequest(requestData))

            alert('Заказ успешно отправлен!');
            console.log(response);
            setDestination(null);
            setPrice('');
            // setStatus('chooseDestination'); 
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            alert('Не удалось отправить заказ. Попробуйте снова.');
            setStatus('chooseDestination');
        }
    };

    if (error) {
        return <div>{error}</div>;
    }
    if (!userLocation) {
        return (
            <div className="flex justify-center items-center h-screen w-screen bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="200" height="200">
                    <path
                        style={{ transform: 'scale(0.8)', transformOrigin: '50px 50px' }}
                        strokeLinecap="round"
                        d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
                        strokeDasharray="42.76482137044271 42.76482137044271"
                        strokeWidth="8"
                        stroke="#64ff3f"
                        fill="none"
                    >
                        <animate
                            values="0;256.58892822265625"
                            keyTimes="0;1"
                            dur="1s"
                            repeatCount="indefinite"
                            attributeName="stroke-dashoffset"
                        />
                    </path>
                </svg>
            </div>
        );
    }

    const connectWebsocketAndHandleSubmit = () =>{
        handleSubmit();
        connectWebsocket();
    }

    return (
        <div className="relative h-screen">
            <YMaps
                query={{
                    apikey: "6c6dd435-4d3f-4042-b687-df5e1b6d5cd6",
                    load: "package.full",
                }}
            >
                <Map
                    defaultState={{
                        center: [userLocation.lat, userLocation.lon],
                        zoom: 15,
                    }}
                    style={{ width: '100%', height: '100%' }}
                    options={{ suppressMapOpenBlock: true }}
                    onLoad={(ymaps) => setYmapsInstance(ymaps)}
                    instanceRef={(map) => setMapInstance(map)}
                    onClick={handleMapClick}
                >
                    {/* Точка пользователя */}
                    <Placemark
                        geometry={[userLocation.lat, userLocation.lon]}
                        properties={{
                            hintContent: 'Ваше местоположение',
                            balloonContent: 'Вы находитесь здесь',
                        }}
                    />
                    {/* Точка назначения (если выбрана) */}
                    {destination && (
                        <Placemark
                            geometry={[destination.lat, destination.lon]}
                            properties={{
                                hintContent: 'Точка назначения',
                                balloonContent: 'Вы выбрали это место',
                            }}
                        />
                    )}
                </Map>
            </YMaps>

            {/* Элемент для выбора точки Б */}
            {status === 'chooseDestination' && (
                <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white p-[2vh] text-[1.8vh] font-medium rounded-lg shadow-lg z-10">
                    <p>Please choose a point B </p>
                </div>
            )}

            {/* Форма подтверждения заказа */}
            {destination && status === 'chooseDestination' && (
                <div className="absolute bottom-[5vh] left-1/2 transform -translate-x-1/2 bg-white p-[5vw] rounded-lg shadow-lg z-10">
                    <div className="mb-[1vh]">
                        <label className="block mb-[0.5vh] text-[1.4vh]">Cost of the trip</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Введите цену"
                            className="px-[1.5vw] py-[1vh] border rounded-md focus:outline-lime-500 "
                        />
                    </div>
                    <button
                        onClick={connectWebsocketAndHandleSubmit}
                        className="bg-green-500 text-white py-[1.5vh] font-semibold text-[1.6vh] px-[3vw] translate-x-1/2 rounded-xl"
                    >
                        Send
                    </button>
                </div>
            )}

            {/* Ожидание после подтверждения */}
            {status === 'waiting' && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg z-10">
                    <p>Wait until a driver is found for you...</p>
                </div>
            )}
            {status === 'connect' && (
                <div className="absolute top-5 bg-white p-5 rounded-lg shadow-lg z-10">
                    <p>Your request was accept. B point is driver</p>
                </div>
            )}
        </div>
    );
};

export default Maps;
