import { Component, inject } from '@angular/core';
import { EmployeeService } from '../../services/employee';
import { CurrencyPipe, AsyncPipe } from '@angular/common';
import {
  map,
  Subject,
  startWith,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  combineLatest,
  catchError,
  of,
  tap,
  finalize,
  shareReplay,
} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, AsyncPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  employeeService = inject(EmployeeService);

  selectedDepartment = '';

  errorMessage = '';

  loading = true;

  departments = ['IT', 'HR', 'Finance', 'Sales', 'Marketing'];

  departmentSubject = new Subject<string>();

  searchSubject = new Subject<string>();

  searchTerm$ = this.searchSubject.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
  );

  employees$ = this.employeeService.loadEmployees().pipe(
    tap(() => {
      console.log('loading employees');
    }),
    catchError((error) => {
      console.error('Failed to load employees: ', error);
      this.errorMessage = 'Unable to load employees. Please try again later.';
      return of([]);
    }),
    finalize(() => {
      this.loading = false;
    }),
    shareReplay(1),
  );

  totalEmployees$ = this.employees$.pipe(map((employees) => employees.length));

  filteredEmployees$ = combineLatest([
    this.departmentSubject.pipe(startWith('')),
    this.searchTerm$,
  ]).pipe(
    switchMap(([department, searchTerm]) =>
      this.employees$.pipe(
        map((employees) =>
          employees.filter((employee) => {
            const matchesDepartment =
              department === '' || employee.department === department;

            const matchesSearch = employee.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase());

            return matchesDepartment && matchesSearch;
          }),
        ),
      ),
    ),
  );

  totalDepartments$ = this.employees$.pipe(
    map((employees) => {
      const departments = new Set(
        employees.map((employee) => employee.department),
      );
      return departments.size;
    }),
  );

  averageSalary$ = this.employees$.pipe(
    map((employees) => {
      if (employees.length === 0) {
        return 0;
      }
      const totalSalary = employees.reduce(
        (total, employee) => total + employee.salary,
        0,
      );
      return totalSalary / employees.length;
    }),
  );

  onDepartmentChange(department: string) {
    this.selectedDepartment = department;
    this.departmentSubject.next(department);
  }

  logDepartment() {
    this.departmentSubject.subscribe((department) => {
      console.log('Selected department:', department);
    });
  }

  onSearch(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }
}
