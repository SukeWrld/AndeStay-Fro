import type { CrearReservaRequest, ReservaResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '';

async function request<T>(
  path: string,
  options?: RequestInit,
  accessToken?: string
): Promise<T> {
  const headers = new Headers(options?.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `La solicitud falló con estado ${response.status}`);
  }

  const responseBody = await response.text();
  if (!responseBody) {
    return undefined as T;
  }

  return JSON.parse(responseBody) as T;
}

export function obtenerReservas(accessToken?: string): Promise<ReservaResponse[]> {
  return request<ReservaResponse[]>('/api/reservations', undefined, accessToken);
}

export function crearReserva(
  reserva: CrearReservaRequest,
  accessToken?: string
): Promise<ReservaResponse> {
  return request<ReservaResponse>('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(reserva)
  }, accessToken);
}

export function cancelarReserva(id: string, accessToken?: string): Promise<ReservaResponse> {
  return request<ReservaResponse>(`/api/reservations/${encodeURIComponent(id)}/cancel`, {
    method: 'PUT'
  }, accessToken);
}
