import { useAuth } from '../hooks/useAuth';


/**
 * Enmascara un ID de dispositivo según el rol del usuario
 * @param deviceId - El ID del dispositivo a enmascarar
 * @param userRole - El rol del usuario actual
 * @returns El ID enmascarado o el ID original según el rol
 */
export const maskDeviceId = (deviceId: string, userRole?: string): string => {
  // Si no hay rol o es admin, mostrar el ID completo
  if (!userRole || userRole === 'admin') {
    return deviceId;
  }

  // Para usuarios no administradores, enmascarar el ID
  if (deviceId.length <= 8) {
    // Si el ID es muy corto, mostrar solo los primeros 3 caracteres
    return `${deviceId.substring(0, 3)}-****`;
  }

  // Para IDs más largos, mostrar formato: DEV-****-XC54
  const prefix = deviceId.substring(0, 3);
  const suffix = deviceId.substring(deviceId.length - 4);
  
  return `${prefix}-****-${suffix}`;
};

/**
 * Hook para enmascarar IDs de dispositivos según el rol del usuario actual
 * @param deviceId - El ID del dispositivo a enmascarar
 * @returns El ID enmascarado o el ID original según el rol
 */
export const useMaskDeviceId = (deviceId: string): string => {
  const { usuario } = useAuth();
  const userRole = usuario?.rol;
  
  return maskDeviceId(deviceId, userRole);
};

/**
 * Enmascara múltiples IDs de dispositivos
 * @param deviceIds - Array de IDs de dispositivos
 * @param userRole - El rol del usuario actual
 * @returns Array de IDs enmascarados
 */
export const maskDeviceIds = (deviceIds: string[], userRole?: string): string[] => {
  return deviceIds.map(id => maskDeviceId(id, userRole));
};

/**
 * Hook para enmascarar múltiples IDs de dispositivos
 * @param deviceIds - Array de IDs de dispositivos
 * @returns Array de IDs enmascarados
 */
export const useMaskDeviceIds = (deviceIds: string[]): string[] => {
  const { usuario } = useAuth();
  const userRole = usuario?.rol;
  
  return maskDeviceIds(deviceIds, userRole);
};
