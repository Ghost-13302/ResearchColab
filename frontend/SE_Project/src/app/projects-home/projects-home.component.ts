import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { Project, ProjectService } from '../services/project.service';
import { HeaderComponent } from '../header/header.component';
import { pageAnimation } from '../animations';

@Component({
  selector: 'app-projects-home',
  standalone: true,
  imports: [
    CommonModule,
    TitleCasePipe,
    HeaderComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './projects-home.component.html',
  styleUrls: ['./projects-home.component.css'],
  animations: [pageAnimation],
})
export class ProjectsHomeComponent implements OnInit {
  projects   = signal<Project[]>([]);
  loading    = signal(true);
  submitting = signal(false);
  showCreateModal = signal(false);
  createForm!: FormGroup;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly addOnBlur = true;
  skills = signal<string[]>([]);

  private snackBar = inject(MatSnackBar);

  statusOptions     = ['open', 'closed'];
  visibilityOptions = ['private', 'public'];

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.createForm = this.fb.group({
      title:       ['', Validators.required],
      description: [''],
      status:      ['open', Validators.required],
      visibility:  ['private', Validators.required],
    });
    this.loadProjects();
  }

  loadProjects() {
    this.loading.set(true);
    this.projectService.getUserProjects().subscribe({
      next: (r) => { this.loading.set(false); this.projects.set(r.projects || []); },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Failed to load projects.', 'Close', { duration: 4000, verticalPosition: 'top' });
      },
    });
  }

  onCreateProject()  { this.showCreateModal.set(true); }

  closeModal() {
    this.showCreateModal.set(false);
    this.skills.set([]);
    this.createForm.reset({ title: '', description: '', status: 'open', visibility: 'private' });
  }

  handleAddSkill(event: MatChipInputEvent) {
    const v = (event.value || '').trim();
    if (v) this.skills.update((s) => [...s, v]);
    event.chipInput!.clear();
  }

  handleDeleteSkill(skill: string) { this.skills.update((s) => s.filter((x) => x !== skill)); }

  submitCreateForm() {
    if (this.createForm.invalid) { this.createForm.markAllAsTouched(); return; }
    this.submitting.set(true);
    const { title, description, status, visibility } = this.createForm.value;
    const newProject: Project = { title, description: description || '', status, visibility, required_skills: this.skills() };
    this.projectService.createProject(newProject).subscribe({
      next: () => {
        this.submitting.set(false);
        this.snackBar.open('Project created!', 'Close', { duration: 3000, verticalPosition: 'top' });
        this.closeModal();
        this.loadProjects();
      },
      error: () => {
        this.submitting.set(false);
        this.snackBar.open('Failed to create project.', 'Close', { duration: 4000, verticalPosition: 'top' });
      },
    });
  }

  openProject(id: number | undefined) { if (id != null) this.router.navigate(['/projects', id]); }
}
