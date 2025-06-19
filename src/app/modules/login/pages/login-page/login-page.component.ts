import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginDTO } from '../../interfaces/login-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  // Solución 2: Uso del operador de aserción definitiva
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    console.log('LoginPageComponent cargado');
    this.loginForm = this.fb.group({
      
      usuario: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });
  }

  onSubmit(): void {
    
    console.log('onSubmit ejecutado');
    if (this.loginForm.valid) {
      console.log('Formulario válido', this.loginForm.value);
      const credentials: LoginDTO = this.loginForm.value;
      this.authService.login(credentials).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.log('Formulario inválido', this.loginForm.value, this.loginForm.errors);
          this.errorMessage = 'Credenciales incorrectas o error de servidor';
        }
      });
    } else {
      console.log('Formulario inválido', this.loginForm.value, this.loginForm.errors);
    }
  }
}