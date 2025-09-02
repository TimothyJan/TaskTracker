import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-select-status',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './select-status.html',
  styleUrl: './select-status.css',
  standalone: true
})
export class SelectStatus implements OnChanges {
  @Input() value: string = "";
  @Output() statusChanged = new EventEmitter<string>();

  statuses: string[] = ["Not Started", "Active", "Completed"];
  selectedStatus: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.selectedStatus = this.value;
    }
  }

  /** on status change, emit value */
  onStatusChange(event: MatSelectChange): void {
    this.selectedStatus = event.value;
    this.statusChanged.emit(event.value);
  }
}
