
export interface Post {
  _id: string;
  createdById: string;
  alias: string;
  postTitle: string;
  postText: string;
  files: UploadedFile[] | null;
  level: string;
  likes: string[];
  createdAt: number;
  updatedAt: number;
}

export interface UploadedFile {
  _id: string;
  created: number;
  googleId: string;
  mimetype: string;
  name: string;
  owner: string;
  size: number;
  url: string;
}

export interface IChat {
  friendId: string;
  participants: IParticipant[];
  messages: IMessage[];
  created: number;
};

export interface SenderReceiver {
  _id: string;
  alias: string;
  profilePicture: string;
};

export interface IMessage {
  _id: string;
  sender: SenderReceiver;
  receiver: SenderReceiver;
  message: string;
  father: string | null;
  created: number;
  edited: number;
};

export interface IParticipant {
  _id: string;
  alias: string;
  profilePicture: string;
  type: "user" | "friend";
}

export interface IMessageParsed {
  _id: string;
  id_user: string;
  participants: IParticipant[];

  tipo: string;
  msg: string;
  subject: string;
  comments: CommentApi[];
  files: any[];
  estado: number;
  padre: string | null;
  nivel: string;
  tags: string[];
  alias: string;
  likes: LikesApi[];
  created: number;
  edited: number;
  destinatario?: string;
  views: string[];
  slug: string;
  articleData: {
    isValidated: boolean;
    category: string;
    contentNews: ContentItem[];
    title: string;
  };
  notificationsData: {
    isEnabled: boolean,
    receivers: string[],
    openedBy: string[],
    isOpen: boolean
  }
}

export interface ContentItem {
  type: 'text' | 'image';
  value: string;
};


export interface IMessagesApi {
  _id: string;
  id_user: string;
  tipo: string;
  msg: string;
  subject: string;
  comments: CommentApi[];
  files: UploadedFile[];
  estado: number;
  padre: string | null;
  nivel: string;
  tags: string[];
  alias: string;
  likes: LikesApi[];
  created: number;
  edited: number;
  destinatario?: string;

  articleData: {
    isValidated: boolean;
    category: string;
    contentNews: ContentItem[];
    title: string;
  };
}

export interface UploadedFile {
  _id: string;
  created: number;
  googleId: string;
  mimetype: string;
  name: string;
  owner: string;
  size: number;
  url: string;
}

export interface IProfilePictures {
  [key: string]: string; // Assuming profile pictures are stored as string URLs
}

export interface LikesApi {
  id_user: string;
  created: number;
}

export interface CommentApi {
  _id: string;
  msg: string;
  id_user: string;
  created: number;
  likes: LikesApi[];
  subComments: SubCommentApi[];
}

export interface SubCommentApi {
  _id: string;
  msg: string;
  id_user: string;
  created: number;
  likes: LikesApi[];
}

export interface Comment extends CommentApi {
  subComments: SubComment[];
  alias: string;
  profilePicture: string;
}

export interface SubComment extends SubCommentApi {
  alias: string;
  profilePicture: string;
}

export interface UserAlias {
  fotoPerfil: string;
  _id: string;
}

export interface AllAliasApi {
  [key: string]: UserAlias;
}

export interface AllAlias {
  [key: string]: string;
}

export interface AllProfilePictures {
  [userId: string]: string;
}

export interface ApiPost {
  _id: string;
  id_user: string;
  subject: string;
  msg: string;
  files: UploadedFile[];
  created: string;
  respuestas: string[];
  nivel: number;
  likes: LikesApi[];
  comments: Comment[];
  destinatario: string;
  estado: number;
  edited: number;
  padre: string;
  tags: string[];
  tipo: string;
  views: string[];
}

export interface NewsState {
  allNews: New[];
  loadingNews: boolean;
}

export interface New {
  _id: string;
  userId: string;
  postMainImage: string;
  content: ContentItem[];
  title: string;
  description: string;
  slug: string;
  tags: string[];
  category: string;
  likes: string[];
  views: number;
  comments: Comment[];

  createdAt: number;
  updatedAt: number;
}

export interface ContentItem {
  type: 'text' | 'image';
  value: string;
};

export interface INotification {
  _id: string;
  nombre: string;
  descripcion: string;
  creador: string;
  created: number;
  edited: number;
  isEnabled: boolean;
  receiver: string;
};

export type IMessageParsedWithSeen = IMessageParsed & { isSeen: boolean };
