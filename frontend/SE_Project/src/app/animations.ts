import { trigger, transition, style, animate } from '@angular/animations';

export const pageAnimation = trigger('pageAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(12px)' }),
    animate('180ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
]);
