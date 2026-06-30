import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { pageAnimation } from '../animations';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css'],
  animations: [pageAnimation],
})
export class AboutPageComponent {}
