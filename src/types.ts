export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index ng tamang sagot (0 = A, 1 = B, 2 = C, 3 = D)
}

export type AnswerStatus = 'correct' | 'wrong' | 'unanswered';