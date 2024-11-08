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
    name: string;
    email: string;
    phone_number: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    tokens: {
        access: string;
        refresh: string;
    };
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
