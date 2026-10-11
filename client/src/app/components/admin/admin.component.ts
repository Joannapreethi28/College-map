import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlockService } from '../../services/block.service';
import { Block } from '../../models/block';
import { Room } from '../../models/room';

@Component({
  // Eager = update the screen automatically whenever this component's data changes
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-admin',
  // ReactiveFormsModule = REACTIVE forms (the form is built in TypeScript, not in the HTML)
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  blocks: Block[] = [];
  editingCode: string | null = null;   // null = adding a new block, otherwise the code being edited
  message = '';
  errorMessage = '';

  // REACTIVE FORM: we describe every field and its rules (validators) here in TypeScript.
  // FormGroup = a group of fields, FormControl = one field, FormArray = a list of fields.
  blockForm = new FormGroup({
    name: new FormControl('', Validators.required),
    code: new FormControl('', [
      Validators.required,
      Validators.pattern('^[A-Z0-9]+$')   // only capital letters and numbers, e.g. "MB"
    ]),
    description: new FormControl(''),
    hasLift: new FormControl(false),

    // A nested group for the rectangle on the map (the map is 800 x 500)
    svg: new FormGroup({
      x: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(800)]),
      y: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(500)]),
      w: new FormControl(150, [Validators.required, Validators.min(1)]),
      h: new FormControl(90, [Validators.required, Validators.min(1)])
    }),

    // FormArray: a list that can grow or shrink, one FormGroup per room row
    rooms: new FormArray<FormGroup>([])
  });

  constructor(private blockService: BlockService) {}

  ngOnInit(): void {
    this.loadBlocks();
  }

  loadBlocks(): void {
    this.blockService.getBlocks().subscribe((data) => {
      this.blocks = data;
    });
  }

  // A "getter": lets the template write "rooms" instead of blockForm.get('rooms')
  get rooms(): FormArray<FormGroup> {
    return this.blockForm.controls.rooms;
  }

  // Builds one room row (used for new rows and when editing)
  createRoomGroup(room?: Room): FormGroup {
    return new FormGroup({
      number: new FormControl(room ? room.number : '', Validators.required),
      name: new FormControl(room ? room.name : '', Validators.required),
      type: new FormControl(room ? room.type : 'classroom', Validators.required),
      floor: new FormControl(room ? room.floor : 0, [Validators.required, Validators.min(0)])
    });
  }

  addRoom(): void {
    this.rooms.push(this.createRoomGroup());
  }

  removeRoom(index: number): void {
    this.rooms.removeAt(index);
  }

  // True if a field is wrong AND the user has already touched it (to show a red message)
  showError(path: string): boolean {
    const control = this.blockForm.get(path);
    return control !== null && control.invalid && control.touched;
  }

  // Fill the form with an existing block
  editBlock(block: Block): void {
    this.editingCode = block.code;
    this.message = '';
    this.errorMessage = '';

    // patchValue copies matching values into the form fields
    this.blockForm.patchValue({
      name: block.name,
      code: block.code,
      description: block.description,
      hasLift: block.hasLift,
      svg: block.svg
    });

    // Rebuild the room rows for this block
    this.rooms.clear();
    block.rooms.forEach((room) => this.rooms.push(this.createRoomGroup(room)));

    window.scrollTo(0, 0);
  }

  // Clear the form and go back to "add" mode
  resetForm(): void {
    this.editingCode = null;
    this.blockForm.reset({
      name: '',
      code: '',
      description: '',
      hasLift: false,
      svg: { x: 0, y: 0, w: 150, h: 90 }
    });
    this.rooms.clear();
  }

  onSubmit(): void {
    this.message = '';
    this.errorMessage = '';

    if (this.blockForm.invalid) {
      this.blockForm.markAllAsTouched(); // show all the error messages
      return;
    }

    // The form's value already has the same shape as a Block
    const block = this.blockForm.value as Block;

    // Same success/error handling for both create and update
    const handlers = {
      next: () => {
        this.message = this.editingCode ? `Block ${block.code} updated.` : `Block ${block.code} added.`;
        this.resetForm();
        this.loadBlocks(); // refresh the list
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Something went wrong';
      }
    };

    if (this.editingCode) {
      this.blockService.updateBlock(this.editingCode, block).subscribe(handlers);
    } else {
      this.blockService.createBlock(block).subscribe(handlers);
    }
  }

  deleteBlock(block: Block): void {
    // confirm() shows the browser's OK / Cancel box
    if (!confirm(`Delete ${block.name} (${block.code})? This cannot be undone.`)) {
      return;
    }

    this.blockService.deleteBlock(block.code).subscribe({
      next: () => {
        this.message = `Block ${block.code} deleted.`;
        if (this.editingCode === block.code) {
          this.resetForm();
        }
        this.loadBlocks();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Could not delete the block';
      }
    });
  }
}
