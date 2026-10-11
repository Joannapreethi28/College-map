import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockService } from '../../services/block.service';
import { Block } from '../../models/block';
import { BlockPanelComponent } from '../block-panel/block-panel.component';

@Component({
  // Eager = update the screen automatically whenever this component's data changes
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-map',
  imports: [NgFor, NgIf, BlockPanelComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
// "implements OnInit" is a TypeScript interface: it promises this class has ngOnInit()
export class MapComponent implements OnInit {
  blocks: Block[] = [];
  selectedBlock: Block | null = null;   // null = nothing selected yet
  notFoundCode = '';                    // set when the URL has a code that doesn't exist
  errorMessage = '';

  // Dependency injection: Angular passes in the services for us.
  // ActivatedRoute = info about the current URL (like the :code part)
  // Router = lets us change the URL from code
  constructor(
    private blockService: BlockService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // ngOnInit runs once, when the component first appears on screen
  ngOnInit(): void {
    // 1. Load all blocks from the API
    this.blockService.getBlocks().subscribe({
      next: (data) => {
        this.blocks = data;

        // 2. Only after the blocks arrive, look at the URL.
        // paramMap gives us the URL parameters, and fires again whenever they change
        // (e.g. going from /block/MB to /block/CS).
        this.route.paramMap.subscribe((params) => {
          const code = params.get('code');   // null on /map
          this.showBlock(code);
        });
      },
      error: () => {
        this.errorMessage = 'Could not load the map. Is the server running?';
      }
    });
  }

  // Called by (click) on a block in the template
  selectBlock(block: Block): void {
    // Change the URL to /block/MB. The paramMap subscription above
    // notices the change and selects the block, so the URL is the
    // single place that decides which block is selected.
    this.router.navigate(['/block', block.code]);
  }

  // Finds the block for a code from the URL and selects it
  private showBlock(code: string | null): void {
    this.notFoundCode = '';

    if (!code) {
      this.selectedBlock = null;
      return;
    }

    const found = this.blocks.find((b) => b.code === code.toUpperCase());

    if (found) {
      this.selectedBlock = found;
    } else {
      this.selectedBlock = null;
      this.notFoundCode = code;
    }
  }
}
