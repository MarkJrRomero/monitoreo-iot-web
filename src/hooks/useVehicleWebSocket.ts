import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { type Vehicle } from '../models/stats';

export const useVehicleWebSocket = (vehicles: Vehicle[]) => {
  const { token } = useAuth();
  const [vehicleData, setVehicleData] = useState<Record<string, Vehicle>>({});
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subscribedVehiclesRef = useRef<Set<string>>(new Set()); // <- Usamos código string
  const isConnectingRef = useRef(false);
  const vehiclesRef = useRef<Vehicle[]>([]);

  useEffect(() => {
    vehiclesRef.current = vehicles;
  }, [vehicles]);

  function connect() {
    if (!token) {
        alert('Debes hacer login primero');
        return;
    }
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = import.meta.env.VITE_API_URL;
    const wsUrl = `${protocol}//${host}?token=${token}`;
    
    console.log('Conectando a:', wsUrl);
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = function() {
        setIsConnected(true);
        console.log('Conexión establecida y autenticada');
    };

    ws.onmessage = function(event) {
        console.log('Mensaje recibido:', event.data);
        try {
            const data = JSON.parse(event.data);
            console.log('[WebSocket] Received:', data);
        } catch (error) {
            console.error('[WebSocket] Error parsing message', error);
        }
    };

    ws.onclose = function(event) {
        setIsConnected(false);
        console.log('[WebSocket] Disconnected', event.code, event.reason);
    };

    ws.onerror = function(error) {
        console.error('Error en WebSocket:', error);
        console.error('[WebSocket] Error', error);
        setIsConnected(false);
        isConnectingRef.current = false;
    };
    
  }

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      console.log('[WebSocket] Disconnecting...');
      subscribedVehiclesRef.current.forEach(vehicleCode => {
        const message = { type: 'unsubscribe', vehicleId: vehicleCode };
        wsRef.current?.send(JSON.stringify(message));
      });

      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    isConnectingRef.current = false;
    subscribedVehiclesRef.current.clear();
  }, []);

  const subscribeToNewVehicles = useCallback(() => {
    if (!isConnected || !wsRef.current) return;

    const currentVehicles = vehiclesRef.current;
    currentVehicles.forEach(vehicle => {
      const vehicleCode = vehicle.id.toString();
      if (!subscribedVehiclesRef.current.has(vehicleCode)) {
        const message = { type: 'subscribe', vehicleId: vehicleCode };
        wsRef.current?.send(JSON.stringify(message));
        subscribedVehiclesRef.current.add(vehicleCode);
      }
    });
  }, [isConnected]);

  useEffect(() => {
    if (token && vehicles.length > 0) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [token, connect, disconnect]);

  useEffect(() => {
    if (isConnected && vehicles.length > 0) {
      const timer = setTimeout(() => {
        subscribeToNewVehicles();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [vehicles, isConnected, subscribeToNewVehicles]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    vehicleData,
    isConnected,
    connect,
    disconnect,
    subscribedVehicles: Array.from(subscribedVehiclesRef.current)
  };
};
