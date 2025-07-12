import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { type Vehicle } from '../models/stats';
import type { WebSocketMessage, VehicleAlert } from '../models/vehiclel';

export const useVehicleWebSocket = (vehicles: Vehicle[], onAlert: (alert: VehicleAlert) => void) => {
  const { token } = useAuth();
  const [vehicleData, setVehicleData] = useState<Record<string, Vehicle>>({});
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subscribedVehiclesRef = useRef<Set<string>>(new Set());
  const isConnectingRef = useRef(false);
  const vehiclesRef = useRef<Vehicle[]>([]);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    vehiclesRef.current = vehicles;
  }, [vehicles]);

  const connect = useCallback(() => {
    if (!token) {
      alert('Debes hacer login primero');
      return;
    }
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = import.meta.env.VITE_API_WS_HOST;
    const wsUrl = `${protocol}//${host}/ws?token=${token}`;
    const ws = new WebSocket(wsUrl);

    wsRef.current = ws;

    setIsReconnecting(true);
    

    ws.onopen = function() {
      setIsConnected(true);
      setIsReconnecting(false);
    };

    ws.onmessage = function(event) {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage;
        if (data.type === 'sensor_data' && data.vehicleId && data.data) {
          setVehicleData(prev => ({
            ...prev,
            [String(data.vehicleId)]: data.data as Vehicle
          }));
        }

        if (data.type === 'alert') {
          if (onAlert) onAlert(data as VehicleAlert);
        }

      } catch (error) {
        console.error('[WebSocket] Error parsing message', error);
      }
    };

    ws.onclose = function(event) {
      setIsConnected(false);
      console.error('[WebSocket] Disconnected', event.code, event.reason);
      setIsReconnecting(false);
    };

    ws.onerror = function(error) {
      console.error('Error en WebSocket:', error);
      console.error('[WebSocket] Error', error);
      setIsConnected(false);
      isConnectingRef.current = false;
      setIsReconnecting(false);
    };

  }, [token]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
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
      const vehicleCode = vehicle.dispositivo_id;
      if (!subscribedVehiclesRef.current.has(vehicleCode)) {
        const message = { type: 'subscribe', vehicleId: vehicleCode };
        wsRef.current?.send(JSON.stringify(message));
        subscribedVehiclesRef.current.add(vehicleCode);
      }
    });
  }, [isConnected]);

  useEffect(() => {
    if (token) {
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
    subscribedVehicles: Array.from(subscribedVehiclesRef.current),
    isReconnecting,
  };
};
