import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  // Eager = update the screen automatically whenever this component's data changes
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
  selector: 'app-admin',
  styleUrl: './admin.component.css',
  templateUrl: './admin.component.html',
})
export class AdminComponent {}
