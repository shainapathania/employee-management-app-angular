export interface Employee {
  id: string;
  name: string;
  department: string;
  salary: number;
}

export interface CreateEmployee {
  name: string;
  department: string;
  salary: number;
}
