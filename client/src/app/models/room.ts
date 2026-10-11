// An interface describes the SHAPE of an object in TypeScript.
// It doesn't create anything at runtime; it just lets the editor
// warn us if we use a wrong field name or a wrong type.

// A "union type": type can only be one of these four strings
export type RoomType = 'lab' | 'classroom' | 'office' | 'other';

export interface Room {
  number: string;
  name: string;
  type: RoomType;
  floor: number;
}
