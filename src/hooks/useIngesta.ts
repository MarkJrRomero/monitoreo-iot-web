// src/hooks/useIngesta.ts
import { useMutation } from '@tanstack/react-query';
import { getApiUrl } from '../config/env';
import { useAuth } from './useAuth';

interface SensorData {
  vehiculo_id: string;
  gps: string;
  combustible: number;
  temperatura: number;
  velocidad: number;
  latitud: number;
  longitud: number;
}

interface IngestaResponse {
  ok: boolean;
  data: any;
  websocket_sent: boolean;
}

// Función para enviar datos de sensores
const sendSensorData = async (
  headers: HeadersInit, 
  logout: () => void,
  sensorData: SensorData
): Promise<IngestaResponse> => {
  const response = await fetch(getApiUrl('/api/ingesta'), {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sensorData),
  });
  
  if(response.status === 401 || response.status === 403){
    logout();
    window.location.href = '/';
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al enviar datos de sensores');
  }
  
  return response.json();
};

export const useIngesta = () => {
  const { getAuthHeaders, logout } = useAuth();

  return useMutation({
    mutationFn: (sensorData: SensorData) => 
      sendSensorData(getAuthHeaders() as HeadersInit, logout, sensorData),
  });
};