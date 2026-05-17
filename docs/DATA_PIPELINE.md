# Data Pipeline

## Source

- Repository: `https://github.com/jamsinclair/open-anki-jlpt-decks`
- File: `src/n3.csv`
- Local copy: `data/raw/n3.csv`

## Generate

```sh
npm run generate:vocabulary
```

Outputs:

- `data/normalized/vocabulary.n3.json`
- `supabase/seed.vocabulary.sql`

## Translation Strategy

자동 변환은 아래 순서로 처리한다.

1. exact meaning map
2. token 기반 짧은 한국어 의미 변환
3. 변환 실패 시 `검수 필요: ...`로 표시하고 `needs_review` 태그 부여

완벽 번역이 아니라 Supabase에 넣고 앱에서 바로 확인 가능한 1차 데이터 생성을 목표로 한다.

## Priority

priority는 1~5다.

- 5: 시험과 독해에 특히 중요한 단어
- 4: 자주 보이는 핵심 단어
- 3: 일반 N3 단어
- 2: 상대적으로 낮은 우선순위
- 1: MVP 반복 우선순위 낮음

현재 생성기는 영어 meaning과 source tags를 바탕으로 heuristic priority를 부여한다.

## Reviewed Translation Seed

검수 완료된 `data/normalized/vocabulary.n3.json`에서 Supabase seed SQL만 다시 생성할 때는 아래 명령을 사용한다.

```sh
npm run generate:seed
```

이 명령은 raw CSV 자동 변환을 다시 수행하지 않고, 현재 normalized JSON을 그대로 SQL로 변환한다.
