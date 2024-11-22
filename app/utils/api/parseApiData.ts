import { IMessagesApi } from "/app/interfaces";
import { ApiUser, Post, User } from "/app/interfaces";

export const parsePost = (post: IMessagesApi) => {
  const parsedLiked = post.likes.map(like => like.id_user);
  const parsedPost: Post = {
    _id: post._id,
    createdById: post.id_user,
    alias: "por definir",
    postTitle: post.subject,
    postText: post.msg,
    files: post.files,
    level: post.nivel,
    likes: parsedLiked,
    createdAt: post.created,
    updatedAt: post.edited,
  }
  return parsedPost
};

export const parseUser = (user: ApiUser) => {
  const parsedUser: User = {
    _id: user._id,
    email: user.usuario,
    alias: user.alias,
    nombre: user.nombre,
    rol: user.rol,
    created: user.created,
    edited: user.edited,
    lastLogin: user.lastLogin,
    estado: user.estado,
    friendsIds: user.amigos,
    keys: user.claves,
    profilePicture: user.fotoPerfil !== "" ? user.fotoPerfil : "https://deeplink-uploads.s3.eu-west-3.amazonaws.com/public/userProfile.png",
    saldo: user.saldo,
    challengesCompleted: user.challengesCompletados,
    userLevel: user.nivel,
    views: user.views,
    socialLinks: user.socialLinks,
    followers: user.followers,
    bioInfo: user.bioInfo,
    isVerified: user.isVerified,
    favoriteArticles: user.favoriteArticles,
  }
  return parsedUser
};