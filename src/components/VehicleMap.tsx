import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useStats } from '../hooks/useStats';
import { useVehicleWebSocket } from '../hooks/useVehicleWebSocket';
import { type LatLngExpression } from 'leaflet';



export const VehicleMap = () => {
  const { vehicles, isLoading } = useStats();
  const { vehicleData } = useVehicleWebSocket(vehicles);

  if (isLoading) return <p>Cargando vehículos...</p>;

  return (
    <MapContainer center={[4.65, -74.1]} zoom={11} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {vehicles.map(vehicle => {
        const data = vehicleData[vehicle.id];
        const position: LatLngExpression = data?.latitud && data?.longitud
          ? [Number(data.latitud), Number(data.longitud)]
          : [Number(vehicle.latitud), Number(vehicle.longitud)]; // fallback

        return (
          <Marker key={vehicle.id} position={position}>
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
  );
};
