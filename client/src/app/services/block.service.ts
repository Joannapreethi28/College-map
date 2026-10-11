import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Block } from '../models/block';
import { SearchResult } from '../models/search-result';

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
  constructor(private http: HttpClient) {}

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
}
