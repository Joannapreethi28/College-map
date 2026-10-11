// Matches the Faculty document coming from our API (server/models/Faculty.js)
export interface Faculty {
  _id?: string;
  name: string;
  department: string;
  email?: string;        // optional: search results leave out the email
  cabin: {
    blockCode: string;   // links this person to a Block by its code
    roomNumber: string;
  };
}
