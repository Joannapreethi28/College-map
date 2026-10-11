import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BlockService } from '../../services/block.service';
import { FacultyService } from '../../services/faculty.service';
import { Block } from '../../models/block';
import { BlockPanelComponent } from '../block-panel/block-panel.component';

@Component({
  // Eager = update the screen automatically whenever this component's data changes
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-map',
  imports: [BlockPanelComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
// "implements OnInit" is a TypeScript interface: it promises this class has ngOnInit()
export class MapComponent implements OnInit {
  blocks: Block[] = [];

  // Dependency injection: Angular passes in the services for us
  constructor(
    private blockService: BlockService,
    private facultyService: FacultyService
  ) {}

  // ngOnInit runs once, when the component first appears on screen.
  // It is the usual place to load data.
  ngOnInit(): void {
    // subscribe() sends the request; the arrow function runs when the data arrives
    this.blockService.getBlocks().subscribe((data) => {
      this.blocks = data;
      console.log('Blocks from API:', data);
    });

    // Phase 4 check only: make sure the faculty service works too
    this.facultyService.getFaculty('CS').subscribe((data) => {
      console.log('Faculty in CS block:', data);
    });
  }
}
