import { Room } from './room';
import { Faculty } from './faculty';

// What GET /api/search?q= sends back
export interface SearchResult {
  blocks: {
    _id: string;
    name: string;
    code: string;
    rooms: Room[];   // only the rooms that matched
  }[];
  faculty: Faculty[];
}
