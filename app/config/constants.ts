import { DashboardInfoMsg, DashboardInfoUser } from "../interfaces"

export const DECIMALS = 1_000_000_000_000

export const validCategories = ['market', 'blockchain', 'nft', 'defi', 'other']
export const validRols = ['user', 'influencer', 'buisness', 'manager', 'admin']
export const validReceiver = ['user', 'influencer', 'buisness', 'manager', 'admin']
export const validChallengesTypes = ['likesInPostsGiven', 'likesInArticlesGiven', 'likesInCommentsGiven', 'totalLikesGiven', 'likesInPostsReceived', 'likesInArticlesReceived', 'likesInCommentsReceived', 'totalLikesReceived', 'commentsInPostsGiven', 'commentsInArticlesGiven', 'totalCommentsGiven', 'commentsInPostsReceived', 'commentsInArticlesReceived', 'totalCommentsReceived', 'viewsInPosts', 'viewsInArticles', 'following', 'followers', 'totalPosts', 'totalArticles']

export const messageInit = {
  _id: "",
  id_user: "",
  participants: [],
  tipo: "",
  msg: "",
  subject: "",
  comments: [],
  files: [],
  estado: 0,
  padre: null,
  nivel: "",
  tags: [],
  alias: "",
  likes: [],
  created: 0,
  edited: 0,
  destinatario: "",
  views: [],
  slug: "",
  articleData: {
    isValidated: false,
    category: "",
    contentNews: [],
    title: ""
  },
  notificationsData: {
    isEnabled: false,
    receivers: [],
    openedBy: [],
    isOpen: false
  }
}

export const allChallengesInit = {
  _id: "",
  nombre: "",
  descripcion: "",
  slug: "",
  recompensa: 0,
  creador: "",
  tipoDeChallenge: "",
  objetivoDeChallenge: 0,
  estado: 0,
  created: 0,
  edited: 0,
}

export const initialDashboardInfoMsg: DashboardInfoMsg = {

  totalPosts: 0,
  likesInPostsReceived: 0,
  commentsInPostsReceived: 0,
  viewsInPosts: 0,

  totalArticles: 0,
  likesInArticlesReceived: 0,
  commentsInArticlesReceived: 0,
  viewsInArticles: 0,

  likesInPostsGiven: 0,
  likesInArticlesGiven: 0,
  likesInCommentsGiven: 0,
  totalLikesGiven: 0,

  likesInCommentsReceived: 0,
  totalLikesReceived: 0,
  commentsInPostsGiven: 0,
  commentsInArticlesGiven: 0,
  totalCommentsGiven: 0,
  totalCommentsReceived: 0,
};

export const initialDashboardInfoUser: DashboardInfoUser = {
  userProfileViews: 0,
  following: [],
  followers: [],
};

export const switchColor = {
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: 'green',  // thumb color when checked
    '& + .MuiSwitch-track': {
      backgroundColor: 'green', // track color when checked
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: 'green', // track color when checked
  },
  '& .MuiSwitch-switchBase': {
    color: 'red', // thumb color when not checked (off)
    '& + .MuiSwitch-track': {
      backgroundColor: 'red', // track color when not checked
    },
  },
}

