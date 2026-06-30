import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { pageAnimation } from '../animations';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HeaderComponent } from '../header/header.component';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSelectModule } from '@angular/material/select';
import { Project, ProjectService } from '../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { InviteCollaboratorModalComponent } from '../invite-collaborator-modal/invite-collaborator-modal.component';

@Component({
  selector: 'app-project_editor',
  standalone: true,
  animations: [pageAnimation],
  imports: [
    CommonModule,
    TitleCasePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    HeaderComponent,
    MatChipsModule,
    MatSelectModule,
    InviteCollaboratorModalComponent,
  ],
  templateUrl: './projectEditor.component.html',
  styleUrls: ['./projectEditor.component.css'],
})
export class ProjectEditorComponent implements OnInit {
  private snackBar = inject(MatSnackBar);

  projectForm!: FormGroup;
  project: Project | null = null;
  projectId: number = 0;

  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  skills = signal<string[]>([]);
  showInviteModal = signal(false);

  statusOptions = ['open', 'closed'];
  visibilityOptions = ['private', 'public'];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['', Validators.required],
      visibility: ['', Validators.required],
      required_skills: [''],
    });
    this.loadProject();
  }

  openInviteModal() { this.showInviteModal.set(true); }
  closeInviteModal() { this.showInviteModal.set(false); }

  loadProject() {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.projectId = idParam ? +idParam : 0;

      if (this.projectId) {
        this.projectService.getProjectById(this.projectId).subscribe({
          next: (data) => {
            this.projectForm.patchValue(data);
            if (data.required_skills?.length) {
              this.skills.set(data.required_skills);
            }
          },
          error: () => {
            this.snackBar.open('Project not found.', 'Close', {
              duration: 4000,
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }

  handleSave() {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      this.snackBar.open('Please fill out required fields.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
      });
      return;
    }

    const updatedProject: Project = {
      ...this.projectForm.value,
      id: this.projectId,
      required_skills: this.skills(),
    };

    this.projectService.updateProject(this.projectId, updatedProject).subscribe({
      next: () => {
        this.snackBar.open('Project saved successfully!', 'OK', {
          duration: 3000,
          verticalPosition: 'top',
        });
      },
      error: () => {
        this.snackBar.open('Failed to save project.', 'Close', {
          duration: 4000,
          verticalPosition: 'top',
        });
      },
    });
  }

  handleAddSkill(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.skills.update((skills) => [...skills, value]);
      this.projectForm.get('required_skills')?.setValue([...this.skills()]);
    }
    event.chipInput!.clear();
  }

  handleDeleteSkill(skill: string) {
    this.skills.update((skills) => skills.filter((s) => s !== skill));
    this.projectForm.get('required_skills')?.setValue([...this.skills()]);
  }
}
