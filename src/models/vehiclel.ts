export interface WebSocketMessage {
    type: string;
    vehicleId?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    message?: string;
    error?: string;
  }
  
  export interface VehicleLocation {
    id: number;
    nombre: string;
    dispositivo_id: string;
    latitud: string;
    longitud: string;
    estado: string;
    ultima_actualizacion: string;
    combustible: string;
    temperatura: string;
    velocidad: string;
  }