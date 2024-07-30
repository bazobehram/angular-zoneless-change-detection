import {
  Component,
  ChangeDetectorRef,
  ApplicationRef,
  NgZone,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { ChildComponent } from '../child-component/child-component.component';
import { DefaultComponent } from '../default/default.component';
import { OnpushComponent } from '../onpush/onpush.component';

@Component({
  selector: 'app-change-detection-demo',
  standalone: true,
  imports: [ChildComponent, DefaultComponent, OnpushComponent],
  templateUrl: './change-detection-demo.component.html',
  styleUrls: ['./change-detection-demo.component.scss'],
})
export class ChangeDetectionDemoComponent implements OnInit {
  @Input() displayNumber!: number;
  @Output() updateParentValue = new EventEmitter<void>();

  microtaskValue = 'Initial';
  macrotaskValue = 'Initial';
  manualValue = 'Initial';
  promiseValue = 'Initial';
  observableValue = 'Initial';
  parentValue = 'Initial Parent';
  lastUpdateTime = 'Not measured';
  insideNgZoneValue = 'Initial';
  outsideNgZoneValue = 'Initial';

  private updateSubject = new BehaviorSubject<string>('Initial');
  constructor(
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    this.updateSubject.subscribe((value) => {
      console.log('Observable updated:', value);
      this.observableValue = value;
      // No automatic change detection in zoneless mode
    });
  }

  runMicroVsMacro() {
    console.time('MicroVsMacro');

    Promise.resolve().then(() => {
      this.microtaskValue = 'Updated by microtask';
      console.log('Microtask executed');
      // Microtasks might trigger change detection automatically
    });

    setTimeout(() => {
      this.macrotaskValue = 'Updated by macrotask';
      console.log('Macrotask executed');
      this.cdr.detectChanges(); // Manual detection needed for macrotasks
      console.timeEnd('MicroVsMacro');
    }, 0);
  }

  updateManually() {
    this.manualValue = 'Updated manually: ' + new Date().toISOString();
    console.log('Manual update without detection');
    // No change detection, view won't update
  }

  updateManuallyWithDetection() {
    this.manualValue = 'Updated with detection: ' + new Date().toISOString();
    console.log('Manual update with detection');
    this.cdr.detectChanges(); // Manual detection
  }

  runAsyncOperations() {
    console.time('AsyncOperations');

    // Promise
    Promise.resolve().then(() => {
      this.promiseValue = 'Promise resolved';
      console.log('Promise resolved');
      // Promises might trigger change detection automatically
    });

    // Observable
    of('Observable emitted')
      .pipe(
        delay(100),
        tap(() => console.log('Observable emitted')),
      )
      .subscribe((value) => {
        this.updateSubject.next(value);
        this.cdr.detectChanges(); // Manual detection needed for observables
        console.timeEnd('AsyncOperations');
      });
  }

  updateChild() {
    this.parentValue = 'Updated Parent: ' + new Date().toISOString();
    console.log('Parent updated, child should reflect changes');
    this.cdr.detectChanges(); // Updates both parent and child
  }

  measurePerformance() {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      this.cdr.detectChanges();
    }
    const end = performance.now();
    this.lastUpdateTime = `${end - start} ms for 1000 detections`;
    console.log(`Performance: ${this.lastUpdateTime}`);
    this.cdr.detectChanges(); // Update the view with the measurement
  }

  compareNgZone() {
    this.ngZone.run(() => {
      this.insideNgZoneValue = 'Inside NgZone: ' + new Date().toISOString();
      console.log('Inside NgZone update');
      // This might trigger change detection automatically
    });

    this.ngZone.runOutsideAngular(() => {
      this.outsideNgZoneValue = 'Outside NgZone: ' + new Date().toISOString();
      console.log('Outside NgZone update');
      this.cdr.detectChanges(); // Manual detection needed outside NgZone
    });
  }
}
