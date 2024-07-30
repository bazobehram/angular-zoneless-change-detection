import {
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
  Input,
  ApplicationRef,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DefaultComponent } from './default/default.component';
import { OnpushComponent } from './onpush/onpush.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { AnimatedNumberCounterComponent } from './animated-number-counter/animated-number-counter.component';
import { ChangeDetectionDemoComponent } from './change-detection-demo/change-detection-demo.component';

export interface Post {
  id: number;
  name: string;
  username: string;
  email: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatCardModule,
    RouterOutlet,
    FormsModule,
    MatGridListModule,
    MatButtonModule,
    MatIcon,
    DatePipe,
    DefaultComponent,
    OnpushComponent,
    AnimatedNumberCounterComponent,
    ChangeDetectionDemoComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('numberChange', [
      transition('* => *', [
        style({ transform: 'scale(1.5)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  @Input() startNumber: number = 10;
  private http = inject(HttpClient);
  private apiRef = inject(ApplicationRef);
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private cdr = inject(ChangeDetectorRef);
  private signalIntervalId: any;
  private standartIntervalId: any;
  title = 'Zoneless Angular App';
  standartCount: number = 0;
  signalCount = signal<number>(0);
  count: number = 0;
  countSig = signal(0);
  signalPosts = signal<Post[]>([]);
  posts: Post[] = [];
  detectChanges = signal(false);
  displayNumber: number = 0;
  counterState: string = '10';
  autoCount = 0;
  manualCount = 0;
  asyncResult = '';
  inputValue = '';
  isInAngularZone!: boolean;
  promiseResult = '';

  ngOnInit(): void {}

  onInput(event: Event) {
    this.inputValue = (event.target as HTMLInputElement).value;
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  updateParentValue() {
    this.displayNumber++;
  }
  parentData = { value: 0 };

  updateParent() {
    this.parentData.value++;
  }

  updateChild() {
    // This will not trigger change detection in OnPush component
    this.parentData.value++;
  }

  startStandartInterval() {
    if (!this.standartIntervalId) {
      // Only start if not already running
      this.standartIntervalId = setInterval(() => {
        this.standartCount++;
      }, 1000);
    }
  }

  // Method to stop the interval
  stopStandartInterval() {
    if (this.standartIntervalId) {
      clearInterval(this.standartIntervalId);
      this.standartIntervalId = null; // Reset the intervalId after clearing it
    }
  }

  startSignalInterval() {
    if (!this.signalIntervalId) {
      // Only start if not already running
      this.signalIntervalId = setInterval(() => {
        this.signalCount.update((count) => count + 1);
      }, 1000);
    }
  }

  // Method to stop the interval
  stopSignalInterval() {
    if (this.signalIntervalId) {
      clearInterval(this.signalIntervalId);
      this.signalIntervalId = null; // Reset the intervalId after clearing it
    }
  }

  callWithoutChangeDetection(): void {
    this.getPosts().subscribe({
      next: (posts) => {
        console.log(posts), (this.posts = posts);
      },
      error: (error) => console.error('Error fetching posts:', error),
    });
  }

  callWithSignals(): void {
    this.getPosts().subscribe({
      next: (posts) => {
        console.log(posts), this.signalPosts.set(posts);
      },
      error: (error) => console.error('Error fetching posts:', error),
    });
  }

  changeDetectorRef(): void {
    this.detectChanges.update((value) => !value);
    this.cdr.detectChanges();
    setTimeout(() => {
      this.detectChanges.update((value) => !value);
    }, 2000);
  }

  runPromise() {
    Promise.resolve().then(() => {
      this.promiseResult = new Date().toISOString();
    });
  }
}
