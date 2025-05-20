export type UserRole = 'admin' | 'user';

export interface User {
  username: string;
  password: string;
  entity: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}