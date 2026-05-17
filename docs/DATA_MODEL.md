# Data Model

## vocabulary

N3 단어 정규화 데이터다.

현재 데이터:

- 총 `2140`개
- `manual`: 1741
- `auto_exact`: 163
- `auto_token`: 236
- `needs_review`: 0

핵심 컬럼:

- `id`: deterministic uuid
- `word`: 일본어 표기
- `reading`: 읽기
- `meaning_ko`: 한국어 암기용 의미
- `meaning_en`: 원천 영어 의미
- `jlpt_level`: 3
- `priority`: 1~5
- `tags`: 원천 태그와 검수 태그
- `source`: 원천 파일
- `source_order`: CSV 순서
- `translation_status`: `manual`, `auto_exact`, `auto_token`, `needs_review`

현재 `needs_review`는 남아 있지 않다. 이후 새 raw 데이터에서 자동 변환을 다시 수행하면 임시로 생길 수 있다.

## vocabulary_progress

여러 디바이스에서 공유되는 공개 학습 진행 상태다.

핵심 컬럼:

- `vocabulary_id`: vocabulary FK
- `is_memorized`: 암기 완료
- `is_favorite`: 즐겨찾기
- `review_count`: 체크/복습 횟수
- `last_studied_on`: 마지막 학습 날짜
- `updated_at`: 갱신 시각

MVP에서는 사용자별 분리를 하지 않는다. 모든 디바이스가 같은 전역 진행 상태를 본다.

`vocabulary.id`는 deterministic uuid라 seed SQL을 다시 실행해도 기존 `vocabulary_progress` 연결이 유지된다.

## SQL

전체 SQL은 [schema.sql](../supabase/schema.sql)에 있다.
