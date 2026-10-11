import { Room } from './room';

// Matches the Block document coming from our API (server/models/Block.js)
export interface Block {
  _id?: string;          // "?" means optional: a new block has no _id until it is saved
  name: string;
  code: string;
  description: string;
  hasLift: boolean;
  svg: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  rooms: Room[];         // an array of Room objects
}
