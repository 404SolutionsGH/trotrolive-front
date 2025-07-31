export interface User {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    role: string;
}

export interface LoginCredentials {
    wallet_address: string;
    id_token: string;
}

export interface RegisterData {
    full_name: string;
    email: string;
    phone: string;
    password: string;
}

// export interface AuthResponse {
//     user: User;
//     tokens: {
//         access: string;
//         refresh: string;
//     };
// }

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: User;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
