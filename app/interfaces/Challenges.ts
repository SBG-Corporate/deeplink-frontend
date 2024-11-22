
export interface IChallenge {
  _id: string;
  nombre: string;
  descripcion: string;
  slug: string;
  recompensa: number;
  creador: string;
  tipoDeChallenge: string;
  objetivoDeChallenge: number;
  estado: number;
  created: number;
  edited: number;
  order: number;
  isEnabled: boolean;
};


