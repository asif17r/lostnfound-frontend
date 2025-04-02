// Get the current host and use it to construct API URL
const getCurrentHost = () => {
  const { hostname, protocol } = window.location;
  return `${protocol}//${hostname}`;
};

// Use window location to determine API URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  // If env variable not set, use the same host but with port 8080
  `${getCurrentHost()}:8080`; 