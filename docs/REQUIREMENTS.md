# Requirements v1

## 목표

2026년 7월 5일 JLPT N3 시험 전까지 매일 열어보는 개인 단어장 웹앱을 만든다.

MVP의 핵심은 단어장이다. 문법 화면은 아직 미정이므로 버튼만 만들고 동작은 넣지 않는다.

## 포함 범위

- React + TypeScript + Vite + TailwindCSS
- GitHub Pages 배포
- Supabase 공개 데이터 사용
- N3 vocabulary 전체 seed 데이터
- 영어 meaning에서 한국어 meaning으로 자동 변환한 JSON
- Supabase에 직접 실행 가능한 seed SQL
- 오늘의 단어 30개
- priority 기반 단어 선정
- 암기 완료 상태
- 즐겨찾기 상태
- 여러 디바이스에서 같은 진행 상태 공유

## 제외 범위

- fallback 데이터
- 로그인
- 사용자별 분리
- 문법 학습 화면
- 커뮤니티
- AI 기능
- 실시간 구독
- 복잡한 SRS
- 장기 통계

## 완료 기준

- Supabase schema와 seed SQL을 실행할 수 있다.
- 앱이 Supabase에서 단어 데이터를 불러온다.
- 오늘의 단어 30개가 표시된다.
- 카드에는 `word`, `reading`, `meaningKo`가 표시된다.
- 암기 완료와 즐겨찾기가 Supabase에 저장된다.
- 다른 디바이스에서 같은 진행 상태를 볼 수 있다.
- 문법 학습 버튼은 보이지만 화면 전환이나 기능은 없다.
