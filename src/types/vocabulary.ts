export type Vocabulary = {
  id: string;
  word: string;
  reading: string;
  meaningKo: string;
  meaningEn?: string;
  jlptLevel: number;
  priority: number;
  tags: string[];
  sourceOrder: number;
  translationStatus: "manual" | "auto_exact" | "auto_token" | "needs_review";
};

export type VocabularyProgress = {
  vocabularyId: string;
  isMemorized: boolean;
  isFavorite: boolean;
  reviewCount: number;
  lastStudiedOn?: string | null;
  updatedAt?: string;
};

export type VocabularyRow = {
  id: string;
  word: string;
  reading: string;
  meaning_ko: string;
  meaning_en: string | null;
  jlpt_level: number;
  priority: number;
  tags: string[] | null;
  source_order: number | null;
  translation_status: Vocabulary["translationStatus"];
};

export type VocabularyProgressRow = {
  vocabulary_id: string;
  is_memorized: boolean;
  is_favorite: boolean;
  review_count: number;
  last_studied_on: string | null;
  updated_at: string;
};
