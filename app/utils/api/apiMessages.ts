import axios from 'axios'
import { ContentItem } from '/app/interfaces';

const apiMessagesUrl = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
  ? process.env.NEXT_PUBLIC_BK
  : process.env.NEXT_PUBLIC_BK_DEV

export const apiMessagesPing = async () => {
  try {
    const response = await axios.get(`${apiMessagesUrl}/ping`);
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log('apiMessagesPing error: ', error);
    return { status: error.response.status, data: error.message }
  }
}

export const getAllMessagesApi = async (token: string) => {
  const config = {
    method: 'get',
    // url: `${apiMessagesUrl}/directmsg`,
    url: `${apiMessagesUrl}/msg?full=true`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    return { status: error.response.status, data: error.message }
  }
}

interface INewMessageChat {
  message: string;
  receiverId: string;
  token: string;
}

export const createNewMessageChat = async ({ message, receiverId, token }: INewMessageChat) => {
  const data = JSON.stringify({
    subject: "primer mensaje de chat",
    msg: message,
    tipo: "directo",
    padre: null,
    destinatario: receiverId,
  });
  const config = {
    method: 'post',
    url: `${apiMessagesUrl}/msg/?full=true`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data }

  } catch (error: any) {
    console.log("error in apiAuth: ", error)
    return { status: error.response.status, data: error.message }
  }
}

interface IAnswerMessage {
  message: string;
  token: string;
  lastMessageId: string;
  receiverId: string;
}
export const answerMessage = async ({ message, token, lastMessageId, receiverId }: IAnswerMessage) => {

  const data = JSON.stringify({
    subject: "mensajes de chat",
    msg: message,
    tipo: "directo",
    padre: lastMessageId,
    destinatario: receiverId,
  });
  const config = {
    method: 'post',
    url: `${apiMessagesUrl}/msg/?full=true`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data }
  } catch (error: any) {
    console.log("error in apiAuth: ", error)
    return { status: error.response.status, data: error.message }
  }
}

export const apiGetMessageById = async (messageId: string, token: string) => {
  const config = {
    method: 'get',
    url: `${apiMessagesUrl}/msg/${messageId}?full=true`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiDeleteMessage: ", error)
    return { status: error.response.status, data: error.message }
  }
}

export const apiUpdateArticle = async ({ articleId, mainImageId, content, category, slug, title, description, tags, token }: { articleId: string, mainImageId: string, content: ContentItem[], category: string, slug: string | undefined, title: string, description: string, tags: string[], token: string }) => {
  const data = JSON.stringify({
    subject: description,
    files: [mainImageId],
    title,
    contentNews: content,
    category,
    slug,
    tags,
    tipo: "noticia",
  });
  const config = {
    method: 'patch',
    url: `${apiMessagesUrl}/msg/${articleId}?full=true`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiUpdateArticle: ", error)
    return { status: error.response.status, data: error.response.data }
  }
}

export const apiCreateArticle = async ({ mainImageId, content, category, slug, title, description, tags, token }: { mainImageId: string, content: ContentItem[], category: string, slug: string, title: string, description: string, tags: string[], token: string }) => {
  const data = JSON.stringify({
    title,
    subject: description,
    files: [mainImageId],
    contentNews: content,
    category,
    slug,
    tipo: "noticia",
    tags,
    padre: null,
    destinatario: null,
    msg: "no msg in news",
  });
  const config = {
    method: 'post',
    url: `${apiMessagesUrl}/msg/createNew/?full=true`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiCreateArticle: ", error)
    return { status: error.response.status, data: error.response.data }
  }
}

export const apiCreatePost = async ({ message, token, files = [] }: { message: string, token: string, files?: string[] }) => {
  const data = JSON.stringify({
    subject: "Por ahora no hay subject en posts",
    msg: message,
    tipo: "post",
    padre: null,
    files,
  });
  const config = {
    method: 'post',
    url: `${apiMessagesUrl}/msg/?full=true`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiCreatePost: ", error)
    return { status: error.response.status, data: error.message }
  }
}

export const apiDeleteMessage = async (messageId: string, token: string) => {
  const config = {
    method: 'delete',
    url: `${apiMessagesUrl}/msg/${messageId}`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiDeleteMessage: ", error)
    return { status: error.response.status, data: error.message }
  }
}

export const apiCommentPost = async ({ postId, message, token }: { postId: string, message: string, token: string }) => {
  const data = JSON.stringify({ msg: message });
  const config = {
    method: 'post',
    url: `${apiMessagesUrl}/msg/comment/${postId}`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiCommentPost: ", error)
    return { status: error.response.status, data: error.message }
  }
}

export const apiDeleteCommentPost = async ({ postId, token, commentId }: { postId: string, token: string, commentId: string }) => {
  const data = JSON.stringify({ commentId });
  const config = {
    method: 'delete',
    url: `${apiMessagesUrl}/msg/comment/${postId}`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiDeleteCommentPost: ", error)
    return { status: error.response.status, data: error.message }
  }
}

export const apiAddLike = async (postId: string, token: string) => {
  const config = {
    method: 'post',
    url: `${apiMessagesUrl}/msg/like/${postId}`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiAddLike: ", error)
    return { status: error.response.status, data: error.message }
  }
}

export const apiRemoveLike = async (postId: string, token: string) => {
  const config = {
    method: 'delete',
    url: `${apiMessagesUrl}/msg/like/${postId}`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiRemoveLike: ", error)
    return { status: error.response.status, data: error.message }
  }
}

export const apiIncreaseViews = async (messageOrUserId: string, token: string, type: "msg" | "user") => {
  const config = {
    method: 'post',
    url: `${apiMessagesUrl}/${type}/incrementViews/${messageOrUserId}`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiRemoveLike: ", error)
    return { status: error.response.status, data: error.message }
  }
}

export const apiToggleLikeInComment = async (messageId: string, commentId: string, token: string) => {
  const data = JSON.stringify({ messageId, commentId });
  const config = {
    method: 'post',
    url: `${apiMessagesUrl}/msg/toggleLikeInComment`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiRemoveLike: ", error)
    return { status: error.response.status, data: error.message }
  }
}
