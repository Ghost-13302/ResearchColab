import { Component, OnInit, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService, Invitation } from '../services/project.service';

@Component({
  selector: 'app-invitations-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './invitations-modal.component.html',
  styleUrls: ['./invitations-modal.component.css'],
})
export class InvitationsModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  invitations = signal<Invitation[]>([]);
  loading = signal(true);
  private snackBar = inject(MatSnackBar);

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadInvitations();
  }

  loadInvitations() {
    this.loading.set(true);
    this.projectService.getInvitations().subscribe({
      next: (resp) => {
        this.loading.set(false);
        this.invitations.set(resp.invitations || []);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Failed to load invitations.', 'Close', {
          duration: 4000,
          verticalPosition: 'top',
        });
      },
    });
  }

  accept(inv: Invitation) {
    this.projectService.respondToInvitation(inv.project_id, inv.id, 'accept').subscribe({
      next: () => this.loadInvitations(),
      error: () =>
        this.snackBar.open('Failed to accept invitation.', 'Close', { duration: 3000 }),
    });
  }

  reject(inv: Invitation) {
    this.projectService.respondToInvitation(inv.project_id, inv.id, 'reject').subscribe({
      next: () => this.loadInvitations(),
      error: () =>
        this.snackBar.open('Failed to reject invitation.', 'Close', { duration: 3000 }),
    });
  }

  onClose() {
    this.close.emit();
  }
}
