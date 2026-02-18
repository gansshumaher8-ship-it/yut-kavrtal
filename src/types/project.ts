export type ProjectStatus = 'active' | 'sold' | 'renovation';

export interface Project {
  id: string;
  address: string;
  metro: string;
  price: number; // цена входа, ₽
  profit: number; // доходность, %
  status: ProjectStatus;
  description: string;
  images: string[]; // [before, after, ...]
  agentId?: string; // закреплённый агент
}

