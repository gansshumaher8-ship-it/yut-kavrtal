export type UserRole = 'admin' | 'agent';

export interface User {
  id: string;
  login: string;
  passwordHash: string;
  role: UserRole;
  name: string;
  agentId?: string;
}
