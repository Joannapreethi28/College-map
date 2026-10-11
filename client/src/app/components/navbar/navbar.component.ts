import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

// A COMPONENT = a TypeScript class (logic) + an HTML template (view) + CSS (style).
// "selector" is the HTML tag we use to place it: <app-navbar></app-navbar>
@Component({
  // Eager = update the screen automatically whenever this component's data changes
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  appName = 'Campus Navigator';
}
