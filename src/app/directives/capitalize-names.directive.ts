import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { capitalizeNames } from '../utils/name-utils';

@Directive({
  selector: '[appCapitalizeNames]',
  standalone: true
})
export class CapitalizeNamesDirective {

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private ngControl: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const originalValue = input.value;
    const cursorPosition = input.selectionStart || 0;
    
    // Apply capitalization
    const capitalizedValue = capitalizeNames(originalValue);
    
    // Only update if value actually changed to avoid unnecessary operations
    if (originalValue !== capitalizedValue) {
      // Update the form control value
      if (this.ngControl?.control) {
        this.ngControl.control.setValue(capitalizedValue, { emitEvent: false });
      }
      
      // Update the input element value
      input.value = capitalizedValue;
      
      // Restore cursor position (adjust for any length changes)
      const lengthDiff = capitalizedValue.length - originalValue.length;
      const newCursorPosition = Math.min(cursorPosition + lengthDiff, capitalizedValue.length);
      
      // Use setTimeout to ensure the cursor position is set after the value update
      setTimeout(() => {
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  }
}