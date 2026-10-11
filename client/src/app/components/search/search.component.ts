import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  // Eager = update the screen automatically whenever this component's data changes
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
  selector: 'app-search',
  styleUrl: './search.component.css',
  templateUrl: './search.component.html',
})
export class SearchComponent {}
