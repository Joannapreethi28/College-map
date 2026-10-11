import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { Block } from '../../models/block';
import { Faculty } from '../../models/faculty';
import { FacultyService } from '../../services/faculty.service';

@Component({
  // Eager = update the screen automatically whenever this component's data changes
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-block-panel',
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './block-panel.component.html',
  styleUrl: './block-panel.component.css'
})
export class BlockPanelComponent implements OnChanges {
  // @Input = a value passed IN from the parent component (MapComponent),
  // like this: <app-block-panel [block]="selectedBlock">
  @Input() block: Block | null = null;
  @Input() notFoundCode = '';

  faculty: Faculty[] = [];

  constructor(private facultyService: FacultyService) {}

  // ngOnChanges runs every time an @Input value changes,
  // so whenever a new block is selected we load its faculty
  ngOnChanges(): void {
    this.faculty = [];

    if (this.block) {
      this.facultyService.getFaculty(this.block.code).subscribe((data) => {
        this.faculty = data;
      });
    }
  }

  // Turns a floor number into a label: 0 -> "Ground floor", 1 -> "Floor 1"
  floorLabel(floor: number): string {
    if (floor === 0) {
      return 'Ground floor';
    }
    return 'Floor ' + floor;
  }
}
