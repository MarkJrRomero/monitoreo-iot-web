import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useStats } from '../hooks/useStats';
import { useVehicleWebSocket } from '../hooks/useVehicleWebSocket';
import { type LatLngExpression } from 'leaflet';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { VehicleAlert } from '../models/vehiclel';
import { useCallback, useEffect, useState } from 'react';

export const VehicleMap = () => {
  const { vehicles, isLoading, refetchAlerts } = useStats();
  const [shouldRefetchAlerts, setShouldRefetchAlerts] = useState(false);

  // Callback para mostrar la alerta
  const handleAlert = useCallback((alert: VehicleAlert) => {
    setShouldRefetchAlerts(true); // Marcar que necesitamos refetch
    toast.warn(
        <div className='flex flex-col gap-2'>
          ALERTA EN: {alert.alert.datos.nombre} - {alert.alert.datos.dispositivo_id}
          <strong>
            {alert.alert.tipo.includes('|') ? (
              <ul className="list-disc list-inside">
                {alert.alert.tipo.split('|').map((tipo, index) => (
                  <li key={index}>{tipo.trim().toUpperCase()}</li>
                ))}
              </ul>
            ) : (
              alert.alert.tipo.toUpperCase()
            )}
          </strong> 
        </div>
    );
  }, []);

  // Efecto para hacer refetch cuando hay una alerta nueva
  useEffect(() => {
    if (shouldRefetchAlerts) {
      refetchAlerts();
      setShouldRefetchAlerts(false);
    }
  }, [shouldRefetchAlerts, refetchAlerts]);

  // Pasa el callback al hook
  const { vehicleData } = useVehicleWebSocket(vehicles, handleAlert);

  if (isLoading) return <p>Cargando vehículos...</p>;

  return (
    <>
      <MapContainer center={[4.65, -74.1]} zoom={11} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {vehicles.map(vehicle => {
          // Cambia aquí: usa dispositivo_id
          const data = vehicleData[vehicle.dispositivo_id];
          const position: LatLngExpression = data?.latitud && data?.longitud
            ? [Number(data.latitud), Number(data.longitud)]
            : [Number(vehicle.latitud), Number(vehicle.longitud)]; // fallback

          return (
            <Marker key={vehicle.dispositivo_id} position={position}>
              <Popup>
                <strong>{vehicle.nombre}</strong><br />
                Velocidad: {data?.velocidad || vehicle.velocidad} km/h<br />
                Temperatura: {data?.temperatura || vehicle.temperatura} °C<br />
                Combustible: {data?.combustible || vehicle.combustible} %
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};
