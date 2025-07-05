export interface Passage {
  _id: string;
  title: string;
  content: string;
  category?: string;
  createdAt: Date;
  updatedAt?: Date;
  assignedTo?: string[];
  testType?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  language?: 'english' | 'hindi';
  wordCount?: number;
  isActive?: boolean;
}

export interface CharacterHighlight {
  char: string;
  status: 'correct' | 'wrong';
} 