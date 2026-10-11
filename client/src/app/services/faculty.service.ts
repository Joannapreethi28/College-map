import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Faculty } from '../models/faculty';

// Talks to the /api/faculty part of our Express server
@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private apiUrl = 'http://localhost:3000/api/faculty';

  constructor(private http: HttpClient) {}

  // GET /api/faculty  or  GET /api/faculty?blockCode=CS
  // blockCode is optional ("?"), so we can call getFaculty() or getFaculty('CS')
  getFaculty(blockCode?: string): Observable<Faculty[]> {
    if (blockCode) {
      return this.http.get<Faculty[]>(`${this.apiUrl}?blockCode=${blockCode}`);
    }
    return this.http.get<Faculty[]>(this.apiUrl);
  }
}
