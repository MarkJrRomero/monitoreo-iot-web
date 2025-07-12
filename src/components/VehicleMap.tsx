import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useStats } from "../hooks/useStats";
import { useVehicleWebSocket } from "../hooks/useVehicleWebSocket";
import { type LatLngExpression } from "leaflet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { VehicleAlert } from "../models/vehiclel";
import { useCallback, useEffect, useState, useMemo } from "react";
import { maskDeviceId } from "../config/utils";
import { useAuth } from "../hooks/useAuth";
import L from "leaflet";

export const VehicleMap = () => {
  const { vehicles, refetchAlerts } = useStats();
  const [shouldRefetchAlerts, setShouldRefetchAlerts] = useState(false);
  const { usuario } = useAuth();

  const vehicleIcon = useMemo(() => {
    return L.divIcon({
      html: `
        <div class="vehicle-marker">
          <div class="vehicle-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" fill="#4285F4"/>
            </svg>
          </div>
          <div class="vehicle-pulse bg-green-500"></div>
        </div>
      `,
      className: 'custom-vehicle-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }, []);

  const handleAlert = useCallback((alert: VehicleAlert) => {
    if (usuario?.rol === "admin") {
      setShouldRefetchAlerts(true);
      toast.warn(
        <div className="flex flex-col gap-2">
          ALERTA EN: {alert.alert.datos.nombre} -{" "}
          {alert.alert.datos.dispositivo_id}
          <strong>
            {alert.alert.tipo.includes("|") ? (
              <ul className="list-disc list-inside">
                {alert.alert.tipo.split("|").map((tipo, index) => (
                  <li key={index}>{tipo.trim().toUpperCase()}</li>
                ))}
              </ul>
            ) : (
              alert.alert.tipo.toUpperCase()
            )}
          </strong>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnFocusLoss: false,
          draggable: false,
          pauseOnHover: false,
          theme: "light",
          closeButton: false,
        }
      );
    }else{
      toast.info(
        <div className="flex flex-col gap-2">
          Hay nuevas alertas para verlas, solicita a tu supervisor que te asigne el rol de administrador
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnFocusLoss: false,
          draggable: false,
          pauseOnHover: false,
          theme: "light",
          closeButton: false,
        }
      );
    }
  }, []);

  useEffect(() => {
    if (shouldRefetchAlerts) {
      refetchAlerts();
      setShouldRefetchAlerts(false);
    }
  }, [shouldRefetchAlerts, refetchAlerts]);

  const { vehicleData, isConnected, connect, disconnect, isReconnecting } =
    useVehicleWebSocket(vehicles, handleAlert);

  const handleReconnect = () => {
    disconnect();
    setTimeout(() => {
      connect();
    }, 1000);
  };

  return (
    <div className="flex flex-col mt-8">
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Mapa en Tiempo Real
            </h1>
            <p className="text-sm text-gray-500">
              Ubicación de vehículos en tiempo real
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isReconnecting
                    ? "bg-yellow-500 animate-spin"
                    : isConnected
                    ? "bg-green-500 animate-pulse"
                    : "bg-red-500"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isReconnecting
                    ? "text-yellow-600"
                    : isConnected
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {isReconnecting
                  ? "Reconectando..."
                  : isConnected
                  ? "Conectado"
                  : "Desconectado"}
              </span>
            </div>

            {!isConnected && !isReconnecting && (
              <button
                onClick={handleReconnect}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Reconectar</span>
              </button>
            )}

            {isReconnecting && (
              <div className="flex items-center space-x-2 px-3 py-1 text-sm text-yellow-600 bg-yellow-50 rounded-md">
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Conectando...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 relative"></div>
      <MapContainer
        center={[4.65, -74.1]}
        zoom={11}
        style={{ height: "500px", width: "100%"}}
        className="google-maps-style"
        touchZoom={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        keyboard={false}
        attributionControl={false}
      >
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"        />
        {vehicles.map((vehicle) => {
          const data = vehicleData[vehicle.dispositivo_id];
          const position: LatLngExpression =
            data?.latitud && data?.longitud
              ? [Number(data.latitud), Number(data.longitud)]
              : [Number(vehicle.latitud), Number(vehicle.longitud)];

          return (
            <Marker 
              key={vehicle.dispositivo_id} 
              position={position}
              icon={vehicleIcon}
            >
              <Popup className="vehicle-popup">
                <div className="vehicle-popup-content">
                  <div className="vehicle-header">
                    <strong className="vehicle-name">{vehicle.nombre}</strong>
                    <span className="vehicle-id">
                      {maskDeviceId(vehicle.dispositivo_id, usuario?.rol)}
                    </span>
                  </div>
                  <div className="vehicle-stats">
                    <div className="stat-item">
                      <span className="stat-label">Velocidad:</span>
                      <span className="stat-value">{data?.velocidad || vehicle.velocidad} km/h</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Temperatura:</span>
                      <span className="stat-value">{data?.temperatura || vehicle.temperatura} °C</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Combustible:</span>
                      <span className="stat-value">{data?.combustible || vehicle.combustible} %</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      <style>{`
        .google-maps-style {
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 10 !important;
        }
        
        .custom-vehicle-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .vehicle-marker {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .vehicle-icon {
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
        
        .vehicle-pulse {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(66, 133, 244, 0.3);
          animation: pulse 2s infinite;
          z-index: 1;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        .vehicle-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          border: none;
        }
        
        .vehicle-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        
        .vehicle-popup-content {
          padding: 16px;
          min-width: 200px;
        }
        
        .vehicle-header {
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .vehicle-name {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }
        
        .vehicle-id {
          font-size: 12px;
          color: #6b7280;
          font-family: 'Courier New', monospace;
        }
        
        .vehicle-stats {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .stat-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }
        
        .stat-value {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }
        
        .leaflet-popup-tip {
          background: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};
