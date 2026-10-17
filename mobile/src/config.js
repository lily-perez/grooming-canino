// URL del backend (la web en Vercel). Se puede cambiar con EXPO_PUBLIC_API_URL en mobile/.env
export const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? 'https://grooming-canino.vercel.app'
).replace(/\/$/, '');