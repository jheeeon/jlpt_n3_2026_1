# Decision Log

## D-001 MVP 범위

- 상태: 확정
- 결정: 단어장 기능까지만 MVP로 구현한다.
- 날짜: 2026-05-17

## D-002 문법 화면

- 상태: 확정
- 결정: 버튼만 만들고 클릭해도 기능 동작은 넣지 않는다.
- 날짜: 2026-05-17

## D-003 fallback

- 상태: 확정
- 결정: fallback 데이터 로딩은 구현하지 않는다.
- 날짜: 2026-05-17

## D-004 진행 상태 공유

- 상태: 확정
- 결정: 공개 Supabase table에 학습 진행 상태를 저장해 여러 디바이스가 같은 상태를 공유한다.
- 날짜: 2026-05-17

## D-005 데이터 생성

- 상태: 확정
- 결정: open-anki N3 CSV를 자동 변환해 JSON과 Supabase seed SQL로 저장한다.
- 날짜: 2026-05-17

## D-006 번역 검수본 적용

- 상태: 확정
- 결정: `vocabulary-n3-gptized.json` 검수본을 정식 `data/normalized/vocabulary.n3.json`으로 교체하고 seed SQL을 재생성한다.
- 날짜: 2026-05-18
- 이유: 기존 `needs_review` 1741개를 모두 한국어 암기용 뜻으로 교체했으며, `id`가 유지되어 기존 진행 상태와 호환된다.

## D-007 seed 재생성 방식

- 상태: 확정
- 결정: 검수 완료 JSON에서는 `npm run generate:seed`로 SQL만 재생성한다.
- 날짜: 2026-05-18
- 이유: `npm run generate:vocabulary`는 raw CSV 자동 변환을 다시 수행해 검수 완료 번역을 덮어쓸 수 있다.
