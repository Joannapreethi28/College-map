import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BlockService } from '../../services/block.service';
import { SearchResult } from '../../models/search-result';

@Component({
  // Eager = update the screen automatically whenever this component's data changes
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-search',
  // FormsModule gives us ngModel and ngForm for TEMPLATE-DRIVEN forms
  imports: [NgFor, NgIf, FormsModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  query = '';                              // linked to the textbox with [(ngModel)]
  result: SearchResult | null = null;      // null = haven't searched yet
  searchedFor = '';                        // the text we last searched for
  loading = false;
  errorMessage = '';

  constructor(private blockService: BlockService) {}

  // Runs when the form is submitted (ngSubmit)
  onSearch(): void {
    const q = this.query.trim();
    this.loading = true;
    this.errorMessage = '';

    // subscribe can take an object with next (success) and error (failure)
    this.blockService.search(q).subscribe({
      next: (data) => {
        this.result = data;
        this.searchedFor = q;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Could not reach the server. Is it running?';
        this.loading = false;
      }
    });
  }

  // True when a search came back with nothing at all
  noResults(): boolean {
    return this.result !== null && this.result.blocks.length === 0 && this.result.faculty.length === 0;
  }
}
