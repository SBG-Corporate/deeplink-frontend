

export interface User {
  _id: string;
  email: string;
  alias: string;
  nombre: string;
  rol: string[];
  created: number;
  edited: number;
  lastLogin: number;
  estado: number | null;
  friendsIds: string[];
  keys: any;
  profilePicture: string;
  userLevel: number;
  saldo: number;
  challengesCompleted: string[];
  views: string[];
  socialLinks: SocialLinks;
  followers: string[];
  bioInfo: BioInfo;
  isVerified: boolean;
  favoriteArticles: string[];
}

export interface BioInfo {
  biography: string;
  location: string;
  ocupation: string;
  website: string;
}
export interface SocialLinks {
  instagramLink: string;
  twitterLink: string;
  linkedinLink: string;
  facebookLink: string;
}

export interface Friend {
  _id: string;
  alias: string;
  profilePicture: string;
}

export interface ApiFile {
  fileId: string;
  userId: string;
  mimeType: string;
  originalName: string;
  url: string;
  created: number;
  lastModified: string,
  size: number;
}

export interface ApiUser {
  _id: string;
  usuario: string;
  alias: string;
  rol: string[];
  created: number;
  edited: number;
  lastLogin: number;
  estado: number;
  nombre: string;
  amigos: string[];
  fotoPerfil: string;
  claves: any;
  saldo: number;
  challengesCompletados: string[];
  nivel: number;
  views: string[];
  socialLinks: SocialLinks;
  followers: string[];
  bioInfo: BioInfo;
  isVerified: boolean;
  favoriteArticles: string[];
}

export interface DashboardInfoMsg {
  totalPosts: number;
  likesInPostsReceived: number;
  commentsInPostsReceived: number;
  viewsInPosts: number;

  totalArticles: number;
  likesInArticlesReceived: number;
  commentsInArticlesReceived: number;
  viewsInArticles: number;

  likesInPostsGiven: number;
  likesInArticlesGiven: number;
  likesInCommentsGiven: number;
  totalLikesGiven: number;
  likesInCommentsReceived: number;
  totalLikesReceived: number;
  commentsInPostsGiven: number;
  commentsInArticlesGiven: number;
  totalCommentsGiven: number;
  totalCommentsReceived: number;
};

export interface DashboardInfoUser {
  userProfileViews: number;
  following: string[];
  followers: string[];
};

