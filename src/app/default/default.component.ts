import {
  ChangeDetectionStrategy,
  Component,
  Input,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [],
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DefaultComponent {
  @Input() parentValue!: number;
  value = 0;

  ngOnChanges(changes: SimpleChanges) {
    console.log('Default Component - ngOnChanges', changes);
  }

  updateValue() {
    this.value++;
  }
}
