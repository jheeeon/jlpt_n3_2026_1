import { Bookmark, Check, RotateCcw } from "lucide-react";
import type { Vocabulary, VocabularyProgress } from "../types/vocabulary";

type VocabularyCardProps = {
  word: Vocabulary;
  progress?: VocabularyProgress;
  isSaving: boolean;
  onToggleMemorized: (word: Vocabulary) => void;
  onToggleFavorite: (word: Vocabulary) => void;
};

export function VocabularyCard({
  word,
  progress,
  isSaving,
  onToggleMemorized,
  onToggleFavorite,
}: VocabularyCardProps) {
  const isMemorized = progress?.isMemorized ?? false;
  const isFavorite = progress?.isFavorite ?? false;

  return (
    <article className="border-b border-ink/10 bg-white/50 px-4 py-4 sm:px-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="break-words text-3xl font-semibold leading-tight text-ink">
              {word.word}
            </h2>
            <p className="break-words text-base font-medium text-ink/60">{word.reading}</p>
          </div>
          <p className="mt-2 break-words text-xl font-semibold text-matcha">{word.meaningKo}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink/55">
            <span>priority {word.priority}</span>
            {word.translationStatus === "needs_review" ? <span>검수 필요</span> : null}
            {progress?.reviewCount ? <span>복습 {progress.reviewCount}회</span> : null}
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            className={`grid h-10 w-10 place-items-center rounded-md border transition ${
              isFavorite
                ? "border-persimmon bg-persimmon text-white"
                : "border-ink/15 bg-white text-ink/65 hover:border-persimmon hover:text-persimmon"
            }`}
            title="즐겨찾기"
            aria-label="즐겨찾기"
            disabled={isSaving}
            onClick={() => onToggleFavorite(word)}
          >
            <Bookmark size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            className={`grid h-10 w-10 place-items-center rounded-md border transition ${
              isMemorized
                ? "border-matcha bg-matcha text-white"
                : "border-ink/15 bg-white text-ink/65 hover:border-matcha hover:text-matcha"
            }`}
            title={isMemorized ? "다시 복습" : "암기 완료"}
            aria-label={isMemorized ? "다시 복습" : "암기 완료"}
            disabled={isSaving}
            onClick={() => onToggleMemorized(word)}
          >
            {isMemorized ? <RotateCcw size={18} /> : <Check size={18} />}
          </button>
        </div>
      </div>
    </article>
  );
}
