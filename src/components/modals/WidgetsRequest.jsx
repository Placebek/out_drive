import React, { useEffect, useState } from 'react';
import { calculateDistance } from '../../utils/distance';
import { formatDistanceToNow } from 'date-fns';


function WidgetsRequest({ props }) {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState('');

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

  if (!userLocation) {
    return <div>Загрузка местоположения...</div>;
  }


  function getTimeAgo(createdAt) {
    const date = new Date(createdAt);
    return formatDistanceToNow(date)
  }

  const distance = calculateDistance(
    parseFloat(props.a_point_lat),
    parseFloat(props.a_point_lon),
    parseFloat(props.b_point_lat),
    parseFloat(props.b_point_lon)
  );

  const distanceToPassenger = calculateDistance(
    parseFloat(userLocation.lat),
    parseFloat(userLocation.lon),
    parseFloat(props.a_point_lat),
    parseFloat(props.a_point_lon)
  );


  return (
    <div className='border-[0.5px] border-lime-100 relative rounded-2xl p-3 bg-white/25 mb-[1vh]'>
      <div className='flex flex-col font-notosans'>
        <div className=' '>Approximate distance:  <span className='font-semibold'>{distance.toFixed(2)} km</span> </div>
        <div className=' '>Distance to passenger: <span className='font-semibold'> {distanceToPassenger.toFixed(2)} km</span> </div>
        <div className='font-semibold text-[2vh]'>{props.summ} Тг</div>
        <div className='absolute right-[2vw] '>{getTimeAgo(props.created_at)}</div>
        <div className='flex flex-row gap-x-[1vw]'>
          <div className=' '>{props.user.first_name}</div>
          <div className=' '>{props.user.last_name}</div>
        </div>
      </div>
    </div>
  );
}

export default WidgetsRequest;
