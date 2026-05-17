# QA Test Scenarios

## QA-001 Load

- Supabase schema와 seed 실행 후 앱을 연다.
- 오늘의 단어 30개가 표시되어야 한다.
- 단어 카드에 `검수 필요` 표시가 나오지 않아야 한다.

## QA-002 No Fallback

- Supabase table이 없거나 비어 있는 상태에서 앱을 연다.
- 로컬 데이터로 대체하지 않고 SQL 실행 안내를 보여야 한다.

## QA-003 Progress Save

- 단어 하나를 암기 완료 처리한다.
- Supabase `vocabulary_progress`에 row가 생성되어야 한다.

## QA-004 Cross Device

- 한 브라우저에서 즐겨찾기 또는 암기 완료를 바꾼다.
- 다른 브라우저에서 새로고침하면 같은 상태가 보여야 한다.

## QA-005 Grammar Button

- 문법 학습 버튼을 누른다.
- 화면 전환이나 기능 동작이 없어야 한다.

## QA-006 Mobile

- 모바일 viewport에서 단어 30개를 끝까지 스크롤한다.
- 가로 스크롤과 텍스트 겹침이 없어야 한다.

## QA-007 Reviewed Translation Data

- SQL Editor에서 아래 쿼리를 실행한다.

```sql
select translation_status, count(*)
from vocabulary
group by translation_status
order by translation_status;
```

- `needs_review`가 없어야 한다.
- 전체 count 합계가 `2140`이어야 한다.

## QA-008 Seed Re-run Keeps Progress

- `vocabulary_progress`에 암기 완료 또는 즐겨찾기 row가 있는 상태에서 최신 `supabase/seed.vocabulary.sql`을 다시 실행한다.
- 같은 단어의 진행 상태가 유지되어야 한다.
