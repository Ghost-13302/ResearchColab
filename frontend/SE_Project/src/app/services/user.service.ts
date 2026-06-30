import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserProfile {
  full_name: string;
  affiliation: string;
  bio: string;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/users/${userId}/profile`);
  }

  updateProfile(userId: string, profile: Partial<UserProfile>): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.baseUrl}/users/${userId}/profile`,
      profile
    );
  }
}
