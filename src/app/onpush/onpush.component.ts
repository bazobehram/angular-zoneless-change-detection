import { ChangeDetectorRef, inject } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-on-push',
  standalone: true,
  imports: [],
  templateUrl: './onpush.component.html',
  styleUrl: './onpush.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnpushComponent {
  private cdr = inject(ChangeDetectorRef);

  @Input() parentValue!: number;
  value = 0;

  ngOnChanges(changes: SimpleChanges) {
    console.log('OnPush Component - ngOnChanges', changes);
  }

  updateValue() {
    this.value++;
  }
}
