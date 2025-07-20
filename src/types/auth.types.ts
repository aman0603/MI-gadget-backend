export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  username: string;
  role: string;
  agentCode: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    agentCode: string;
    role: string;
  };
  token: string;
}