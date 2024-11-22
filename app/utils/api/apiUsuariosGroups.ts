import axios from 'axios'

const apiUsuariosUrl = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
  ? process.env.NEXT_PUBLIC_BK
  : process.env.NEXT_PUBLIC_BK_DEV

//* OLNY VALID FOR AUDITOR ROL
export const apiGetAllGroups = async ({ token }: { token: string }) => {
  const config = {
    method: 'get',
    url: `${apiUsuariosUrl}/grupo/all`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiGetAllPostsetAllGroups, error: ", error)
    return { status: error.response.status, data: error.message }
  }
}

export const apiGetAllUserGroups = async ({ token }: { token: string }) => {
  const config = {
    method: 'get',
    url: `${apiUsuariosUrl}/grupo`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiGetAllUserGroups, error: ", error)
    return { status: error.response.status, data: error.message }
  }
}

export const apiGetGroupById = async ({ groupId, token }: { groupId: string, token: string }) => {
  const config = {
    method: 'get',
    url: `${apiUsuariosUrl}/grupo/${groupId}`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiGetGroupById, error: ", error)
    return { status: error.response.status, data: error.message }
  }
}

export const apiCreateGroup = async ({ groupName, token }: { groupName: string, token: string }) => {
  const data = JSON.stringify({ nombre: groupName });
  const config = {
    method: 'post',
    url: `${apiUsuariosUrl}/grupo`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiCreateGroup, error: ", error)
    return { status: error.response.status, data: error.message }
  }
}

export const apiJoinGroup = async ({ groupId, token }: { groupId: string, token: string }) => {
  const config = {
    method: 'post',
    url: `${apiUsuariosUrl}/grupo/${groupId}/unir`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiJoinGroup, error: ", error)
    return { status: error.response.status, data: error.message }
  }
}

export const apiExitGroup = async ({ groupId, token }: { groupId: string, token: string }) => {
  const config = {
    method: 'post',
    url: `${apiUsuariosUrl}/grupo/${groupId}/salir`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiJoinGroup, error: ", error)
    return { status: error.response.status, data: error.message }
  }
}

export const apiDeleteGroup = async ({ groupId, token }: { groupId: string, token: string }) => {
  const config = {
    method: 'delete',
    url: `${apiUsuariosUrl}/grupo/${groupId}`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiDeleteGroup, error: ", error)
    return { status: error.response.status, data: error.message }
  }
}

export const apiUpdateGroup = async ({ groupId, token }: { groupId: string, token: string }) => {
  const data = JSON.stringify({});
  const config = {
    method: 'patch',
    url: `${apiUsuariosUrl}/grupo/${groupId}`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data
  }
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log("error in apiDeleteGroup, error: ", error)
    return { status: error.response.status, data: error.message }
  }
}






