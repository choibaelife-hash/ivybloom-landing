# [업체명] 랜딩페이지 프로젝트

> 이 파일은 10_Claude브리핑 시트를 그대로 옮긴 것입니다.
> 의뢰마다 [ ] 안의 내용을 교체하세요.

---

## 🏢 기본 정보

- 업체명: [업체명]
- 업종: [예: 온라인 입시학원 / 세무사 / 피부과]
- 타겟 고객: [예: 해외거주 5~12학년 한국 학생 학부모]
- 지역: [예: 미국·캐나다 거주 한인]
- NAP: [업체명] / [주소] / [전화번호]
- 카카오 채널: [URL]
- 이메일: [이메일]

---

## 🎨 브랜드

- 메인 컬러: [#000000]
- 보조 컬러: [#000000]
- 폰트 — 제목: [예: Playfair Display / Noto Serif KR]
- 폰트 — 본문: [예: Montserrat / Pretendard]
- 톤앤매너: [premium / friendly / professional / warm 중 선택]
- 피해야 할 이미지: [예: 저렴한 느낌, 과한 홍보, 복잡한 디자인]

---

## 🛎 서비스 요약

- 서비스 1: [이름] / [대상 학년] / [핵심 결과]
- 서비스 2: [이름] / [대상 학년] / [핵심 결과]
- 서비스 3: [이름] / [대상 학년] / [핵심 결과]
- 추가 서비스: [있으면 기재]

---

## 🔍 SEO 설정

- 메인 키워드: [예: online SAT prep Korean students]
- 서브 키워드: [예: AMC math, AP tutoring, English essay contest]
- 타겟 지역: [예: USA, Canada, Vietnam]
- Schema.org 타입: [예: EducationalOrganization]
- 구글 비즈니스 등록: [Y / N]

---

## 🤖 AEO·GEO 설정 (AI 검색 최적화)

- FAQ 1 (What): [이 업체/서비스가 무엇인지]
- FAQ 2 (How): [수업·서비스가 어떻게 진행되는지]
- FAQ 3 (Why): [왜 선택해야 하는지]
- FAQ 4 (비용): [비용 관련 질문]
- FAQ 5 (차별점): [경쟁사 대비 무엇이 다른지]
- llms.txt 한 줄 설명: [AI가 이 업체를 추천할 때 쓸 한 문장]

---

## 🏆 신뢰 요소 (Stats·Testimonials 섹션용)

- 숫자 성과 1: [예: SAT 1300→1500점 (4~6주)]
- 숫자 성과 2: [예: AP 5점 만점 매년 배출]
- 숫자 성과 3: [예: 영어 에세이 대회 수상 매년]
- 대표 수상 실적: [예: John Locke Award 2023·2024]
- 장기 고객 특징: [예: 평균 수강 기간 2년 이상]

---

## 📣 CTA 설정

- 메인 CTA 버튼 문구: [예: 무료 상담 신청 / Book a Free Consultation]
- CTA 연결 채널: [카카오 / 전화 / 폼 중 선택]
- 상담 가능 시간: [예: 평일 10시~18시 KST]

---

## 💻 코딩 규칙

- 스택: Next.js App Router + Tailwind CSS + Vercel
- `use client` 컴포넌트는 필요한 경우만
- Tailwind 커스텀 컬러는 tailwind.config.ts에 등록된 토큰 사용
- 반응형: 모바일에서 그리드 1열
- 이미지 없는 경우 플레이스홀더 유지
- 폼: Formspree 연동
- 분석: GA4 + Google Search Console

---

## 📄 페이지 구조

- / (홈): Hero → Stats → ProblemSection → ServicesSection → WhyUs → Testimonials → FAQ → CTA
- /contact: 문의 폼 (Formspree 연동)

---

## 언어 규칙

- UI 텍스트 언어: [한국어 / 영어 중 선택]
- 코드 내 주석: 한국어 가능

---

## 📝 블로그 기능 (Sanity CMS 연동 시 필수)

블로그 기능이 필요한 프로젝트에 적용. 콘텐츠 대행 여부와 무관하게 항상 Sanity로 구축.

### Sanity 초기 세팅 시 반드시 포함할 파일
- `sanity.cli.ts` — projectId, dataset 명시 (빠지면 npx sanity dev 실행 불가)
- `sanity.config.ts` — Studio 설정
- `lib/sanity.ts` — 클라이언트 설정 (Viewer 토큰 사용)
- `schemas/post.ts` — 블로그 스키마 (아래 필드 전부 포함)
- `/studio` 경로 — Studio 연결
- `/blog` — 목록 페이지
- `/blog/[slug]` — 상세 페이지

### 블로그 스키마 필수 필드
기본 콘텐츠:
- `title` — 글 제목
- `slug` — URL 주소 (title 기반 자동 생성)
- `publishedAt` — 발행일
- `body` — 본문 (Portable Text 리치 텍스트)
- `mainImage` — 대표 이미지

SEO 필드 (반드시 포함):
- `metaTitle` — 구글 검색결과 제목 (title과 별도)
- `metaDescription` — 검색결과 설명 120~160자
- `ogImage` — SNS 공유 이미지
- `keywords` — 타겟 키워드

GEO/AEO 필드 (반드시 포함):
- `excerpt` — 글 요약 (AI 검색 인용용)
- `faqSection` — FAQ 항목 배열

### generateMetadata() 규칙
- 반드시 Sanity의 metaTitle, metaDescription, ogImage 필드 기반으로 동작
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
