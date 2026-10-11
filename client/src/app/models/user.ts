// What the login API sends back. We never get the password or its hash.
export interface User {
  _id: string;
  name: string;
  role: 'admin' | 'visitor';
}
