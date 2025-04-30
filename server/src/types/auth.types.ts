export interface User {
    id: string;
    username: string;
    email: string;
    password: string; // hashed password
    role: 'student' | 'teacher' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
}