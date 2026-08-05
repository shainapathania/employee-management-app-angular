import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm;
  loginError = '';

  constructor(
    private auth: Auth,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password } = this.loginForm.value;
    const isLoggedIn = this.auth.login(email!, password!);
    console.log(this.auth.isLoggedIn());
    if (isLoggedIn) {
      this.loginError = '';
      this.router.navigate(['/dashboard']);
    } else {
      this.loginError = 'invalid email or password';
    }
  }
}
