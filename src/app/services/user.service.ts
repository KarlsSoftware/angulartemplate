import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UpdateProfileRequest {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateProfileResponse {
  message: string;
  requireReLogin?: boolean;
  user?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  updateProfile(profileData: UpdateProfileRequest): Observable<UpdateProfileResponse> {
    return this.http.put<UpdateProfileResponse>(`${this.apiUrl}/api/auth/profile`, profileData, {
      withCredentials: true
    });
  }
}