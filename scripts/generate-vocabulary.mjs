import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const rawPath = path.join(rootDir, "data/raw/n3.csv");
const normalizedPath = path.join(rootDir, "data/normalized/vocabulary.n3.json");
const seedPath = path.join(rootDir, "supabase/seed.vocabulary.sql");

const exactMeaningMap = new Map(
  Object.entries({
    "manners, etiquette, propriety": "예절, 작법",
    "varied, various": "다양한",
    "to cool, to let cool": "식히다",
    "to awaken": "깨우다, 깨다",
    "to leave, to go away": "떠나다",
    "uproar, disturbance": "소동, 소란",
    "happiness, blessing": "행복",
    "jeans": "청바지",
    "jet plane": "제트기",
    "square": "사각형",
    "immediately, readily, directly": "직접, 곧바로",
    "moreover, furthermore, besides, plus": "게다가",
    "four seasons": "사계절",
    "immediately, soon, shortly": "곧, 머지않아",
    "time, season, period": "시기",
    "payment, allowance": "지급",
    "urgent, pressing": "급한, 긴급한",
    "to abide (by the rules), to obey": "따르다, 지키다",
    "therefore, consequently": "따라서",
    "intimate, close (e.g., friend)": "친한, 가까운",
    "quality, nature (of person)": "질, 성질",
    "unemployment": "실업",
    "moisture, humidity, dampness": "습기",
    "lab work; experiment": "실험",
    "implementation, materialization, realization": "실현",
    "practice, execution (e.g., program), realization": "실행",
    "in fact; in actuality": "실제로",
    "enforcement, carry out, operation": "실시",
    "humidity": "습도",
    "patiently, quietly": "가만히, 꾹",
    "indeed, truly, surely": "참으로, 정말",
    "actually; in fact": "사실은",
    "leadership, guidance, coaching": "지도",
    "automatic, self-motion": "자동",
    "children, juvenile": "아동",
    "thing, article, goods": "물건, 상품",
    "rule, control, direction": "지배, 통제",
    "play, drama": "연극",
    "often, again and again, frequently": "자주",
    "lawn": "잔디밭",
    "payment": "지불",
    "to pay": "지불하다",
    "pride, boast": "자랑",
    "quiet, plain, conservative": "수수한, 차분한",
    "to show, to indicate": "보이다, 나타내다",
    "to take up; to account for": "차지하다",
    "to be wet, to be damp": "축축해지다",
    "under, below, beneath": "아래",
    "frost": "서리",
    "debt, loan, liabilities": "빚, 부채",
    "to talk, to chat, to chatter (same as 話す (はなす))": "말하다, 수다 떨다",
    "week": "주",
    "state, province": "주, 주(州)",
    "gun": "총",
    "surroundings, circumference, environs": "주위",
    "harvest, crop, ingathering": "수확",
    "religion": "종교",
    "importance, stress": "중시",
    "finding employment": "취직",
    "juice, soft drink; deuce": "주스",
    "amendment, correction": "수정",
    "seriously ill, critical state": "중태",
    "congestion (e.g., traffic), delay": "정체, 지연",
    "serious, important": "중대한",
    "resident, housing": "주택",
    "group, mass": "집단",
    "concentration, focusing the mind": "집중",
    "demand": "수요",
    "variety, kind": "종류",
    "order, turn": "순서, 차례",
    "moment, second": "순간",
    "doing well": "순조로운",
    "turn (in line), order of things": "순번, 차례",
    "use (same as 使うこと (つかうこと)), application, employment, utilization": "사용",
    "small": "작은",
    "chapter, section; medal": "장, 훈장",
    "prize, award": "상, 상금",
    "obstacle, impediment": "장애",
    "scholarship": "장학금",
    "passenger": "승객",
    "state of affairs, situation": "상황",
    "conditions, terms": "조건",
    "noon, mid-day": "정오",
    "honesty, integrity, frankness": "정직",
    "common sense": "상식",
    "young girl": "소녀",
    "a little; short (time) (formal for 少し (すこし))": "조금, 잠시",
    "symptoms, condition": "증상",
    "to occur, to arise, to be generated": "생기다, 발생하다",
    "condition, situation": "상태",
    "improvement, advance": "향상, 진보",
    "a joke": "농담",
    "first class, very good": "고급의, 훌륭한",
    "collision, conflict": "충돌",
    "trader, shopkeeper, merchant": "상인",
    "recognition, approval": "승인",
    "boys, juveniles": "소년",
    "trade, business, commerce": "장사, 사업",
    "consumption, expenditure": "소비",
    "commodity, merchandise": "상품",
    "prize, trophy": "상품, 경품",
    "fire fighting, fire department": "소방",
    "information, (military) intelligence": "정보",
    "proof, verification": "증명",
    "omission, abbreviation, abridgment": "생략",
    "queen": "여왕",
    "employment": "직업, 직",
    "occupation, business": "직업",
    "dining table": "식탁",
    "foodstuff": "식품",
    "food": "식량, 음식",
    "provisions, rations": "식량",
    "study, den": "서재",
    "woman, girl": "여자",
    "helper, assistant": "조수, 보조자",
    "slowly, little by little": "서서히",
    "signature": "서명",
    "books": "서적",
    "actress": "여배우",
    "processing, treatment, disposition": "처리",
    "documents, official papers": "서류",
    "notice": "알림, 소식",
    "buttocks, bottom": "엉덩이",
    "acquaintance": "아는 사람",
    "mark; symbol; evidence": "표시, 증거",
    "castle": "성",
    "going on to university": "진학",
    "nerve, sensitivity": "신경",
    "seriousness, earnestness": "진지함",
    "(religious) faith, belief": "신앙",
    "traffic lights, signal, semaphore": "신호",
    "artificial, man made, human work,": "인공",
    "serious": "심각한",
    "medical examination (of a patient)": "진찰",
    "race (of people)": "인종",
    "to believe": "믿다",
    "(human) life (e.g., conception to death)": "인생",
    "relative(s)": "친척",
    "fresh": "신선한",
    "heart": "심장",
    "the body": "신체",
    "careful, prudent, cautious": "신중한",
    "umpire, referee, judgment": "심판",
    "character, personality, talented man": "인물",
    "improvement, progress, development": "진보, 발전",
    "close friend, buddy": "친한 친구",
    "confidence, dependence": "신용",
    "reliance, trust, confidence": "신뢰",
    "mentality": "심리",
    "mankind, humanity": "인류",
    "nest, breeding place": "둥지",
    "vinegar": "식초",
    "figure, drawing, illustration": "그림, 도표",
    "level, standard": "수준",
    "recommendation": "추천",
    "switch": "스위치",
    "sleep": "수면",
    "number, figure": "수, 숫자",
    "rule": "규칙",
    "frame, slide": "틀, 테두리",
    "display, indication": "표시",
  }),
);

const tokenMap = new Map(
  Object.entries({
    ability: "능력",
    able: "가능한",
    absence: "부재",
    accident: "사고",
    account: "설명",
    action: "행동",
    addition: "추가",
    address: "주소",
    adult: "어른",
    advantage: "이점",
    advice: "조언",
    age: "나이",
    air: "공기",
    amount: "양",
    answer: "답",
    anxiety: "불안",
    appearance: "외모",
    application: "신청, 응용",
    appointment: "약속",
    area: "지역",
    argument: "논쟁",
    arm: "팔",
    article: "물건, 기사",
    attitude: "태도",
    back: "뒤, 등",
    balance: "균형",
    battle: "전투",
    behavior: "행동",
    belief: "믿음",
    birth: "출생",
    blood: "피",
    board: "판",
    body: "몸",
    book: "책",
    business: "사업",
    care: "주의, 돌봄",
    cause: "원인",
    chance: "기회",
    change: "변화",
    character: "성격, 인물",
    child: "아이",
    choice: "선택",
    city: "도시",
    class: "수업, 등급",
    clothes: "옷",
    college: "대학",
    color: "색",
    company: "회사",
    condition: "상태",
    connection: "연결",
    contact: "연락",
    control: "통제",
    conversation: "대화",
    course: "과정",
    custom: "관습",
    damage: "피해",
    danger: "위험",
    date: "날짜",
    death: "죽음",
    decision: "결정",
    degree: "정도",
    difference: "차이",
    direction: "방향",
    disease: "병",
    distance: "거리",
    effect: "효과",
    effort: "노력",
    emotion: "감정",
    end: "끝",
    enemy: "적",
    energy: "에너지",
    example: "예",
    experience: "경험",
    explanation: "설명",
    expression: "표현",
    fact: "사실",
    failure: "실패",
    family: "가족",
    feeling: "기분, 감정",
    fire: "불",
    form: "형태",
    friend: "친구",
    future: "미래",
    habit: "습관",
    hand: "손",
    health: "건강",
    heart: "마음, 심장",
    help: "도움",
    history: "역사",
    idea: "생각",
    importance: "중요성",
    increase: "증가",
    information: "정보",
    interest: "관심",
    job: "일, 직업",
    knowledge: "지식",
    law: "법",
    life: "생활, 인생",
    light: "빛",
    limit: "한계",
    line: "선, 줄",
    meaning: "의미",
    mind: "마음",
    mistake: "실수",
    money: "돈",
    nature: "자연, 성질",
    news: "소식",
    number: "수",
    object: "물건",
    order: "순서",
    pain: "통증",
    part: "부분",
    person: "사람",
    place: "장소",
    plan: "계획",
    point: "점, 요점",
    power: "힘",
    price: "가격",
    problem: "문제",
    product: "제품",
    progress: "진전",
    purpose: "목적",
    reason: "이유",
    relation: "관계",
    request: "요청",
    result: "결과",
    road: "길",
    room: "방",
    rule: "규칙",
    school: "학교",
    season: "계절",
    secret: "비밀",
    shape: "모양",
    side: "쪽, 옆",
    sign: "표시",
    society: "사회",
    sound: "소리",
    speed: "속도",
    state: "상태",
    story: "이야기",
    strength: "힘",
    success: "성공",
    thing: "것, 물건",
    time: "시간, 때",
    trouble: "문제",
    use: "사용",
    value: "가치",
    view: "견해",
    voice: "목소리",
    way: "방법",
    work: "일",
    world: "세계",
    young: "어린, 젊은",
  }),
);

const importantEnglishHints = [
  "to ",
  "condition",
  "situation",
  "information",
  "reason",
  "result",
  "important",
  "change",
  "increase",
  "decrease",
  "decide",
  "feel",
  "think",
  "show",
  "use",
  "make",
  "become",
  "appear",
  "happen",
  "necessary",
  "possible",
  "experience",
  "relation",
  "society",
  "work",
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field);
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function deterministicUuid(input) {
  const hash = crypto.createHash("sha1").update(input).digest("hex");
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    `5${hash.slice(13, 16)}`,
    ((parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80).toString(16) + hash.slice(18, 20),
    hash.slice(20, 32),
  ].join("-");
}

function cleanMeaning(meaning) {
  return meaning
    .replace(/\([^)]*\)/g, "")
    .replace(/\bsame as\b.*$/i, "")
    .replace(/\s+/g, " ")
    .replace(/\s*;\s*/g, ", ")
    .trim();
}

function translateMeaning(meaning) {
  const exact = exactMeaningMap.get(meaning.trim());
  if (exact) {
    return { meaningKo: exact, status: "auto_exact" };
  }

  const cleaned = cleanMeaning(meaning);
  const primary = cleaned.split(",")[0].trim().toLowerCase();
  const noTo = primary.replace(/^to\s+/, "");
  const token = noTo.split(/\s+/).find((part) => tokenMap.has(part.replace(/[^a-z]/g, "")));

  if (token) {
    const mapped = tokenMap.get(token.replace(/[^a-z]/g, ""));
    const suffix = primary.startsWith("to ") && !mapped.endsWith("하다") ? "하다" : "";
    return { meaningKo: `${mapped}${suffix}`, status: "auto_token" };
  }

  return {
    meaningKo: `검수 필요: ${cleaned.split(",").slice(0, 2).join(", ")}`,
    status: "needs_review",
  };
}

function estimatePriority(record) {
  let score = 3;
  const meaning = record.meaning.toLowerCase();
  const tags = record.tags.toLowerCase();

  if (importantEnglishHints.some((hint) => meaning.includes(hint))) score += 1;
  if (tags.includes("genki") || tags.includes("intermediate_japanese")) score += 1;
  if (meaning.includes("archaic") || meaning.includes("rare")) score -= 1;
  if (meaning.length > 80) score -= 1;

  return Math.min(5, Math.max(1, score));
}

function toSqlString(value) {
  if (value === undefined || value === null || value === "") return "null";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function toSqlTextArray(values) {
  if (!values.length) return "'{}'";
  return `array[${values.map(toSqlString).join(", ")}]`;
}

const text = fs.readFileSync(rawPath, "utf8");
const [header, ...rows] = parseCsv(text);
const columns = Object.fromEntries(header.map((name, index) => [name, index]));

const vocabulary = rows
  .filter((row) => row.length >= header.length)
  .map((row, index) => {
    const word = row[columns.expression].trim();
    const reading = row[columns.reading].trim();
    const meaningEn = row[columns.meaning].trim();
    const tags = row[columns.tags]
      .split(/\s+/)
      .map((tag) => tag.trim())
      .filter(Boolean);
    const translation = translateMeaning(meaningEn);

    return {
      id: deterministicUuid(`${word}|${reading}|N3`),
      word,
      reading,
      meaningKo: translation.meaningKo,
      meaningEn,
      jlptLevel: 3,
      priority: estimatePriority({ meaning: meaningEn, tags: row[columns.tags] }),
      tags: [...new Set(tags.concat(translation.status === "needs_review" ? ["needs_review"] : []))],
      source: "open-anki-jlpt-decks/src/n3.csv",
      sourceOrder: index + 1,
      translationStatus: translation.status,
    };
  });

fs.mkdirSync(path.dirname(normalizedPath), { recursive: true });
fs.writeFileSync(normalizedPath, `${JSON.stringify(vocabulary, null, 2)}\n`);

const values = vocabulary
  .map((item) => {
    return `(${[
      toSqlString(item.id),
      toSqlString(item.word),
      toSqlString(item.reading),
      toSqlString(item.meaningKo),
      toSqlString(item.meaningEn),
      item.jlptLevel,
      item.priority,
      toSqlTextArray(item.tags),
      toSqlString(item.source),
      item.sourceOrder,
      toSqlString(item.translationStatus),
    ].join(", ")})`;
  })
  .join(",\n");

const sql = `-- Generated by scripts/generate-vocabulary.mjs.
-- Source: https://github.com/jamsinclair/open-anki-jlpt-decks/blob/main/src/n3.csv

insert into vocabulary (
  id,
  word,
  reading,
  meaning_ko,
  meaning_en,
  jlpt_level,
  priority,
  tags,
  source,
  source_order,
  translation_status
) values
${values}
on conflict (word, reading) do update set
  meaning_ko = excluded.meaning_ko,
  meaning_en = excluded.meaning_en,
  priority = excluded.priority,
  tags = excluded.tags,
  source = excluded.source,
  source_order = excluded.source_order,
  translation_status = excluded.translation_status,
  updated_at = now();
`;

fs.mkdirSync(path.dirname(seedPath), { recursive: true });
fs.writeFileSync(seedPath, sql);

const reviewCount = vocabulary.filter((item) => item.translationStatus === "needs_review").length;
console.log(`Generated ${vocabulary.length} vocabulary rows.`);
console.log(`Needs review: ${reviewCount}`);
