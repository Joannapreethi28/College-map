import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  // Eager = update the screen automatically whenever this component's data changes
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-login',
  imports: [NgIf, FormsModule],   // FormsModule = template-driven forms
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        this.authService.saveUser(user);
        // Admins go to the admin page, everyone else to the map
        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/map']);
        }
      },
      error: (err) => {
        // err.error is the JSON the server sent, e.g. { message: 'Invalid email or password' }
        this.errorMessage = err.error?.message || 'Could not reach the server';
      }
    });
  }
}
