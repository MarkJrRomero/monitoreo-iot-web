import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useStats } from '../hooks/useStats';
import { useVehicleWebSocket } from '../hooks/useVehicleWebSocket';
import { useAuth } from '../hooks/useAuth';
import { maskDeviceId } from '../config/utils';
import type { VehicleAlert } from '../models/vehiclel';

// Tipo específico para alertas en tiempo real
interface RealTimeAlert {
  dispositivo_id: string;
  tipo_alerta: string;
  combustible: number;
  temperatura: number;
  velocidad: number;
  estado: string;
  isRealTime: boolean;
}

const Alertas: React.FC = () => {
  const { alerts, vehicles, isLoading } = useStats();
  const { usuario } = useAuth();
  const [realTimeAlerts, setRealTimeAlerts] = useState<RealTimeAlert[]>([]);
  const [shouldRefetchAlerts, setShouldRefetchAlerts] = useState(false);

  // Callback para manejar alertas en tiempo real
  const handleRealTimeAlert = useCallback((alert: VehicleAlert) => {
    console.log('Alerta en tiempo real recibida:', alert);
    
    // Agregar la nueva alerta al estado local
    setRealTimeAlerts(prev => {
      const newAlert: RealTimeAlert = {
        dispositivo_id: alert.alert.datos.dispositivo_id,
        tipo_alerta: alert.alert.tipo,
        combustible: alert.alert.datos.combustible,
        temperatura: alert.alert.datos.temperatura,
        velocidad: alert.alert.datos.velocidad,
        estado: alert.alert.datos.estado,
        isRealTime: true,
      };
      
      // Evitar duplicados basándose en dispositivo_id y timestamp
      const existingIndex = prev.findIndex(a => a.dispositivo_id === newAlert.dispositivo_id);
      
      if (existingIndex >= 0) {
        // Si ya existe, actualizar la alerta existente en lugar de agregar una nueva
        const updatedAlerts = [...prev];
        updatedAlerts[existingIndex] = newAlert;
        return updatedAlerts;
      }
      
      // Si no existe, agregar al inicio del array
      return [newAlert, ...prev];
    });
    
    // Marcar que necesitamos refetch de alertas
    setShouldRefetchAlerts(true);
    
  }, []);

  // Usar el WebSocket
  const { isConnected, isReconnecting } = useVehicleWebSocket(vehicles, handleRealTimeAlert);

  // Refetch de alertas cuando llegan nuevas
  useEffect(() => {
    if (shouldRefetchAlerts) {
      // Aquí podrías hacer un refetch de las alertas si es necesario
      // Por ahora, solo reseteamos el flag
      setShouldRefetchAlerts(false);
    }
  }, [shouldRefetchAlerts]);

  // Combinar alertas estáticas con alertas en tiempo real, evitando duplicados
  const allAlerts = useMemo(() => {
    // Crear un Map para evitar duplicados basándose en dispositivo_id
    const alertsMap = new Map<string, RealTimeAlert | (typeof alerts[0] & { isRealTime: boolean })>();
    
    // Agregar alertas estáticas primero
    alerts.forEach(alert => {
      alertsMap.set(alert.dispositivo_id, {
        ...alert,
        isRealTime: false,
      });
    });
    
    // Agregar alertas en tiempo real, sobrescribiendo las estáticas si existen
    realTimeAlerts.forEach(alert => {
      alertsMap.set(alert.dispositivo_id, alert);
    });
    
    return Array.from(alertsMap.values());
  }, [alerts, realTimeAlerts]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getVehicleName = (dispositivo_id: string) => {
    const vehicle = vehicles.find(v => v.dispositivo_id === dispositivo_id);
    return vehicle?.nombre || 'Vehículo desconocido';
  };

  const getVehicleDeviceId = (dispositivo_id: string) => {
    const vehicle = vehicles.find(v => v.dispositivo_id === dispositivo_id);
    return vehicle?.dispositivo_id || '';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Alertas Activas
            </h1>
            <p className="text-gray-600">
              {allAlerts.length} alerta{allAlerts.length !== 1 ? 's' : ''} activa{allAlerts.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Indicador de estado del WebSocket */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Conectado' : isReconnecting ? 'Reconectando...' : 'Desconectado'}
            </span>
          </div>
        </div>
      </div>

      {allAlerts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No hay alertas activas
          </h2>
          <p className="text-gray-500">
            Todos los vehículos están funcionando correctamente
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allAlerts.map((alert, index) => (
            <div
              key={`${alert.dispositivo_id}-${index}`}
              className={`bg-white rounded-lg shadow-md border-l-4 p-6 hover:shadow-lg transition-shadow ${
                alert.isRealTime
                  ? 'border-red-500 animate-pulse'
                  : 'border-orange-500'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {getVehicleName(alert.dispositivo_id)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ID: {usuario?.rol === 'admin' 
                      ? getVehicleDeviceId(alert.dispositivo_id)
                      : maskDeviceId(getVehicleDeviceId(alert.dispositivo_id), usuario?.rol)
                    }
                  </p>
                  {alert.isRealTime && (
                    <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      NUEVA
                    </span>
                  )}
                </div>
               
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Combustible:</span>
                  <span className="font-medium">{alert.combustible}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Temperatura:</span>
                  <span className="font-medium">{alert.temperatura}°C</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Velocidad:</span>
                  <span className="font-medium">{alert.velocidad} km/h</span>
                </div>
                <div className="flex justify-start text-sm">
                  <div className="text-right">
                    {alert.estado.includes('|') ? (
                      <ul className="list-disc list-inside text-orange-600 font-medium text-start">
                        {alert.estado.split('|').map((estado: string, index: number) => (
                          <li key={index} className="text-xs">
                            {estado.trim().toUpperCase()}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="font-medium text-red-600 text-start">{alert.estado.toUpperCase()}</span>
                    )}
                  </div>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Alertas;