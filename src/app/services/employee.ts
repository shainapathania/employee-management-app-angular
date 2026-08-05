import { Injectable, signal } from '@angular/core';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employees = signal<Employee[]>([
    {
      id: 1,
      name: 'Harry',
      department: 'IT',
      salary: 50000,
    },
    {
      id: 2,
      name: 'Ron',
      department: 'Finance',
      salary: 30000,
    },
    {
      id: 3,
      name: 'Harmoine',
      department: 'HR',
      salary: 40000,
    },
  ]);

  addEmployee(employee: Employee) {
    this.employees.update((currentEmployees) => [
      ...currentEmployees,
      employee,
    ]);
  }
}
