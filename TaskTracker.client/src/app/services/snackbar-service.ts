import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private snackBar = inject(MatSnackBar);

  private defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  };

  /**
   * Shows a success notification
   * @param message The message to display
   * @param action The action text (default: 'Close')
   */
  success(message: string, action: string = 'Close'): void {
    this.show(message, action, {
      ...this.defaultConfig,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Shows an error notification
   * @param message The message to display
   * @param action The action text (default: 'Close')
   */
  error(message: string, action: string = 'Close'): void {
    this.show(message, action, {
      ...this.defaultConfig,
      panelClass: ['error-snackbar'],
      duration: 5000 // Longer duration for errors
    });
  }

  /**
   * Shows a warning notification
   * @param message The message to display
   * @param action The action text (default: 'Close')
   */
  warning(message: string, action: string = 'Close'): void {
    this.show(message, action, {
      ...this.defaultConfig,
      panelClass: ['warning-snackbar']
    });
  }

  private show(message: string, action: string, config: MatSnackBarConfig): void {
    this.snackBar.open(message, action, config);
  }
}
