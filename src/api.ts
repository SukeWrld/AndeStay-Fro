import type { CrearReservaRequest, ReservaResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8081';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
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

export function obtenerReservas(): Promise<ReservaResponse[]> {
  return request<ReservaResponse[]>('/api/reservations');
}

export function crearReserva(reserva: CrearReservaRequest): Promise<ReservaResponse> {
  return request<ReservaResponse>('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(reserva)
  });
}

export function cancelarReserva(id: number): Promise<ReservaResponse> {
  return request<ReservaResponse>(`/api/reservations/${id}/cancel`, { method: 'PUT' });
}
