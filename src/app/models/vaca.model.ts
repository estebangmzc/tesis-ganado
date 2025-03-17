export interface Vaca {
  id?: string;
  raza: string;
  sexo: "Macho" | "Hembra";
  edad: number | null; // Permite iniciar sin valor
  peso: number | null; // Permite iniciar sin valor
  precioPorKilo: number | null; // Permite iniciar sin valor
  totalPrecio: number; // No necesita null porque siempre se calcula
  estadoDeSalud: "Sano" | "Enfermo" | "En tratamiento";
  propósito: "Engorde" | "Leche" | "Reproducción" | "Venta";
}
