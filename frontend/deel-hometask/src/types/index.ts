export interface User {
  id: number | null;
  firstName: string;
  lastName: string;
  profession: string;
  balance: number | null;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContractTypes {
  ClientId: number;
  ContractorId: number;
  createdAt: string;
  id: number;
  status: string;
  terms: string;
  updatedAt: string;
}
