export interface Usuario {
  nombre: string;
  correo: string;
  rol: string;
}

export interface LoginResponse {
  usuario: Usuario;
  token: string;
}

export interface LoginCredentials {
  correo: string;
  password: string;
}

export interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
}
