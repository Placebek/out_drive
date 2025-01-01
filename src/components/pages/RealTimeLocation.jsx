import React, { useEffect, useState } from "react";

function RealTimeLocation() {
    const [userLocation, setUserLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            // Запускаем отслеживание
            const watcher = navigator.geolocation.watchPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error watching user location", error);
                    setError("Не удалось получить ваше местоположение.");
                },
                {
                    enableHighAccuracy: true, // Для большей точности
                    maximumAge: 0,            // Без кеширования
                    timeout: 10000,           // Тайм-аут запроса
                }
            );

            // Очищаем наблюдение при размонтировании компонента
            return () => {
                navigator.geolocation.clearWatch(watcher);
            };
        } else {
            console.error("Geolocation is not supported by this browser.");
            setError("Геолокация не поддерживается в вашем браузере.");
        }
    }, []);

    return (
        <div>
            {userLocation ? (
                <div>
                    <h2>Ваши текущие координаты:</h2>
                    <p>Широта: {userLocation.lat}</p>
                    <p>Долгота: {userLocation.lon}</p>
                </div>
            ) : (
                <p>Загрузка данных...</p>
            )}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}

export default RealTimeLocation;
