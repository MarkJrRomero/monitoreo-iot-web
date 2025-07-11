import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { type AuthState, type LoginCredentials, type LoginResponse, type Usuario } from '../models/auth';
import { getApiUrl } from '../config/env';

const AUTH_STORAGE_KEY = 'auth_data';

// Función para obtener datos de auth del localStorage
const getStoredAuth = (): AuthState => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const { usuario, token } = JSON.parse(stored);
      return {
        usuario,
        token,
        isAuthenticated: !!token && !!usuario,
      };
    }
  } catch (error) {
    console.error('Error al leer datos de autenticación:', error);
  }
  
  return {
    usuario: null,
    token: null,
    isAuthenticated: false,
  };
};

// Función para guardar datos de auth en localStorage
const setStoredAuth = (usuario: Usuario, token: string) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ usuario, token }));
  } catch (error) {
    console.error('Error al guardar datos de autenticación:', error);
  }
};

// Función para limpiar datos de auth del localStorage
const clearStoredAuth = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Error al limpiar datos de autenticación:', error);
  }
};

// Función para hacer la petición de login
const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    
  const response = await fetch(getApiUrl('/api/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error en el inicio de sesión');
  }else{
    //Redirigir a la página de inicio
    window.location.href = '/';
  }

  return response.json();
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(getStoredAuth);
  const queryClient = useQueryClient();

  // Mutation para el login
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: LoginResponse) => {
      const { usuario, token } = data;
      
      // Guardar en localStorage
      setStoredAuth(usuario, token);
      
      // Actualizar estado
      setAuthState({
        usuario,
        token,
        isAuthenticated: true,
      });

      // Invalidar queries relacionadas con auth
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error: Error) => {
      console.error('Error en login:', error);
    },
  });

  // Función para logout
  const logout = () => {
    clearStoredAuth();
    setAuthState({
      usuario: null,
      token: null,
      isAuthenticated: false,
    });

    //Obtener el usu
    
    // Limpiar cache de React Query
    queryClient.clear();

    //Redirigir a la página de autenticación
    window.location.href = '/';
  };

  // Función para login
  const login = (credentials: LoginCredentials) => {
    loginMutation.mutate(credentials);
  };

  // Función para obtener el token (útil para headers de peticiones)
  const getAuthHeaders = () => {
    if (!authState.token) return {};
    
    return {
      'Authorization': `Bearer ${authState.token}`,
      'Content-Type': 'application/json',
    };
  };

  return {
    // Estado
    usuario: authState.usuario,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    
    // Acciones
    login,
    logout,
    getAuthHeaders,
    
    // Estado de la mutation
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
  };
};

// Hook para verificar si el usuario está autenticado al cargar la app
export const useAuthCheck = () => {
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Simular un pequeño delay para verificar el estado de auth
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return { isChecking, isAuthenticated };
};
