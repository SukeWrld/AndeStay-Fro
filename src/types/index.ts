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

export interface Usuario {
  nombre: string;
  email: string;
}
