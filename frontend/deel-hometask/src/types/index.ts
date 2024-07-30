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

interface Person {
  id: number;
  firstName: string;
  lastName: string;
}

interface Job {
  ContractId: number;
  createdAt: string;
  description: string;
  id: number;
  paid: true | null;
  paymentDate: string | null;
  price: number;
  updatedAt: string;
}

export interface ContractTypes {
  Client: Person;
  ClientId: number;
  Contractor: Person;
  ContractorId: number;
  Jobs: Job[];
  createdAt: string;
  id: number;
  status: string;
  terms: string;
  updatedAt: string;
}
