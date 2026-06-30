import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, query } from '@angular/animations';

const routeAnim = trigger('routeAnim', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(10px)' }),
      animate('180ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
    ], { optional: true }),
  ]),
]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  animations: [routeAnim],
  template: `
    <div class="app-shell" [@routeAnim]="getRoute(o)">
      <router-outlet #o="outlet"></router-outlet>
    </div>
  `,
  styles: [`:host { display: block; } .app-shell { min-height: 100vh; }`],
})
export class AppComponent {
  getRoute(outlet: RouterOutlet): string {
    return outlet?.isActivated
      ? outlet.activatedRoute.snapshot.url.join('/') || 'home'
      : '';
  }
}
