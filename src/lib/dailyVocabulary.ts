import type { Vocabulary } from "../types/vocabulary";

export const DAILY_WORD_COUNT = 30;

function hashString(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function scoreWord(word: Vocabulary, dateKey: string): number {
  const priorityWeight = word.priority * 100_000;
  const stableRandom = hashString(`${dateKey}:${word.id}`) % 50_000;

  return priorityWeight + stableRandom;
}

export function selectDailyVocabulary(
  words: Vocabulary[],
  dateKey: string,
): Vocabulary[] {
  return [...words]
    .sort((a, b) => {
      const bScore = scoreWord(b, dateKey);
      const aScore = scoreWord(a, dateKey);
      return bScore - aScore;
    })
    .slice(0, DAILY_WORD_COUNT);
}
