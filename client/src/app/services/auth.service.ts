import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

// Keeps track of who is logged in.
// localStorage = a small storage space in the browser that survives page reloads.
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private storageKey = 'campusUser';

  // The logged-in user, or null if nobody is logged in
  currentUser: User | null = null;

  constructor(private http: HttpClient) {
    // When the app starts, check if someone logged in earlier
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      this.currentUser = JSON.parse(saved); // text -> object
    }
  }

  // POST /api/auth/login. The component subscribes and calls saveUser() on success.
  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email: email, password: password });
  }

  saveUser(user: User): void {
    this.currentUser = user;
    localStorage.setItem(this.storageKey, JSON.stringify(user)); // object -> text
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.storageKey);
  }

  isAdmin(): boolean {
    return this.currentUser !== null && this.currentUser.role === 'admin';
  }

  // Admin requests must send the user's id in the x-user-id header.
  // The server's requireAdmin middleware reads it and checks the role.
  getAdminHeaders(): HttpHeaders {
    const id = this.currentUser ? this.currentUser._id : '';
    return new HttpHeaders({ 'x-user-id': id });
  }
}
