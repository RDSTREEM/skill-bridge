export type UserRole = "student" | "mentor";

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  username: string;
  role: UserRole;
  createdAt: number;
  // Add more fields as needed
}
