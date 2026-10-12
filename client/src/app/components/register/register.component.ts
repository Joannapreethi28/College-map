import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Sign up page: creates a new "visitor" account, then sends the user to the login page
@Component({
  // Eager = update the screen automatically whenever this component's data changes
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-register',
  imports: [NgIf, FormsModule, RouterLink],   // template-driven form, like login
  templateUrl: './register.component.html',
  styleUrl: '../login/login.component.css'     // same look as the login page
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  // True when both password boxes have text but they are different
  passwordsDontMatch(): boolean {
    return this.confirmPassword !== '' && this.password !== this.confirmPassword;
  }

  onRegister(): void {
    this.errorMessage = '';

    if (this.passwordsDontMatch()) {
      return;
    }

    this.authService.register(this.name, this.email, this.password).subscribe({
      next: () => {
        // Go to login and pass the email in the URL so it is filled in: /login?registered=...
        this.router.navigate(['/login'], { queryParams: { registered: this.email } });
      },
      error: (err) => {
        // status 0 = no answer at all: the Express server (port 3000) is not running
        if (err.status === 0) {
          this.errorMessage = 'Cannot reach the server. Start it with "npm run dev" in the server folder.';
        } else {
          // e.g. "Email is already registered"
          this.errorMessage = err.error?.message || 'Something went wrong';
        }
      }
    });
  }
}
