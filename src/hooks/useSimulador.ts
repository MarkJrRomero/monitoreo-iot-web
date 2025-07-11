// src/hooks/useSimulador.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiUrl } from '../config/env';
import { useAuth } from './useAuth';

interface Vehicle {
  id: string;
  nombre: string;
}

interface SimuladorEstado {
  isRunning: boolean;
  vehicles: Vehicle[];
  totalVehicles: number;
}

interface SimuladorResponse {
  ok: boolean;
  data: SimuladorEstado;
}

// Función para obtener el estado del simulador
const fetchSimuladorEstado = async (headers: HeadersInit): Promise<SimuladorResponse> => {
  const response = await fetch(getApiUrl('/api/simulador/estado'), { 
    headers 
  });
  
  if (!response.ok) {
    throw new Error('Error al obtener estado del simulador');
  }
  
  return response.json();
};

// Función para iniciar el simulador
const iniciarSimulador = async (headers: HeadersInit): Promise<SimuladorResponse> => {
  const response = await fetch(getApiUrl('/api/simulador/iniciar'), {
    method: 'POST',
    headers,
  });
  
  if (!response.ok) {
    throw new Error('Error al iniciar el simulador');
  }
  
  return response.json();
};

// Función para detener el simulador
const detenerSimulador = async (headers: HeadersInit): Promise<SimuladorResponse> => {
  const response = await fetch(getApiUrl('/api/simulador/detener'), {
    method: 'POST',
    headers,
  });
  
  if (!response.ok) {
    throw new Error('Error al detener el simulador');
  }
  
  return response.json();
};

export const useSimulador = () => {
  const { getAuthHeaders } = useAuth();
  const queryClient = useQueryClient();

  // Query para obtener el estado del simulador
  const estadoQuery = useQuery({
    queryKey: ['simulador-estado'],
    queryFn: () => fetchSimuladorEstado(getAuthHeaders() as HeadersInit),
    refetchInterval: 5000, // Refrescar cada 5 segundos
  });

  // Mutation para iniciar simulador
  const iniciarMutation = useMutation({
    mutationFn: () => iniciarSimulador(getAuthHeaders() as HeadersInit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulador-estado'] });
    },
    onError: (error: Error) => {
      console.error('Error al iniciar simulador:', error);
    },
  });

  // Mutation para detener simulador
  const detenerMutation = useMutation({
    mutationFn: () => detenerSimulador(getAuthHeaders() as HeadersInit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulador-estado'] });
    },
    onError: (error: Error) => {
      console.error('Error al detener simulador:', error);
    },
  });

  return {
    // Estado
    estado: estadoQuery.data?.data,
    isLoading: estadoQuery.isLoading,
    isError: estadoQuery.isError,
    error: estadoQuery.error,
    
    // Acciones
    iniciar: iniciarMutation.mutate,
    detener: detenerMutation.mutate,
    
    // Estados de las mutations
    isIniciando: iniciarMutation.isPending,
    isDeteniendo: detenerMutation.isPending,
    iniciarError: iniciarMutation.error,
    detenerError: detenerMutation.error,
    
    // Refetch manual
    refetchEstado: estadoQuery.refetch,
  };
};