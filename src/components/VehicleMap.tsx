import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useStats } from "../hooks/useStats";
import { useVehicleWebSocket } from "../hooks/useVehicleWebSocket";
import { type LatLngExpression } from "leaflet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { VehicleAlert } from "../models/vehiclel";
import { useCallback, useEffect, useState } from "react";
import { maskDeviceId } from "../config/utils";
import { useAuth } from "../hooks/useAuth";

export const VehicleMap = () => {
  const { vehicles, refetchAlerts } = useStats();
  const [shouldRefetchAlerts, setShouldRefetchAlerts] = useState(false);
  const { usuario } = useAuth();
  // Callback para mostrar la alerta
  const handleAlert = useCallback((alert: VehicleAlert) => {
    if (usuario?.rol === "admin") {
      setShouldRefetchAlerts(true); // Marcar que necesitamos refetch
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

  // Efecto para hacer refetch cuando hay una alerta nueva
  useEffect(() => {
    if (shouldRefetchAlerts) {
      refetchAlerts();
      setShouldRefetchAlerts(false);
    }
  }, [shouldRefetchAlerts, refetchAlerts]);

  // Pasa el callback al hook
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

          {/* Indicador de estado del WebSocket */}
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
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {vehicles.map((vehicle) => {
          // Cambia aquí: usa dispositivo_id
          const data = vehicleData[vehicle.dispositivo_id];
          const position: LatLngExpression =
            data?.latitud && data?.longitud
              ? [Number(data.latitud), Number(data.longitud)]
              : [Number(vehicle.latitud), Number(vehicle.longitud)]; // fallback

          return (
            <Marker key={vehicle.dispositivo_id} position={position}>
              <Popup>
                <strong>{vehicle.nombre}</strong> {" - "}
                <strong>
                  {maskDeviceId(vehicle.dispositivo_id, usuario?.rol)}
                </strong>
                <br />
                Velocidad: {data?.velocidad || vehicle.velocidad} km/h
                <br />
                Temperatura: {data?.temperatura || vehicle.temperatura} °C
                <br />
                Combustible: {data?.combustible || vehicle.combustible} %
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <ToastContainer />
    </div>
  );
};
