import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ProfileComponent } from './edit-profile/edit-profile.component';
import { ProjectsHomeComponent } from './projects-home/projects-home.component';
import { ProjectEditorComponent } from './edit-project/projectEditor.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'edit-profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'projects', component: ProjectsHomeComponent, canActivate: [authGuard] },
  { path: 'projects/:id', component: ProjectEditorComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
