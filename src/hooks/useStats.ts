import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { type ApiResponse, type Vehicle, type VehicleAlert, type Stats } from '../models/stats';
import { getApiUrl } from '../config/env';
import { useAuth } from './useAuth';

// Función para obtener vehículos
const fetchVehicles = async (headers: HeadersInit): Promise<ApiResponse<Vehicle>> => {
  const response = await fetch(getApiUrl('/api/vehicles'), { headers });
  
  if (!response.ok) {
    throw new Error('Error al obtener vehículos');
  }
  
  return response.json();
};

// Función para obtener alertas
const fetchVehicleAlerts = async (headers: HeadersInit): Promise<ApiResponse<VehicleAlert>> => {
  const response = await fetch(getApiUrl('/api/vehicles/alerts'), { headers });
  
  if (!response.ok) {
    throw new Error('Error al obtener alertas');
  }
  
  return response.json();
};

// Función para calcular estadísticas
const calculateStats = (vehicles: Vehicle[], alerts: VehicleAlert[]): Stats => {
  const totalVehicles = vehicles.length;
  const totalAlerts = alerts.length;
  
  // Vehículos con alertas (únicos)
  const vehiclesWithAlerts = new Set(alerts.map(alert => alert.id)).size;
  
  // Promedios
  const averageFuel = vehicles.length > 0 
    ? vehicles.reduce((sum, vehicle) => sum + parseFloat(vehicle.combustible), 0) / vehicles.length
    : 0;
    
  const averageTemperature = vehicles.length > 0
    ? vehicles.reduce((sum, vehicle) => sum + parseFloat(vehicle.temperatura), 0) / vehicles.length
    : 0;
    
  const averageSpeed = vehicles.length > 0
    ? vehicles.reduce((sum, vehicle) => sum + parseFloat(vehicle.velocidad), 0) / vehicles.length
    : 0;
  
  // Tipos de alertas
  const alertTypes = alerts.reduce((acc, alert) => {
    const tipo = alert.tipo_alerta;
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
  
  return {
    totalVehicles,
    totalAlerts,
    vehiclesWithAlerts,
    averageFuel: Math.round(averageFuel),
    averageTemperature: Math.round(averageTemperature),
    averageSpeed: Math.round(averageSpeed),
    alertTypes,
  };
};

export const useStats = () => {
  const { getAuthHeaders } = useAuth();

  // Query para vehículos
  const vehiclesQuery = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => fetchVehicles(getAuthHeaders() as HeadersInit),
    refetchInterval: 30000, // Refrescar cada 30 segundos
    staleTime: 10000, // Considerar datos frescos por 10 segundos
  });

  // Query para alertas
  const alertsQuery = useQuery({
    queryKey: ['vehicle-alerts'],
    queryFn: () => fetchVehicleAlerts(getAuthHeaders() as HeadersInit),
    refetchInterval: 15000, // Refrescar cada 15 segundos
    staleTime: 5000, // Considerar datos frescos por 5 segundos
  });

  // Calcular estadísticas cuando ambos queries estén listos
  const stats = React.useMemo(() => {
    if (vehiclesQuery.data && alertsQuery.data) {
      return calculateStats(vehiclesQuery.data.data, alertsQuery.data.data);
    }
    return null;
  }, [vehiclesQuery.data, alertsQuery.data]);

  // Estados de carga y error
  const isLoading = vehiclesQuery.isLoading || alertsQuery.isLoading;
  const isError = vehiclesQuery.isError || alertsQuery.isError;
  const error = vehiclesQuery.error || alertsQuery.error;

  return {
    // Datos
    vehicles: vehiclesQuery.data?.data || [],
    alerts: alertsQuery.data?.data || [],
    stats,
    
    // Estados
    isLoading,
    isError,
    error,
    
    // Estados individuales
    vehiclesLoading: vehiclesQuery.isLoading,
    alertsLoading: alertsQuery.isLoading,
    vehiclesError: vehiclesQuery.error,
    alertsError: alertsQuery.error,
    
    // Funciones de refetch
    refetchVehicles: vehiclesQuery.refetch,
    refetchAlerts: alertsQuery.refetch,
  };
};

// Hook específico para estadísticas resumidas
export const useStatsSummary = () => {
  const { stats, isLoading, isError } = useStats();
  
  const summaryStats = React.useMemo(() => {
    if (!stats) return null;
    
    return [
      {
        label: 'Vehículos Activos',
        value: stats.totalVehicles.toString(),
        change: '+2',
        changeType: 'positive' as const,
        icon: '🚗',
      },
      {
        label: 'Alertas Activas',
        value: stats.totalAlerts.toString(),
        change: stats.totalAlerts > 0 ? `+${stats.totalAlerts}` : '0',
        changeType: stats.totalAlerts > 0 ? 'negative' as const : 'positive' as const,
        icon: '⚠️',
      },
      {
        label: 'Combustible Promedio',
        value: `${stats.averageFuel}%`,
        change: stats.averageFuel < 20 ? 'Bajo' : 'Normal',
        changeType: stats.averageFuel < 20 ? 'negative' as const : 'positive' as const,
        icon: '⛽',
      },
      {
        label: 'Temperatura Promedio',
        value: `${stats.averageTemperature}°C`,
        change: stats.averageTemperature > 80 ? 'Alta' : 'Normal',
        changeType: stats.averageTemperature > 80 ? 'negative' as const : 'positive' as const,
        icon: '🌡️',
      },
    ];
  }, [stats]);
  
  return {
    stats: summaryStats,
    isLoading,
    isError,
    rawStats: stats,
  };
};

// Hook para obtener vehículos con alertas
export const useVehiclesWithAlerts = () => {
  const { vehicles, alerts } = useStats();
  
  const vehiclesWithAlerts = React.useMemo(() => {
    const alertVehicleIds = new Set(alerts.map(alert => alert.id));
    return vehicles.filter(vehicle => alertVehicleIds.has(vehicle.id));
  }, [vehicles, alerts]);
  
  return vehiclesWithAlerts;
};

// Hook para obtener tipos de alertas
export const useAlertTypes = () => {
  const { alerts } = useStats();
  
  const alertTypes = React.useMemo(() => {
    return alerts.reduce((acc, alert) => {
      const tipo = alert.tipo_alerta;
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }, [alerts]);
  
  return alertTypes;
};
