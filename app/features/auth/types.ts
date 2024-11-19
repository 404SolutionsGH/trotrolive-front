export interface User {
    phoneNumber: string;
    name?: string;
    email?: string;
}

export interface LoginCredentials {
    phone_number: string;
    password: string;
}

export interface RegisterData {
    full_name: string;
    email: string;
    phone_number: string;
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
    tokens?: {
        access_token: string;
        refresh_token: string;
    };
    user?: {
      id: string;
      email: string;
    };
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
