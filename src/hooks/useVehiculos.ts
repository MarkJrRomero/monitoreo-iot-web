// src/hooks/useVehiculos.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiUrl } from '../config/env';
import { useAuth } from './useAuth';

interface Vehicle {
  id: number;
  nombre: string;
  dispositivo_id: string;
  usuario_id?: number;
  usuario_nombre?: string;
}

interface VehicleCreate {
  nombre: string;
  dispositivo_id: string;
  usuario_id?: number;
}

interface VehicleUpdate {
  nombre?: string;
  dispositivo_id?: string;
  usuario_id?: number;
}

interface PaginatedResponse<T> {
  ok: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface ApiResponse<T> {
  ok: boolean;
  message?: string;
  data: T;
}

// Función para obtener vehículos con paginación
const fetchVehicles = async (
  headers: HeadersInit, 
  logout: () => void,
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<PaginatedResponse<Vehicle>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search) {
    params.append('search', search);
  }

  const response = await fetch(getApiUrl(`/api/vehiculos?${params}`), { headers });
  
  if(response.status === 401 || response.status === 403){
    logout();
    window.location.href = '/';
  }

  if (!response.ok) {
    throw new Error('Error al obtener vehículos');
  }
  
  return response.json();
};

// Función para obtener un vehículo por ID
const fetchVehicleById = async (
  headers: HeadersInit, 
  logout: () => void,
  id: number
): Promise<ApiResponse<Vehicle>> => {
  const response = await fetch(getApiUrl(`/api/vehiculos/${id}`), { headers });
  
  if(response.status === 401 || response.status === 403){
    logout();
    window.location.href = '/';
  }

  if (!response.ok) {
    throw new Error('Error al obtener vehículo');
  }
  
  return response.json();
};

// Función para crear vehículo
const createVehicle = async (
  headers: HeadersInit, 
  logout: () => void,
  vehicleData: VehicleCreate
): Promise<ApiResponse<Vehicle>> => {
  const response = await fetch(getApiUrl('/api/vehiculos'), {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vehicleData),
  });
  
  if(response.status === 401 || response.status === 403){
    logout();
    window.location.href = '/';
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al crear vehículo');
  }
  
  return response.json();
};

// Función para actualizar vehículo
const updateVehicle = async (
  headers: HeadersInit, 
  logout: () => void,
  id: number,
  vehicleData: VehicleUpdate
): Promise<ApiResponse<Vehicle>> => {
  const response = await fetch(getApiUrl(`/api/vehiculos/${id}`), {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vehicleData),
  });
  
  if(response.status === 401 || response.status === 403){
    logout();
    window.location.href = '/';
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al actualizar vehículo');
  }
  
  return response.json();
};

// Función para eliminar vehículo
const deleteVehicle = async (
  headers: HeadersInit, 
  logout: () => void,
  id: number
): Promise<ApiResponse<Vehicle>> => {
  const response = await fetch(getApiUrl(`/api/vehiculos/${id}`), {
    method: 'DELETE',
    headers,
  });
  
  if(response.status === 401 || response.status === 403){
    logout();
    window.location.href = '/';
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al eliminar vehículo');
  }
  
  return response.json();
};

export const useVehicles = (page: number = 1, limit: number = 10, search?: string) => {
  const { getAuthHeaders, logout } = useAuth();

  return useQuery({
    queryKey: ['vehicles', page, limit, search],
    queryFn: () => fetchVehicles(getAuthHeaders() as HeadersInit, logout, page, limit, search),
  });
};

export const useVehicle = (id: number) => {
  const { getAuthHeaders, logout } = useAuth();

  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => fetchVehicleById(getAuthHeaders() as HeadersInit, logout, id),
    enabled: !!id,
  });
};

export const useCreateVehicle = () => {
  const { getAuthHeaders, logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleData: VehicleCreate) => 
      createVehicle(getAuthHeaders() as HeadersInit, logout, vehicleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useUpdateVehicle = () => {
  const { getAuthHeaders, logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, vehicleData }: { id: number; vehicleData: VehicleUpdate }) => 
      updateVehicle(getAuthHeaders() as HeadersInit, logout, id, vehicleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useDeleteVehicle = () => {
  const { getAuthHeaders, logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => 
      deleteVehicle(getAuthHeaders() as HeadersInit, logout, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};