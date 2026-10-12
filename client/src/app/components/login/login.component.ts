import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  // Eager = update the screen automatically whenever this component's data changes
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-login',
  imports: [NgIf, FormsModule, RouterLink],   // FormsModule = template-driven forms
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Already logged in (e.g. after a page refresh)? Skip the login page.
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/map']);
      return;
    }

    // Coming from the sign up page: /login?registered=you@mail.com
    // queryParamMap reads the values after "?" in the URL
    const registeredEmail = this.route.snapshot.queryParamMap.get('registered');
    if (registeredEmail) {
      this.email = registeredEmail;
      this.successMessage = 'Account created! Log in with your new password.';
    }
  }

  onLogin(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        this.authService.saveUser(user);
        this.router.navigate(['/map']); // everyone goes to the map after logging in
      },
      error: (err) => {
        // status 0 = no answer at all: the Express server (port 3000) is not running
        if (err.status === 0) {
          this.errorMessage = 'Cannot reach the server. Start it with "npm run dev" in the server folder.';
        } else {
          // err.error is the JSON the server sent, e.g. { message: 'Invalid email or password' }
          this.errorMessage = err.error?.message || 'Something went wrong';
        }
      }
    });
  }
}
