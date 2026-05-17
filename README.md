# JLPT N3 2026 Study

2026년 7월 5일 JLPT N3 시험 대비용 개인 단어장 웹앱입니다.

MVP 목표는 문법/퀴즈/통계까지 넓히는 것이 아니라, N3 단어를 매일 30개씩 빠르게 반복하고 여러 디바이스에서 같은 학습 진행 상태를 공유하는 것입니다.

## Stack

- React
- TypeScript
- Vite
- TailwindCSS
- Supabase
- GitHub Pages
- GitHub Actions

## MVP Scope

포함:

- Supabase 기반 N3 단어장
- 매일 30개 오늘의 단어 선정
- priority 기반 노출
- 암기 완료, 즐겨찾기 저장
- 여러 디바이스에서 공개 진행 상태 공유
- `open-anki-jlpt-decks/src/n3.csv` 자동 변환 데이터
- Supabase schema SQL
- Supabase seed SQL
- GitHub Pages 자동 배포

제외:

- fallback 데이터 로딩
- 로그인
- 사용자별 분리
- 문법 화면 구현
- SRS
- AI 기능
- 복잡한 통계

문법 학습 버튼은 첫 화면에만 두고 MVP에서는 동작하지 않습니다.

## Supabase Setup

Supabase SQL Editor에서 아래 순서로 실행합니다.

1. `supabase/schema.sql`
2. `supabase/seed.vocabulary.sql`

현재 앱은 fallback을 사용하지 않으므로 Supabase에 seed가 없으면 단어장이 비어 있다고 안내합니다.

공개 정책:

- `vocabulary`: public anon read
- `vocabulary_progress`: public anon read/write

이 앱은 개인용 공개 MVP입니다. 진행 상태는 모든 디바이스가 같은 전역 상태를 공유합니다.

## Data Generation

원천 CSV:

- `data/raw/n3.csv`
- Source: `https://github.com/jamsinclair/open-anki-jlpt-decks`

자동 변환 실행:

```sh
npm run generate:vocabulary
```

생성 결과:

- `data/normalized/vocabulary.n3.json`
- `supabase/seed.vocabulary.sql`

자동 변환은 1차 변환입니다. `translation_status = needs_review` 또는 `tags`에 `needs_review`가 있는 레코드는 한국어 뜻을 수동 검수하는 것이 좋습니다.

검수 완료된 `data/normalized/vocabulary.n3.json`에서 Supabase seed SQL만 다시 만들려면 아래 명령을 사용합니다.

```sh
npm run generate:seed
```

## Local Development

```sh
npm install
npm run dev
```

로컬 환경 변수는 `.env.example`과 같은 형태입니다.

```sh
VITE_SUPABASE_URL=https://gknognjfgrsnwatcofgg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

## Build

```sh
npm run build
npm run preview
```

GitHub Pages 배포를 위해 Vite `base`는 `/jlpt_n3_2026_1/`로 설정되어 있습니다.

## Docs

- [REQUIREMENTS.md](docs/REQUIREMENTS.md)
- [DATA_MODEL.md](docs/DATA_MODEL.md)
- [DATA_PIPELINE.md](docs/DATA_PIPELINE.md)
- [SCREEN_FLOW.md](docs/SCREEN_FLOW.md)
- [DECISIONS.md](docs/DECISIONS.md)
- [QA_TEST_SCENARIOS.md](docs/QA_TEST_SCENARIOS.md)
