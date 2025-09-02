import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-date-picker',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css',
  standalone: true,
})
export class DatePicker implements OnChanges {
  @Input() label: string = "Date";
  @Input() initialDate?: Date | null = null;
  @Output() dateSelected = new EventEmitter<Date>();

  // Unique ID for each datepicker instance
  pickerId = `datepicker-${Math.random().toString(36).substring(2, 9)}`;
  displayDate: Date | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialDate']) {
      this.displayDate = this.initialDate ? new Date(this.initialDate) : null;
    }
  }

  /** Handle date selection changes */
  onDateChange(date: Date) {
    this.displayDate = date;
    this.dateSelected.emit(date);
  }
}
