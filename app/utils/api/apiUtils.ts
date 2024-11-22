import axios from 'axios'

interface ApiCallData {
  type: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  body?: any,
  token?: string | undefined,
  id?: string,
}

const apiUtilsUrl = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
  ? process.env.NEXT_PUBLIC_BK
  : process.env.NEXT_PUBLIC_BK_DEV

//! url mus be /something/some not /api/something/some
export const apiCall = async ({ type, url, token, body, id = "" }: ApiCallData): Promise<{ status: number; data?: any }> => {
  const api = axios.create({
    baseURL: apiUtilsUrl
  });

  let status: number;
  let data: any;
  try {
    if (type === "get") {
      if (token !== undefined) {
        ({ status, data } = await api.get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }));
      } else {
        ({ status, data } = await api.get(url));
      }
    }
    else if (type === "post") {
      if (token !== undefined) {
        ({ status, data } = await api.post(url, body, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }));
      } else {
        ({ status, data } = await api.post(url, body));
      }
    }
    else if (type === "put") {
      if (token !== undefined) {
        ({ status, data } = await api.put(url, body, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }));
      } else {
        ({ status, data } = await api.put(url, body));
      }
    }
    else if (type === "patch") {
      if (token !== undefined) {
        ({ status, data } = await api.patch(url, body, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }));
      } else {
        ({ status, data } = await api.patch(url, body));
      }
    }
    else if (type === "delete") {
      if (token !== undefined) {
        ({ status, data } = await api.delete(id !== "" ? `${url}/${id}` : url, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: body
        }));
      } else {
        ({ status, data } = await api.delete(id !== "" ? `${url}/${id}` : url, {
          data: body
        }));
      }
    }
    else {
      throw new Error('Unsupported request type');
    }
    return {
      status, data
    };
  } catch (error) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "development") console.log('error in apiCall: ', error);
    if (axios.isAxiosError(error)) {
      return {
        status: error.response?.status || 400,
        data: error.response?.data
      };
    }
    return {
      status: 500,
      data: 'Server error occurred'
    };
  }
}

export const apiUtilsPing = async () => {
  try {
    const response = await axios.get(`${apiUtilsUrl}/ping`);
    return { status: response.status, data: response.data };
  } catch (error: any) {
    return { status: error.response.status, data: error.message }
  }
}

export const apiUploadImage = async (imageFile: File, token: string, fileName: string) => {
  const formData = new FormData();
  const renamedFile = new File([imageFile], fileName, {
    type: imageFile.type,
    lastModified: imageFile.lastModified,
  });
  formData.append('file', renamedFile);
  const config = {
    method: 'post',
    url: `${apiUtilsUrl}/file`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: formData
  };
  try {
    const response = await axios.request(config)
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.log('apiUploadImage error: ', error);
    return { status: error.response.status, data: error.message }
  }
}