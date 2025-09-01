import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidenavService {
  private _isOpen = new BehaviorSubject<boolean>(false);
  isOpen$ = this._isOpen.asObservable();

  // Add getter for current value
  get currentState(): boolean {
    return this._isOpen.value;
  }

  toggle() {
    this._isOpen.next(!this._isOpen.value);
  }

  open() {
    this._isOpen.next(true);
  }

  close() {
    this._isOpen.next(false);
  }
}
