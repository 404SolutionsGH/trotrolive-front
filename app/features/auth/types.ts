export interface User {
    phoneNumber: string;
    name?: string;
    email?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
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
    user: {
      full_name: string;
      email: string;
    };
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
