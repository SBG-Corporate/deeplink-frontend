import axios from 'axios'

const apiUsuariosUrl = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? process.env.NEXT_PUBLIC_BK
    : process.env.NEXT_PUBLIC_BK_DEV

export async function apiPing () {
    try {
        const response = await axios.get(`${apiUsuariosUrl}/ping`);
        return { status: response.status, data: response.data };
    } catch (error) {
        return { status: error.response.status, data: error.message }
    }
}

export async function apiLogin (email, idioma = 'es', ModoPrueba = false) {
    const data = JSON.stringify({ email, idioma, ModoPrueba });
    const config = {
        method: 'post',
        url: `${apiUsuariosUrl}/login`,
        headers: { 'Content-Type': 'application/json' },
        data
    }
    try {
        const response = await axios.request(config)
        return { status: response.status, data: response.data }
    } catch (error) {

        console.log('error in apiLogin: ', error)
        return { status: error.response.status, data: error.message }
    }
}

export async function apiAuth (email, token) {
    const data = JSON.stringify({ email, token });
    const config = {
        method: 'post',
        url: `${apiUsuariosUrl}/login/auth`,
        headers: { 'Content-Type': 'application/json' },
        data
    }
    try {
        const response = await axios.request(config)
        return { status: response.status, data: response.data }
    } catch (error) {
        console.log("error in apiAuth: ", error)
        return { status: error.response.status, data: error.message }
    }
}

export async function apiPatch ({ alias = "", nombre = "", bioInfo = { website: "", location: "", ocupation: "", biography: "" }, socialLinks = { instagramLink: "", twitterLink: "", linkedinLink: "", facebookLink: "" }, fotoPerfil = "", token }) {
    let dataToSend = {}
    if (alias !== undefined && alias !== "") { dataToSend = { alias } }
    if (nombre !== undefined && nombre !== "") { dataToSend = { ...dataToSend, nombre } }
    if (fotoPerfil !== undefined && fotoPerfil !== "") { dataToSend = { ...dataToSend, fotoPerfil } }

    dataToSend = { ...dataToSend, bioInfo, socialLinks }
    const data = JSON.stringify(dataToSend);
    const config = {
        method: 'patch',
        url: `${apiUsuariosUrl}/user/?full=true`,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        data
    }
    try {
        const response = await axios.request(config)
        return { status: response.status, data: response.data }
    } catch (error) {
        console.log("error in apiAuth: ", error)
        return { status: error.response.status, data: error.response.data }
    }
}

export async function apiAddTokens ({ saldo, userId, token }) {
    const data = JSON.stringify({ saldo });
    const config = {
        method: 'post',
        url: `${apiUsuariosUrl}/user/saldo/${userId}`,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        data
    }
    try {
        const response = await axios.request(config)
        return { status: response.status, data: response.data }
    } catch (error) {
        console.log("error in apiAuth: ", error)
        return { status: error.response.status, data: error.message }
    }
}

export async function getMyUserData ({ token }) {
    try {
        const config = {
            method: 'get',
            url: `${apiUsuariosUrl}/user/getMyUserExtended?full=true`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
        const response = await axios.request(config)
        return { status: response.status, data: response.data };
    } catch (error) {
        return { status: error.response.status, data: error.message }
    }
}

export async function getUserById ({ userId, token }) {
    try {
        const config = {
            method: 'get',
            url: `${apiUsuariosUrl}/user/getUserById/${userId}`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
        const response = await axios.request(config)
        return { status: response.status, data: response.data };
    } catch (error) {
        return { status: error.response.status, data: error.message }
    }
}

export async function getUsersByIds ({ token, usersIds }) {
    const data = JSON.stringify({ usersIds });
    try {
        const config = {
            method: 'post',
            url: `${apiUsuariosUrl}/user/getUsersByIds`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            data
        }
        const response = await axios.request(config)
        return { status: response.status, data: response.data };
    } catch (error) {
        return { status: error.response.status, data: error.message }
    }
}

export async function getUserMe ({ token }) {
    try {
        const config = {
            method: 'get',
            url: `${apiUsuariosUrl}/user/?full=true`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
        const response = await axios.request(config)
        return { status: response.status, data: response.data };
    } catch (error) {
        console.log('error: ', error);
        return { status: error.response.status, data: error.message }
    }
}

export async function getAllAlias ({ token }) {
    const config = {
        method: 'get',
        url: `${apiUsuariosUrl}/user/alias?full=true`,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    }
    try {
        const response = await axios.request(config)
        return { status: response.status, data: response.data }
    } catch (error) {
        console.log("error in getAllAlias: ", error)
        return { status: error.response.status, data: error.message }
    }
}

export const checkIfAliasExist = async (aliasToCheck, token) => {
    const config = {
        method: 'get',
        url: `${apiUsuariosUrl}/user/alias/${aliasToCheck.toLowerCase()}`,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    }
    let response;
    try {
        response = await axios.request(config)
    } catch (error) {
        console.log('error in get /alias: ', error);
    }
    if (response && response.status === 200) {
        return JSON.parse(response.data.existe)
    }
    return false
}

export async function apiAddFriend ({ friendId, token }) {
    const config = {
        method: 'post',
        url: `${apiUsuariosUrl}/user/amigo/${friendId}`,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    }
    try {
        const response = await axios.request(config)
        return { status: response.status, data: response.data }
    } catch (error) {
        console.log("error in apiAddFriend: ", error)
        return { status: error.response.status, data: error.message }
    }
}

export async function apiDeleteFriend ({ friendId, token }) {
    const config = {
        method: 'delete',
        url: `${apiUsuariosUrl}/user/amigo/${friendId}`,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    }
    try {
        const response = await axios.request(config)
        return { status: response.status, data: response.data }
    } catch (error) {
        console.log("error in apiAddFriend: ", error)
        return { status: error.response.status, data: error.message }
    }
}
