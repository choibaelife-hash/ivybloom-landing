# IVY BLOOM CONSULTING 랜딩페이지 프로젝트

> 이 파일은 10_Claude브리핑 시트에 IVY BLOOM 실측 정보를 채운 버전입니다.
> "진행 상황 & 다음 세션 체크리스트" 섹션은 작업할 때마다 최신 상태로 업데이트하세요 —
> 다음 세션이 여기만 읽고 바로 이어서 시작할 수 있어야 합니다.

---

## 🔄 진행 상황 & 다음 세션 체크리스트

### 확인/결정 필요 (미완성)
- [ ] **Services FAQ 답변 미작성** — [app/services/page.tsx:8-16](app/services/page.tsx:8) `serviceFaqs`의 `answer` 필드가 전부 빈 문자열. 질문 7개는 있음, 답변 작성 필요.
- [ ] **Formspree 미연결** — [app/contact/page.tsx](app/contact/page.tsx)의 `FORMSPREE_ID`가 `'YOUR_FORMSPREE_ID'` placeholder 상태. 실제 Formspree 폼 ID로 교체해야 문의 폼이 작동함.
- [ ] **structured-data.ts 전화번호 오류** — [lib/structured-data.ts:103](lib/structured-data.ts:103) `telephone: '+15706778811'`은 잘못된 번호. 실제 번호는 `+82-10-7188-8111` (아래 NAP 참고). 수정 필요.
- [ ] **`/blog` vs `/articles` 중복** — 두 라우트가 거의 동일한 코드(각 144줄, 구조 동일). 의도된 중복인지, 하나로 정리해야 하는지 확인 필요.
- [ ] **`lang="ko"` vs 실제 콘텐츠 영어** — [app/layout.tsx:49](app/layout.tsx:49) `<html lang="ko">`인데 사이트 본문은 전부 영어. 한국어 전환 여부 미정 (아래 "한국어 전환 검토" 참고).
- [ ] **GA4 / Search Console 미연동** — 코드베이스에서 확인 안 됨 (CLAUDE.md 코딩 규칙엔 명시돼 있으나 실제 구현 없음).

### 한국어 전환 검토 (보류 중)
- `/services`, `/about` 한국어 번역 비공개 미리보기 아티팩트로 검토 완료 (실제 코드 미반영, 사이트는 여전히 영어).
- 다음에 한국어 전환 얘기가 나오면 이 두 미리보기를 기준으로 시작할 것.

### 최근 완료된 작업 (세션 로그)
- `/services` 02번 에세이 컨설팅: "여러 학교 유연하게" → "타겟 학교 기준 에세이 준비 과정"으로 범위 명확화 ([app/services/page.tsx:55-63](app/services/page.tsx:55))
- `/about`: "Our Mission → What Sets Us Apart" 섹션이 "Why IVY BLOOM" 차별점 4개와 내용이 중복되어 삭제 ([app/about/page.tsx](app/about/page.tsx))
- `/not-found` (404) 페이지 신규 추가, 브랜드 톤 유지 ([app/not-found.tsx](app/not-found.tsx))
- `.claude/launch.json` 추가 — `npm run dev` 프리뷰 실행 설정

> 새 작업을 완료하면 위 "최근 완료된 작업"에 한 줄 추가하고, 오래된 항목은 5개 넘어가면 정리할 것.
> 새로운 미완성/보류 항목이 생기면 "확인/결정 필요" 목록에 추가할 것.

---

## 🏢 기본 정보

- 업체명: IVY BLOOM CONSULTING
- 업종: 미국 대학·보딩스쿨 입시 컨설팅
- 타겟 고객: 미국·캐나다·한국·아시아 거주 한인 학생 (대학 지원 11학년, 보딩스쿨 지원 7~9학년)
- 지역: 서울 기반, 해외 거주 학생 대상 온라인 컨설팅
- NAP: IVY BLOOM CONSULTING / 서울 (상세 주소 미확인) / +82-10-7188-8111
- 카카오 채널: https://pf.kakao.com/_pxeZhs
- 이메일: ivybloom.consulting@gmail.com
- 대표: 김소희 (Sohee Kim) — US College Admissions Consultant, 경력 7년
- 설립: 2019년

---

## 🎨 브랜드

- 메인 컬러 (burgundy): `#7B2D3E`
- 보조 컬러 (rose): `#C9919A`
- 배경 컬러 (cream): `#FAF6F0`
- 텍스트 컬러 (dark): `#3D1A24`
- 보더 컬러: `#E8DDD4`
- 폰트 — 제목: Playfair Display (`next/font/google`, CSS var `--font-playfair`)
- 폰트 — 본문: Pretendard (jsdelivr CDN, [app/layout.tsx:53](app/layout.tsx:53))
- 톤앤매너: premium
- 피해야 할 이미지: 저렴한 느낌, 과한 홍보 문구, 복잡한 레이아웃

---

## 🛎 서비스 요약

- 서비스 1: College Application Consulting / 11학년 / 학교 리스트~최종 제출 전주기 전략
- 서비스 2: Essay Consulting / 11학년 (에세이 전용) / 타겟 학교 기준 에세이 준비 과정 (다수 학교 대상 유연 서비스 아님 — 최근 범위 명확화됨)
- 서비스 3: Boarding School Consulting / 7~9학년 / Exeter·Andover·Choate 등 전 과정 지원 (학생+학부모 에세이 포함)

---

## 🔍 SEO 설정

- 메인 키워드: US college admissions consulting, Korean American college counseling
- 서브 키워드: Common App help, boarding school consulting, college essay writing
- 타겟 지역: USA, Canada, South Korea, Asia (International)
- Schema.org 타입: EducationalOrganization (기관), AboutPage, Service/Course/Article/BlogPosting/FAQPage (콘텐츠 타입별)
- 구글 비즈니스 등록: 미확인
- 구조화 데이터 구현 위치: [lib/structured-data.ts](lib/structured-data.ts)

---

## 🤖 AEO·GEO 설정 (AI 검색 최적화)

- About 페이지 FAQ 6개 (답변 완비) — [components/FAQ.tsx](components/FAQ.tsx) 기본 리스트
- Services 페이지 FAQ 7개 (⚠️ 답변 미작성, 위 체크리스트 참고) — [app/services/page.tsx](app/services/page.tsx)
- llms.txt: 미생성
- Sanity post 스키마에 `excerpt`(AI 인용용), `faqSection` 필드 구현 완료

---

## 🏆 신뢰 요소 (Stats·Testimonials 섹션용)

- 숫자 성과 1: 7년 미국 입시 전문 경력
- 숫자 성과 2: 100+ 학생 최상위권 학교 합격 지도
- 숫자 성과 3: Top-20 (아이비리그 및 최상위권) 결과
- 학생 사례 (About 페이지, 전부 익명):
  - "Against All Odds" — 신경학적 질환 극복, 지원 10개 대학 전원 합격
  - "The Builder" — 로블록스 게임 개발 경험 포지셔닝, UC버클리·조지아텍 합격
  - "A Rocky Record" — 4회 전학(자퇴 1회·퇴학 1회) 극복, 기대 이상 학교 합격

---

## 📣 CTA 설정

- 메인 CTA 버튼 문구: Free Consulting / Free Consultation
- CTA 연결 채널: 카카오 채널 (https://pf.kakao.com/_pxeZhs) 우선, 보조로 이메일·전화·Formspree 폼
- 상담 가능 시간: 미확인

---

## 💻 코딩 규칙

- 스택: Next.js **16.2.9** App Router + Tailwind CSS **3.4** + TypeScript + React **19** + Vercel
  (⚠️ 전역 CLAUDE.md 기본값은 Next.js 14로 되어 있으나 이 프로젝트는 16 사용 중)
- `styled-components` 설치돼 있으나 실제 사용처 미확인 (제거 대상일 수 있음, 판단 보류)
- `use client` 컴포넌트는 필요한 경우만 (Nav, FAQ 등 상태 있는 컴포넌트만 사용 중)
- Tailwind 커스텀 컬러는 `tailwind.config.ts`에 등록된 `brand.*` 토큰 사용
- 반응형: 모바일에서 그리드 1열
- 이미지 없는 경우 플레이스홀더 유지
- 폼: Formspree 연동 (⚠️ ID 미설정 상태, 위 체크리스트 참고)
- 분석: GA4 + Google Search Console (⚠️ 코드베이스에 미구현)

---

## 📄 페이지 구조 (실측)

- `/` (홈): Hero → LogoBanner → WhyUs → ProblemSection → ServicesSection → ArticlesPreview → FAQ → CTASection → Footer
- `/about`: Hero → Why IVY BLOOM (차별점 4개) → Student Stories (학생 사례 3건) → Our Services 요약 → FAQ → CTASection
- `/services`: Hero → How We Work (4단계) → Stats 바 → 서비스 3개 상세 → FAQ (서비스 특화) → Jump 링크
- `/contact`: 좌측 이미지 패널 + Formspree 문의 폼
- `/blog`, `/blog/[slug]`: Sanity CMS 연동 블로그
- `/articles`, `/articles/[slug]`: ⚠️ `/blog`와 코드 거의 동일 (위 체크리스트 참고)
- `/studio/[[...tool]]`: Sanity Studio
- `/not-found`: 404 페이지
- `/design-preview/*`, `/hero-preview`, `/results`: 시안·임시 페이지 (일부 git 미추적)

---

## 언어 규칙

- UI 텍스트 언어: 현재 영어 (실제 사이트 기준). 한국어 전환 검토 중 — 위 "한국어 전환 검토" 참고
- `<html lang>`: `ko`로 설정돼 있으나 콘텐츠와 불일치 (수정 후보)
- 코드 내 주석: 한국어 가능

---

## 📝 블로그 기능 (Sanity CMS 연동)

Sanity 프로젝트: `fxgjdpno` / dataset `production`

### 구현된 파일
- `sanity.cli.ts`, `sanity.config.ts` — Studio 설정 완료
- `sanity/client.ts` — 클라이언트 설정
- `sanity/schemas/post.ts` — 블로그 스키마 (아래 필드 전부 포함)
- `/studio/[[...tool]]` — Studio 연결
- `/blog`, `/blog/[slug]` — 목록/상세 페이지

### 블로그 스키마 필드 (전부 구현 완료)
기본 콘텐츠: `focusKeyphrase`, `title`, `slug`, `publishedAt`, `category`, `author`, `excerpt`, `mainImage`, `body`

SEO: `metaTitle`, `metaDescription`, `ogImage`, `keywords`, `canonical`, `noindex`, `schemaOrgType`

Social: `twitterTitle`, `twitterDescription`

GEO/AEO: `faqSection`

### Studio 커스텀 툴링 (기본 스펙 이상으로 추가 구현됨)
- `WritingGuideInput` — 작성 가이드라인 UI
- `BodyAnalyzerInput` — 본문 분석
- `SoftRequiredInput` — 소프트 필수 필드 UI
- `seoAuditPlugin` — SEO 감사 플러그인

### generateMetadata() 규칙
- Sanity의 metaTitle, metaDescription, ogImage 필드 기반으로 동작
- fallback: metaTitle 없으면 title 사용, ogImage 없으면 mainImage 사용

### 모든 프로젝트 원칙
- SEO/AEO 최적화는 선택이 아니라 기본값
- 별도 언급 없어도 위 필드 전부 포함해서 만들 것

---

## 💰 Sanity 비용 구조 (견적 참고용)

- 블로그 CMS 구축: 30만원 (항상 포함)
- CMS 인수인계 (교육 + 권한 이전): 10~15만원 (클라이언트 직접 운영 시 추가)
- Sanity 무료 플랜: 월 200만 API 요청 — 소상공인 블로그 수준에서 충분
- 고객마다 별도 프로젝트 생성 (나중에 고객 계정으로 이전 가능하게)
