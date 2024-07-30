import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';

@Component({
  selector: 'app-animated-number-counter',
  styleUrls: ['./animated-number-counter.component.scss'],
  standalone: true,
  template: `
    <div class="counter-container">
      <h1 [innerText]="title"></h1>
      <p [innerText]="subTitle"></p>
      <div class="counter-wrapper">
        <div class="counter" [@numberChange]="animationState">
          {{ displayNumber }}
        </div>
        <div class="counter-background" [@pulse]="animationState"></div>
      </div>
      @if (showControls) {
        <div class="controls">
          <button (click)="decrease()" class="btn btn-primary">-</button>
          <button (click)="increase()" class="btn btn-success">+</button>
          <button (click)="reset()" class="btn btn-danger">Reset</button>
        </div>
      } @else {
        <div class="controls">
          <button (click)="startClick()" class="btn btn-success">Start</button>
          <button (click)="stopClick()" class="btn btn-danger">Stop</button>
        </div>
      }
    </div>
  `,
  animations: [
    trigger('numberChange', [
      transition('* => *', [
        animate(
          '0.5s',
          keyframes([
            style({
              opacity: 0,
              transform: 'translate(-50%, -50%) scale(0.5) rotate(-180deg)',
              offset: 0,
            }),
            style({
              opacity: 0.5,
              transform: 'translate(-50%, -50%) scale(1.2) rotate(0deg)',
              offset: 0.5,
            }),
            style({
              opacity: 1,
              transform: 'translate(-50%, -50%) scale(1) rotate(0deg)',
              offset: 1,
            }),
          ]),
        ),
      ]),
    ]),
    trigger('pulse', [
      transition('* => *', [
        animate(
          '0.5s',
          keyframes([
            style({
              transform: 'scale(1)',
              boxShadow: '0 0 0 0 rgba(52, 152, 219, 0.7)',
              offset: 0,
            }),
            style({
              transform: 'scale(1.1)',
              boxShadow: '0 0 0 10px rgba(52, 152, 219, 0)',
              offset: 0.5,
            }),
            style({
              transform: 'scale(1)',
              boxShadow: '0 0 0 0 rgba(52, 152, 219, 0)',
              offset: 1,
            }),
          ]),
        ),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimatedNumberCounterComponent implements OnChanges {
  @Input() startNumber: number = 0;
  @Input() minNumber: number = Number.MIN_SAFE_INTEGER;
  @Input() maxNumber: number = Number.MAX_SAFE_INTEGER;
  @Input() step: number = 1;
  @Input() showControls: boolean = true;
  @Input() title: string = '';
  @Input() subTitle: string = '';
  @Output() start = new EventEmitter();
  @Output() stop = new EventEmitter();
  displayNumber: number = 0;
  animationState: string = 'initial';
  constructor(private cdr: ChangeDetectorRef) {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['startNumber']) {
      this.reset();
    }
  }

  startClick() {
    this.start.emit();
  }

  stopClick() {
    this.stop.emit();
  }

  increase() {
    if (this.displayNumber + this.step <= this.maxNumber) {
      this.displayNumber += this.step;
      this.triggerAnimation();
    }
  }

  decrease() {
    if (this.displayNumber - this.step >= this.minNumber) {
      this.displayNumber -= this.step;
      this.triggerAnimation();
    }
  }

  reset() {
    this.displayNumber = this.startNumber;
    this.triggerAnimation();
  }

  private triggerAnimation() {
    this.animationState = `${this.displayNumber}_${new Date().getTime()}`;
    this.cdr.markForCheck();
  }
}
