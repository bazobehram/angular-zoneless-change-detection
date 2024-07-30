import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child',
  standalone: true,
  template: `<p>
    Child Value: <span class="value">{{ childValue }}</span>
  </p>`,
  styles: [
    `
      .value {
        background: linear-gradient(45deg, #ff416c, #8d4de8);
        color: white;
        border-radius: 5px;
        padding: 2px;
      }
    `,
  ],
})
export class ChildComponent {
  private _inputValue = '';
  childValue = 'Initial Child';

  @Input() set inputValue(value: string) {
    this._inputValue = value;
    this.childValue = 'Child received: ' + value;
    console.log('Child input updated:', value);
    // No automatic change detection in zoneless mode
  }
}
