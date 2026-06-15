# IVY BLOOM CONSULTING — Landing Page Design Spec

Date: 2026-06-14

---

## 1. Project Overview

미국 입시 컨설팅 업체 IVY BLOOM CONSULTING의 SEO/AEO 최적화 랜딩페이지.
대행사가 Sanity CMS로 블로그(Articles)를 직접 관리하며 운영.

---

## 2. Client Info

| 항목 | 내용 |
|------|------|
| 업체명 | IVY BLOOM CONSULTING |
| 슬로건 | Cultivate Your Abilities |
| 서비스 | 미국 대학 입시 컨설팅, 보딩스쿨 컨설팅, 에세이 코칭 |
| 타겟 | 미국 거주 재미교포 학생·학부모 |
| CTA 채널 | 카카오 채널 (YB/BLOOM) |
| 연락처 | 570-6778-811 (카카오 링크로 대체) |

---

## 3. Tech Stack

| 항목 | 선택 |
|------|------|
| 프레임워크 | Next.js App Router |
| 스타일 | Tailwind CSS |
| 배포 | Vercel |
| CMS | Sanity (블로그 Articles 관리) |
| 이미지 | Unsplash 스톡 → 클라이언트 사진으로 교체 예정 |
| 폼 | 없음 (CTA는 카카오 채널 링크) |
| 분석 | GA4 + Google Search Console |

---

## 4. Design System

### 컬러

| 역할 | 토큰 | 값 |
|------|------|----|
| Primary | `brand-burgundy` | `#7B2D3E` |
| Point | `brand-rose` | `#C9919A` |
| Background | `brand-cream` | `#FAF6F0` |
| Dark text | `brand-dark` | `#3D1A24` |
| Border / sub | `brand-border` | `#E8DDD4` |

### 폰트
- 제목: Playfair Display (serif, 고급스러운 학술 느낌)
- 본문: Pretendard (한·영 혼용 지원, 가독성 우선)

### 톤앤매너
- Warm Academic — 크림 베이지 배경, 버건디 메인, 더스티로즈 포인트
- 기존 IVY BLOOM 브랜드 이미지 계승

---

## 5. Page Structure

```
/                     홈 (싱글페이지)
/articles             아티클 목록 (Sanity)
/articles/[slug]      아티클 상세 (Sanity)
/studio               Sanity Studio (관리자 전용)
```

> `/contact` 페이지 없음 — CTA가 카카오 채널 링크이므로 별도 문의 폼 페이지 불필요.

---

## 6. Home Page Sections

### 6-1. Nav
- 로고 (IVY BLOOM) 좌측
- 링크: Services / Articles / 카카오 상담 버튼 우측

### 6-2. Hero
- 배경: 클라이언트 사진 (임시: Unsplash 대학 캠퍼스)
- 버건디 오버레이로 브랜드 컬러 유지
- 헤드라인: "Your Path to Top US Universities"
- 서브: "Korean-American students guided by experts"
- CTA 버튼: "📱 카카오톡 무료 상담" → 카카오 채널 링크

### 6-3. Stats
- 배경: 크림 `#FAF6F0`
- 숫자 3개 (TBD 플레이스홀더 `—`로 시작)
- 항목: Students Placed / Top 20 Admits / Years of Experience

### 6-4. ProblemSection
- Pain point 3가지 (버건디 좌측 보더 카드)
- 예: "GPA alone won't get you into a top school"

### 6-5. ServicesSection
- 카드 3개: College Admissions / Boarding School / Essay Coaching
- 각 카드: 아이콘 + 타이틀 + 한 줄 설명

### 6-6. WhyUs
- 컨설턴트 사진 영역 (좌측) + 차별점 4가지 (우측)
- 차별점: Personalized Strategy / Korean-American Focused / End-to-End Support / Proven Results

### 6-7. Testimonials
- 후기 2개 (TBD 플레이스홀더)
- 버건디 좌측 보더 카드 스타일

### 6-8. BlogPreview (컴포넌트명)
- Sanity에서 최신 3개 아티클 fetch
- **3열 카드 그리드** (모바일 1열 → 데스크탑 3열)
- 섹션 타이틀: "ARTICLES"
- "View all →" 링크 → `/articles`
- 카드 구성: 카테고리 태그 + 제목 + 날짜

### 6-9. FAQ
- 아코디언 형태, 질문 4~5개
- **FAQPage Schema.org** 적용 → AI 검색 스니펫 노출
- 예상 질문: What is IVY BLOOM? / How does it work? / How much? / What makes you different?

### 6-10. CTA (Final)
- 버건디 배경 풀너비
- "Ready to Get Started?" + 카카오 버튼

### 6-11. Footer
- 로고 + 카카오 채널 링크 + 인스타 / 유튜브 아이콘 + 카피라이트

---

## 7. Articles Pages

### /articles
- 전체 아티클 목록 (Sanity에서 fetch)
- 카테고리 필터 (College / Boarding / SAT / Essay 등)
- 카드 그리드 레이아웃

### /articles/[slug]
- Sanity Portable Text 렌더링
- **Article Schema.org** 적용
- 우측 또는 하단에 카카오 CTA 고정

---

## 8. SEO / AEO 설정

| 항목 | 내용 |
|------|------|
| Schema 타입 | `EducationalOrganization` (홈) |
| FAQ Schema | `FAQPage` (홈 FAQ 섹션) |
| Article Schema | `Article` (아티클 상세) |
| llms.txt | AI 추천용 한 줄 설명 파일 |
| sitemap.xml | Next.js 자동 생성 (`/articles/[slug]` 포함) |
| robots.txt | `/studio` 크롤링 차단 |
| OpenGraph | 페이지별 OG 이미지 + 타이틀 |
| Twitter Card | summary_large_image |

---

## 9. Sanity CMS 구조

### 스키마: `post`
```
title        string
slug         slug
publishedAt  datetime
category     string (College / Boarding / SAT / Essay / Other)
excerpt      text
body         Portable Text (block content)
mainImage    image (with alt)
```

### Studio 접근
- `/studio` 경로 (Vercel 배포 포함)
- 대행사만 접근, 클라이언트 비공개

---

## 10. 미결 항목 (구현 시 채워야 할 것)

- [ ] 카카오 채널 URL
- [ ] 컨설턴트 사진 (Hero, WhyUs)
- [ ] Stats 숫자 확정
- [ ] Testimonials 후기 텍스트
- [ ] FAQ 질문·답변 최종본
- [ ] llms.txt 한 줄 설명 문구
- [ ] GA4 측정 ID
