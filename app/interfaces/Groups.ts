import { LikesApi } from "./Messages";

export interface IApiGetGroup {
  _id: string;
  nombre: string;
  creador: string;
  created: number;
  activo: number;
};

export interface IGetGroup {
  _id: string;
  name: string;
  creator: string;
  created: number;
  active: number;
};

export interface IGroup {
  _id: string;
  nombre: string;
  nombreLargo: string;
  descripcion: string;
  miembros: IMiembros[];
  logo: string;
  icono: string;
  creador: string;
  messages: IGroupMessages[];
  created: number;
  edited: number;
  userCanWrite: boolean;
  category: string;
};

export interface IMiembros {
  _id: string;
  rolGrupo: string[];
  fechaUnion: number;
};

export interface IGroupMessages {
  _id: string;
  estado: string;
  id_user: string;
  message: string;
  created: number;
  edited: number;
  comments: GroupsComment[];
  likes: LikesApi[];
};

export interface GroupsCommentApi {
  _id: string;
  msg: string;
  id_user: string;
  created: number;
  likes: LikesApi[];
}

export interface GroupsComment extends GroupsCommentApi {
  alias: string;
  profilePicture: string;
}

