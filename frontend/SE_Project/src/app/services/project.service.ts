import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Project {
  id?: number;
  title: string;
  description: string;
  status: string;
  visibility: string;
  required_skills: string[];
  owner_id?: number;
}

export interface Invitation {
  id: number;
  project_id: number;
  project_title: string;
  inviter_name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private baseUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getUserProjects(): Observable<{ projects: Project[] }> {
    return this.http
      .get<{ projects: Project[] }>(`${this.baseUrl}/user`)
      .pipe(catchError((err) => throwError(() => err)));
  }

  getAllProjects(): Observable<{ projects: Project[] }> {
    return this.http
      .get<{ projects: Project[] }>(this.baseUrl)
      .pipe(catchError((err) => throwError(() => err)));
  }

  getProjectById(id: number): Observable<Project> {
    return this.http
      .get<Project>(`${this.baseUrl}/${id}`)
      .pipe(catchError((err) => throwError(() => err)));
  }

  createProject(projectData: Project): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(this.baseUrl, projectData)
      .pipe(catchError((err) => throwError(() => err)));
  }

  updateProject(id: number, project: Project): Observable<Project> {
    return this.http
      .put<Project>(`${this.baseUrl}/${id}`, project)
      .pipe(catchError((err) => throwError(() => err)));
  }

  getInvitations(): Observable<{ invitations: Invitation[] }> {
    return this.http
      .get<{ invitations: Invitation[] }>(`${this.baseUrl}/invitations`)
      .pipe(catchError((err) => throwError(() => err)));
  }

  inviteCollaborator(
    projectId: number,
    email: string,
    role: string
  ): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(
        `${this.baseUrl}/${projectId}/collaborators`,
        { email, role }
      )
      .pipe(catchError((err) => throwError(() => err)));
  }

  respondToInvitation(
    projectId: number,
    invitationId: number,
    action: 'accept' | 'reject'
  ): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(
        `${this.baseUrl}/${projectId}/collaborators/invitations/${invitationId}/${action}`,
        {}
      )
      .pipe(catchError((err) => throwError(() => err)));
  }
}
