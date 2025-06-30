export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
}