import { useEffect, useMemo, useState } from "react";
import { BookOpen, Loader2, RefreshCw, ScrollText } from "lucide-react";
import { VocabularyCard } from "./components/VocabularyCard";
import { getDaysUntilExam, getExamDate, getTodayKey } from "./lib/date";
import { DAILY_WORD_COUNT, selectDailyVocabulary } from "./lib/dailyVocabulary";
import {
  fetchVocabulary,
  fetchVocabularyProgress,
  saveVocabularyProgress,
} from "./lib/vocabularyApi";
import type { Vocabulary, VocabularyProgress } from "./types/vocabulary";

type LoadState = "idle" | "loading" | "ready" | "error";

function progressMap(progress: VocabularyProgress[]) {
  return new Map(progress.map((item) => [item.vocabularyId, item]));
}

function emptyProgress(vocabularyId: string): VocabularyProgress {
  return {
    vocabularyId,
    isMemorized: false,
    isFavorite: false,
    reviewCount: 0,
    lastStudiedOn: null,
  };
}

export default function App() {
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [words, setWords] = useState<Vocabulary[]>([]);
  const [progress, setProgress] = useState<VocabularyProgress[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<string>("");

  const todayKey = getTodayKey();
  const daysUntilExam = getDaysUntilExam();
  const progressById = useMemo(() => progressMap(progress), [progress]);
  const dailyWords = useMemo(
    () => selectDailyVocabulary(words, progressById, todayKey),
    [progressById, todayKey, words],
  );
  const memorizedCount = progress.filter((item) => item.isMemorized).length;
  const favoriteCount = progress.filter((item) => item.isFavorite).length;

  async function loadData() {
    setLoadState("loading");
    setErrorMessage("");
    try {
      const [vocabularyRows, progressRows] = await Promise.all([
        fetchVocabulary(),
        fetchVocabularyProgress(),
      ]);
      setWords(vocabularyRows);
      setProgress(progressRows);
      setLoadState("ready");
    } catch (error) {
      setLoadState("error");
      setErrorMessage(error instanceof Error ? error.message : "Supabase 데이터를 불러오지 못했습니다.");
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function updateProgress(
    word: Vocabulary,
    makeNext: (current: VocabularyProgress) => VocabularyProgress,
  ) {
    const current = progressById.get(word.id) ?? emptyProgress(word.id);
    const next = makeNext(current);
    setNotice("");
    setProgress((items) => {
      const withoutCurrent = items.filter((item) => item.vocabularyId !== word.id);
      return withoutCurrent.concat(next);
    });
    setSavingIds((ids) => new Set(ids).add(word.id));

    try {
      const saved = await saveVocabularyProgress(next);
      setProgress((items) => {
        const withoutCurrent = items.filter((item) => item.vocabularyId !== word.id);
        return withoutCurrent.concat(saved);
      });
      setNotice("진행 상태가 Supabase에 저장되었습니다.");
    } catch (error) {
      setProgress((items) => {
        const withoutCurrent = items.filter((item) => item.vocabularyId !== word.id);
        return current.vocabularyId ? withoutCurrent.concat(current) : withoutCurrent;
      });
      setNotice(error instanceof Error ? error.message : "저장에 실패했습니다.");
    } finally {
      setSavingIds((ids) => {
        const nextIds = new Set(ids);
        nextIds.delete(word.id);
        return nextIds;
      });
    }
  }

  function handleToggleMemorized(word: Vocabulary) {
    void updateProgress(word, (current) => ({
      ...current,
      isMemorized: !current.isMemorized,
      reviewCount: current.reviewCount + 1,
      lastStudiedOn: todayKey,
    }));
  }

  function handleToggleFavorite(word: Vocabulary) {
    void updateProgress(word, (current) => ({
      ...current,
      isFavorite: !current.isFavorite,
      lastStudiedOn: todayKey,
    }));
  }

  const isLoading = loadState === "loading" || loadState === "idle";

  return (
    <main className="min-h-screen text-ink">
      <section className="mx-auto flex w-full max-w-3xl flex-col px-4 py-5 sm:px-6 sm:py-8">
        <header className="pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-persimmon">JLPT N3 · {getExamDate()}</p>
              <h1 className="mt-1 text-3xl font-bold tracking-normal text-ink sm:text-4xl">
                오늘의 N3 단어장
              </h1>
            </div>
            <button
              type="button"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-ink/15 bg-white/70 text-ink/70 transition hover:border-matcha hover:text-matcha"
              title="새로고침"
              aria-label="새로고침"
              onClick={() => void loadData()}
            >
              <RefreshCw size={19} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="rounded-md border border-ink/10 bg-white/60 p-3">
              <p className="text-xs text-ink/55">시험까지</p>
              <p className="mt-1 text-lg font-bold">{daysUntilExam >= 0 ? `${daysUntilExam}일` : "시험일 지남"}</p>
            </div>
            <div className="rounded-md border border-ink/10 bg-white/60 p-3">
              <p className="text-xs text-ink/55">암기 완료</p>
              <p className="mt-1 text-lg font-bold">{memorizedCount}</p>
            </div>
            <div className="rounded-md border border-ink/10 bg-white/60 p-3">
              <p className="text-xs text-ink/55">즐겨찾기</p>
              <p className="mt-1 text-lg font-bold">{favoriteCount}</p>
            </div>
          </div>

          <nav className="mt-5 grid grid-cols-2 gap-2" aria-label="main menu">
            <button
              type="button"
              className="flex min-h-14 items-center justify-center gap-2 rounded-md bg-ink px-3 py-3 text-sm font-semibold text-white"
            >
              <BookOpen size={18} />
              오늘의 단어
            </button>
            <button
              type="button"
              className="flex min-h-14 cursor-not-allowed items-center justify-center gap-2 rounded-md border border-ink/15 bg-white/45 px-3 py-3 text-sm font-semibold text-ink/40"
              aria-disabled="true"
              title="문법 학습은 MVP 이후 구현"
              onClick={(event) => event.preventDefault()}
            >
              <ScrollText size={18} />
              문법 학습
            </button>
          </nav>
        </header>

        {notice ? (
          <p className="mb-3 rounded-md border border-matcha/20 bg-matcha/10 px-3 py-2 text-sm text-ink/75">
            {notice}
          </p>
        ) : null}

        {isLoading ? (
          <section className="grid min-h-80 place-items-center rounded-md border border-ink/10 bg-white/55">
            <div className="flex items-center gap-3 text-ink/65">
              <Loader2 size={20} className="animate-spin" />
              Supabase에서 단어장을 불러오는 중
            </div>
          </section>
        ) : null}

        {loadState === "error" ? (
          <section className="rounded-md border border-persimmon/30 bg-white/65 p-5">
            <h2 className="text-xl font-bold">단어장을 불러오지 못했습니다</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">{errorMessage}</p>
            <p className="mt-4 text-sm leading-6 text-ink/70">
              Supabase SQL Editor에서 `supabase/schema.sql`을 먼저 실행하고,
              이어서 `supabase/seed.vocabulary.sql`을 실행해 주세요.
            </p>
          </section>
        ) : null}

        {loadState === "ready" && words.length === 0 ? (
          <section className="rounded-md border border-persimmon/30 bg-white/65 p-5">
            <h2 className="text-xl font-bold">아직 단어 데이터가 없습니다</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              Supabase에 seed data를 넣으면 오늘의 단어 {DAILY_WORD_COUNT}개가 표시됩니다.
            </p>
          </section>
        ) : null}

        {loadState === "ready" && dailyWords.length > 0 ? (
          <section className="overflow-hidden rounded-md border border-ink/10 bg-white/35">
            <div className="border-b border-ink/10 bg-white/65 px-4 py-3 sm:px-5">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-persimmon">{todayKey}</p>
                  <h2 className="mt-1 text-xl font-bold">오늘의 단어 {dailyWords.length}개</h2>
                </div>
                <p className="text-right text-xs leading-5 text-ink/55">
                  priority 기반
                  <br />
                  공개 진행 상태 공유
                </p>
              </div>
            </div>

            <div>
              {dailyWords.map((word) => (
                <VocabularyCard
                  key={word.id}
                  word={word}
                  progress={progressById.get(word.id)}
                  isSaving={savingIds.has(word.id)}
                  onToggleMemorized={handleToggleMemorized}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
