import { supabase } from "./supabase";
import type {
  Vocabulary,
  VocabularyProgress,
  VocabularyProgressRow,
  VocabularyRow,
} from "../types/vocabulary";

function mapVocabulary(row: VocabularyRow): Vocabulary {
  return {
    id: row.id,
    word: row.word,
    reading: row.reading,
    meaningKo: row.meaning_ko,
    meaningEn: row.meaning_en ?? undefined,
    jlptLevel: row.jlpt_level,
    priority: row.priority,
    tags: row.tags ?? [],
    sourceOrder: row.source_order ?? 0,
    translationStatus: row.translation_status,
  };
}

function mapProgress(row: VocabularyProgressRow): VocabularyProgress {
  return {
    vocabularyId: row.vocabulary_id,
    isMemorized: row.is_memorized,
    isFavorite: row.is_favorite,
    reviewCount: row.review_count,
    lastStudiedOn: row.last_studied_on,
    updatedAt: row.updated_at,
  };
}

export async function fetchVocabulary(): Promise<Vocabulary[]> {
  const pageSize = 1000;
  const rows: VocabularyRow[] = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("vocabulary")
      .select(
        "id, word, reading, meaning_ko, meaning_en, jlpt_level, priority, tags, source_order, translation_status",
      )
      .order("priority", { ascending: false })
      .order("source_order", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) throw error;
    const page = (data ?? []) as VocabularyRow[];
    rows.push(...page);
    if (page.length < pageSize) break;
  }

  return rows.map(mapVocabulary);
}

export async function fetchVocabularyProgress(): Promise<VocabularyProgress[]> {
  const pageSize = 1000;
  const rows: VocabularyProgressRow[] = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("vocabulary_progress")
      .select("vocabulary_id, is_memorized, is_favorite, review_count, last_studied_on, updated_at")
      .range(from, from + pageSize - 1);

    if (error) throw error;
    const page = (data ?? []) as VocabularyProgressRow[];
    rows.push(...page);
    if (page.length < pageSize) break;
  }

  return rows.map(mapProgress);
}

export async function saveVocabularyProgress(progress: VocabularyProgress): Promise<VocabularyProgress> {
  const { data, error } = await supabase
    .from("vocabulary_progress")
    .upsert(
      {
        vocabulary_id: progress.vocabularyId,
        is_memorized: progress.isMemorized,
        is_favorite: progress.isFavorite,
        review_count: progress.reviewCount,
        last_studied_on: progress.lastStudiedOn ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "vocabulary_id" },
    )
    .select("vocabulary_id, is_memorized, is_favorite, review_count, last_studied_on, updated_at")
    .single();

  if (error) throw error;
  return mapProgress(data as VocabularyProgressRow);
}
