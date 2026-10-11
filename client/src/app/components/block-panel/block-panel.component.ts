import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  // Eager = update the screen automatically whenever this component's data changes
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
  selector: 'app-block-panel',
  styleUrl: './block-panel.component.css',
  templateUrl: './block-panel.component.html',
})
export class BlockPanelComponent {}
