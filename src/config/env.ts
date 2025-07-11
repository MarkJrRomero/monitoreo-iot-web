interface EnvConfig {
  API_URL: string;
}

export const env: EnvConfig = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
};

// Función para validar que las variables requeridas estén presentes
export const validateEnv = () => {
  const requiredVars = ['VITE_API_URL'];
  
  for (const varName of requiredVars) {
    if (!import.meta.env[varName]) {
      console.warn(`Variable de entorno ${varName} no está definida`);
    }
  }
};

// Función para obtener la URL completa de la API
export const getApiUrl = (endpoint: string): string => {
  return `${env.API_URL}${endpoint}`;
};
