export interface Challenge {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: number;
  mentorId: string;
  applicants?: string[];
}
