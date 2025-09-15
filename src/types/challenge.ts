export interface Challenge {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: number;
  mentorId: string;
  applicants?: string[];
  applicantsEssay?: Record<string, string>; // userId -> essay
  applicantsStatus?: Record<string, 'accepted' | 'rejected' | 'pending'>;
  acceptEmail?: string;
  rejectEmail?: string;
  submissionStart?: number; // timestamp
  submissionDeadline?: number; // timestamp
  telegram?: string; // mentor's telegram account
  faq?: { question: string; answer: string }[];
  association: string; // school, company, or e-association name
  difficulty: 'beginner' | 'intermediate' | 'experienced';
}
