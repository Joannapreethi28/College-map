import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Block } from '../models/block';
import { SearchResult } from '../models/search-result';
import { AuthService } from './auth.service';

// A SERVICE is a class that holds code shared by many components,
// here: talking to the /api/blocks part of our Express server.
//
// @Injectable + providedIn: 'root' tells Angular to create ONE copy of this
// service for the whole app and give it to any component that asks for it.
// This is DEPENDENCY INJECTION: components don't create the service with "new",
// Angular "injects" (hands over) the ready-made service.
@Injectable({
  providedIn: 'root'
})
export class BlockService {
  private apiUrl = 'http://localhost:3000/api/blocks';

  // HttpClient is itself a service, injected here through the constructor.
  // "private http" creates a property this.http automatically.
  // A service can inject another service too (AuthService, for the admin header).
  constructor(private http: HttpClient, private authService: AuthService) {}

  // ---------- Public ----------

  // GET /api/blocks
  // Returns an Observable: the request only runs when someone calls .subscribe()
  getBlocks(): Observable<Block[]> {
    return this.http.get<Block[]>(this.apiUrl);
  }

  // GET /api/blocks/:code
  getBlock(code: string): Observable<Block> {
    return this.http.get<Block>(`${this.apiUrl}/${code}`);
  }

  // GET /api/search?q=lab
  // encodeURIComponent makes text with spaces or symbols safe to put in a URL
  search(q: string): Observable<SearchResult> {
    return this.http.get<SearchResult>(`http://localhost:3000/api/search?q=${encodeURIComponent(q)}`);
  }

  // ---------- Admin only (send the x-user-id header) ----------

  // POST /api/blocks
  createBlock(block: Block): Observable<Block> {
    return this.http.post<Block>(this.apiUrl, block, { headers: this.authService.getAdminHeaders() });
  }

  // PUT /api/blocks/:code
  updateBlock(code: string, block: Block): Observable<Block> {
    return this.http.put<Block>(`${this.apiUrl}/${code}`, block, { headers: this.authService.getAdminHeaders() });
  }

  // DELETE /api/blocks/:code
  deleteBlock(code: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${code}`, { headers: this.authService.getAdminHeaders() });
  }
}
