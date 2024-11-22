
export interface RegisterUser {
    alias: string;
    name: string;
    userType: string[];
}

export interface OldRegisterUser {
    firstName: string;
    lastName: string;
    userType: string;
    email: string;
    password: string;
    location: string;
    occupation: string;
    picture: File | string;
}

export interface UserData {
    user: string;
    account: string;
    token: string;
    tokenExpire: string;
    estado: number;
    lastLogin: number;
    rol: string[];
}

export interface AuthResponse {
    _id: string;
    alias: string;
    created: number;
    edited: number;
    estado: number;
    lastLogin: number;
    rol: string[];
    usuario: string[];
}
