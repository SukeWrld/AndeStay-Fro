export interface Alojamiento {
  id: number;
  titulo: string;
  ubicacion: string;
  precio: number;
  imagen: string;
}

export interface Reserva {
  alojamientoId: number;
  checkIn: string;
  checkOut: string;
  huespedes: number;
}

export interface CrearReservaRequest {
  unidadId: number;
  nombreHuesped: string;
  emailHuesped: string;
  fechaEntrada: string;
  fechaSalida: string;
  cantidadPersonas: number;
}

export interface ReservaResponse extends CrearReservaRequest {
  id: number;
  telefonoHuesped?: string;
  estado: string;
  fechaCreacion: string;
  fechaActualizacion?: string;
  creadoPor: string;
  actualizadoPor?: string;
}

export interface Usuario {
  nombre: string;
  email: string;
}
