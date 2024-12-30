import React, { useEffect, useState } from 'react';
import { YMaps, Placemark, Map } from '@pbe/react-yandex-maps';
import axios from 'axios';

const Maps = () => {
    const [userLocation, setUserLocation] = useState(null); // Текущее местоположение
    const [destination, setDestination] = useState(null); // Точка Б
    const [mapInstance, setMapInstance] = useState(null); // Карта
    const [ymapsInstance, setYmapsInstance] = useState(null); // ymaps API
    const [price, setPrice] = useState(''); // Цена поездки
    const [error, setError] = useState('');

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
            start: userLocation,
            destination,
            price,
        };

        try {
            const response = await axios.post('http://localhost:8000/api/orders', requestData);
            alert('Заказ успешно отправлен!');
            console.log(response.data);
            // Очистка полей после успешной отправки
            setDestination(null);
            setPrice('');
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            alert('Не удалось отправить заказ. Попробуйте снова.');
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!userLocation) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ height: '100vh', position: 'relative' }}>
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

            {/* Форма подтверждения заказа */}
            {destination && (
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Цена поездки:</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Введите цену"
                            style={{ marginLeft: '10px', padding: '5px', width: '100px' }}
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            cursor: 'pointer',
                            borderRadius: '5px',
                        }}
                    >
                        Подтвердить заказ
                    </button>
                </div>
            )}
        </div>
    );
};

export default Maps;
