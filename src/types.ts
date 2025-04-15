export type jwtPayload = {
  iat: number;
  id: string;
  type: 'refresh' | 'access' | 'admin';
};

export type RefreshUpdate = {
  oldRefresh: string;
  refresh: string;
  id: string;
};

export type User = {
  ID: string;
  Phone: string;
  NameA: string;
  Password?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

declare module 'express' {
  interface Request {
    user: User;
  }
}
