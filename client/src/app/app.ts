import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

// The root component: the first component Angular shows (see main.ts).
// It only holds the navbar and the <router-outlet>.
@Component({
  // Eager = update the screen automatically whenever this component's data changes
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
