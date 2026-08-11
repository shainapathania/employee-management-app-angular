import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee';
import { CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Employee } from '../../models/employee';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employees',
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees implements OnInit {
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  employeeService = inject(EmployeeService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  fb = inject(FormBuilder);

  showSuccessMessage(message: string) {
    this.successMessage = message;

    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  ngOnInit() {
    this.isLoading = true;
    this.errorMessage = '';
    const editId = this.route.snapshot.paramMap.get('id');

    this.employeeService.loadEmployees().subscribe({
      next: (employees) => {
        this.employeeService.employees.set(employees);

        if (editId) {
          const employee = employees.find((employee) => employee.id === editId);
          if (employee) {
            this.editEmployee(employee);
          }
        }
      },

      error: (error) => {
        console.error('Failed to load employees:', error);
        this.errorMessage = 'Unable to load employees. Please try again.';
        this.isLoading = false;
      },

      complete: () => {
        this.isLoading = false;
      },
    });
  }

  departments = ['IT', 'HR', 'Finance', 'Sales', 'Marketing'];

  employeeForm = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
    ],
    department: ['', Validators.required],
    salary: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1000),
      Validators.max(500000),
    ]),
  });

  onSubmit() {
    if (this.employeeForm.invalid) {
      return;
    }

    if (this.editingEmployeeId === null) {
      const employee = {
        name: this.employeeForm.value.name!,
        department: this.employeeForm.value.department!,
        salary: this.employeeForm.value.salary!,
      };

      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      //add
      this.employeeService.addEmployee(employee).subscribe({
        next: (savedEmployee) => {
          this.employeeService.employees.update((current) => [
            ...current,
            savedEmployee,
          ]);
          //reset form
          this.employeeForm.reset();

          this.showSuccessMessage('Employee added successfully.');
        },

        error: (error) => {
          console.error('Failed to add employee:', error);
          this.errorMessage = 'Unable to add employee. Please try again.';
        },

        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      const employee = {
        id: this.editingEmployeeId,
        name: this.employeeForm.value.name!,
        department: this.employeeForm.value.department!,
        salary: this.employeeForm.value.salary!,
      };

      //update
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.employeeService.updateEmployee(employee).subscribe({
        next: (updatedEmployee) => {
          this.employeeService.employees.update((current) =>
            current.map((emp) =>
              emp.id === updatedEmployee.id ? updatedEmployee : emp,
            ),
          );
          //reset form
          this.employeeForm.reset();
          this.editingEmployeeId = null;

          this.showSuccessMessage('Employee updated successfully.');
          this.router.navigate(['/employees']);
        },

        error: (error) => {
          console.error('Failed to update employee:', error);
          this.errorMessage = 'Unable to update employee. Please try again.';
        },

        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  editingEmployeeId: string | null = null;
  editEmployee(employee: Employee) {
    this.editingEmployeeId = employee.id;
    this.employeeForm.patchValue({
      name: employee.name,
      department: employee.department,
      salary: employee.salary,
    });
  }

  deleteEmployee(id: string) {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.employeeService.employees.update((current) =>
          current.filter((employee) => employee.id !== id),
        );

        this.showSuccessMessage('Employee deleted successfully.');
      },

      error: (error) => {
        console.error('Failed to delete employee:', error);
        this.errorMessage = 'Unable to delete employee. Please try again.';
      },

      complete: () => {
        this.isLoading = false;
      },
    });
  }

  viewEmployee(id: string) {
    this.router.navigate(['/profile', id]);
  }
}
