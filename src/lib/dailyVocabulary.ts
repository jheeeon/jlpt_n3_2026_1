import type { Vocabulary, VocabularyProgress } from "../types/vocabulary";

export const DAILY_WORD_COUNT = 30;

function hashString(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function scoreWord(
  word: Vocabulary,
  progress: VocabularyProgress | undefined,
  dateKey: string,
): number {
  const priorityWeight = word.priority * 100_000;
  const favoriteWeight = progress?.isFavorite ? 35_000 : 0;
  const stableRandom = hashString(`${dateKey}:${word.id}`) % 50_000;

  return priorityWeight + favoriteWeight + stableRandom;
}

export function selectDailyVocabulary(
  words: Vocabulary[],
  progressById: Map<string, VocabularyProgress>,
  dateKey: string,
): Vocabulary[] {
  return [...words]
    .sort((a, b) => {
      const bScore = scoreWord(b, progressById.get(b.id), dateKey);
      const aScore = scoreWord(a, progressById.get(a.id), dateKey);
      return bScore - aScore;
    })
    .slice(0, DAILY_WORD_COUNT);
}
