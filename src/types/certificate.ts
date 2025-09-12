export interface Certificate {
  id: string;
  userId: string;
  type: 'main' | 'challenge';
  createdAt: number;
  username: string;
  email: string;
  status?: string; // e.g. Beginner, etc.
  challengeId?: string;
  challengeTitle?: string;
  mentorId?: string;
  mentorUsername?: string;
  mentorFeedback?: string;
  challengesCompleted?: number;
  // Add more fields as needed
}
