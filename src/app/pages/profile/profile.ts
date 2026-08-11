import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  employee: Employee | null = null;

  route = inject(ActivatedRoute);
  router = inject(Router);
  employeeService = inject(EmployeeService);
  id = this.route.snapshot.paramMap.get('id');
  constructor() {
    this.employeeService.getEmployeeById(this.id!).subscribe({
      next: (employee) => {
        this.employee = employee;
      },
    });
  }

  goBack() {
    this.router.navigate(['/employees']);
  }

  editEmployee() {
    this.router.navigate(['/employees/edit', this.employee?.id]);
  }
}
