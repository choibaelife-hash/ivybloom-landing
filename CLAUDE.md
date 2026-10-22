# IVY BLOOM CONSULTING 랜딩페이지 프로젝트

> 이 파일은 10_Claude브리핑 시트에 IVY BLOOM 실측 정보를 채운 버전입니다.
> "진행 상황 & 다음 세션 체크리스트" 섹션은 작업할 때마다 최신 상태로 업데이트하세요 —
> 다음 세션이 여기만 읽고 바로 이어서 시작할 수 있어야 합니다.

---

## 🔄 진행 상황 & 다음 세션 체크리스트

### 2026-10-21 고객 수정 요청 37건 — 로컬 반영 작업
- 원문: `/Users/km/Downloads/ivy-site_revision-수정요청 (2).md`. 사용자가 37건 전체와 제안한 6가지 정리 방향을 승인함.
- 기준: 대학 지원·에세이는 Grades 11–12, 상담은 온라인, 사례의 학생 대명사는 he/his. 신규 사례와 로드맵에는 학생을 특정하지 않는 설명용 이미지를 사용. 무료 문의와 유료 상세 상담을 구분. 기존 글과 원격 데이터는 보존하며 분류 표시를 정리한다.
- 순서: (1) 홈·공통 FAQ (2) About 대표/사례/4개 서비스 (3) Services 절차/4개 상세/이미지/바로가기 (4) 공개·관리자 카테고리 및 문의 선택지 (5) 타입·빌드·PC/모바일 검증.
- 검증 기준: 37개 원문 대응, 4개 서비스 링크와 번호, 긴 문단/모바일 넘침, FAQ/검색 정보 일치, 기존 글 접근 유지, 신규 문의 선택값.
- 범위: 로컬 코드와 검증만. 커밋·푸시·배포·운영 CMS 쓰기는 수행하지 않는다. 기존 Formspree 미연결은 별도 사항이다.
- 상태: 37건 로컬 반영·검증 완료. 2026-10-22 사용자 요청으로 커밋·푸시(main) 진행. 운영 CMS 변경 없음.
- 2026-10-22 배포: GitHub 푸시는 내 계정 `ivybloom-landing`에만 자동 배포됨(고객 프로젝트는 Git 미연결). 고객 계정 CLI 로그인(별도 global-config)으로 `ivybloom-consulting`에 `vercel deploy --prod` → Ready, 두 도메인 alias. 단 도메인이 Namecheap WHOIS 연락처 미인증으로 정지 상태(NS가 `failed-whois-verification.namecheap.com`/`verify-contact-details.namecheap.com`, A가 198.54.117.242 안내 페이지). 고객이 등록자 이메일 인증 후 기존 A/CNAME 복구 확인 필요. Search Console 인증도 그 이후.
- 2026-10-22 분류: 사용자 요청으로 글 분류에서 Other 제거 → 4개(story/college/boarding/consultation). 기존 other 값은 데이터 유지, 라벨 "Other"로 All에서만 표시, 관리자 저장 허용. `tools/generate-admin-schema.mjs`는 `ARTICLE_CATEGORIES.map`을 해석 못해 분류 목록을 지우므로 `lib/admin/schema.json`은 수동 수정함. Sanity 프로젝트 `16s9d1s4`("Ivy Bloom Consulting")는 고객 조직 `ouh8f8aa3`에 있음. Studio는 사이트 내장(`/studio`)이라 Sanity Studios 목록에 없음 → 도메인 복구 후 "Add missing studio by URL"로 등록.
- 2026-10-22 추가: About 4번 사례의 설명용 교실 이미지·캡션 삭제(고객에게 사용할 이미지 자료 요청 예정). About 서비스 카드 02 College Application만 `Grade 11`로 표기, 나머지 Grades 11–12 표기는 고객 요청 범위가 아니라 유지.
- 반영 내역: 1–4 홈 문제 설명, 5–8 홈 4개 서비스, 9–14 홈/About 공통 FAQ, 15–17 Sarah Kim/학력 문구 삭제, 18–21 사례 수정·4번째 사례/설명용 이미지, 22–25 About 4개 서비스, 26–30 온라인 진행 절차/10년 경력, 31–35 서비스 상세 4개/이미지 번호/바로가기, 36 글 분류, 37 문의 선택지.
- 공통 정합성: 대학 지원·에세이 대상 Grades 11–12, 사례 he/his, 무료 문의는 Free Inquiry/무료 문의로 표시. 유료 개별 상담은 사전 비용·범위 안내를 명시. 검색용 대표 소개의 이름·경력과 FAQ JSON-LD도 일치시킴.
- 새 사례 이미지는 기존 학교 이미지 소스를 재사용한 설명용 교실 사진이며 실제 학생의 학교가 아니라는 캡션을 표시. 로드맵은 계획·필기용 이미지를 사용. 모바일 긴 서비스 배지 줄바꿈과 4개 카드 배치를 확인함.
- CMS 읽기 전용 확인: 로컬 환경이 연결된 `16s9d1s4/production`에는 공개 college 글 1건과 빈 draft 2건이 있었으며 sat/essay 분류 및 Roblox/Sohee 본문은 없었음. 데이터 이동·삭제 없음. 공개 필터에서는 이전 sat/essay 값을 College Admissions로 표시하고, 관리자에 남은 로컬 초안의 이전 값도 보존·선택 표시·발행 검증 허용. 새 글 선택지는 새 분류 5개만 제공.
- 기존 About 사례 3개의 상세 slug에 해당하는 공개 글이 없어 링크를 준비 중 표시로 변경. 새로운 CMS 글이나 가짜 상세 페이지를 만들지 않음.
- 검증: `npm run build`(타입 검사 포함), 관련 테스트 10개, `git diff --check` 통과. 1440px/390px에서 홈·About·Services·Articles·Contact 5개 페이지 가로 넘침/깨진 이미지 없음. FAQ 6개 펼친 답변과 JSON-LD 일치, 새 서비스 이동/4개 바로가기, 상담 카테고리 필터, 문의 폼의 `service=roadmap` 선택값 확인. 실제 문의 제출은 하지 않음.
- 로컬 미리보기: `http://127.0.0.1:3017` (`next start`, 이 작업에서 실행). 임시 검증 결과는 `/tmp/ivy-browser-checks.json`, `/tmp/ivy-interaction-checks.json`, `/tmp/ivy-revision-build.log`에 있음.
- 남은 별도 사항: 기존 Formspree ID placeholder와 Services의 기존 FAQ 빈 답변 7개는 이번 37건에 포함되지 않아 유지. 운영 사이트·별도 호스팅 Sanity Studio 반영은 아직 하지 않음. 다음 단계는 사용자 확인 후 명시적인 배포 요청이 있을 때만 Git/배포 진행.

### 2026-10-13 경로 정리·Codex 대화 인수인계

#### 실제 경로와 연결 — 이번에 확인
- 실제 소스/Git 폴더: `/Users/km/Desktop/ivybloom`. 기준 브랜치 `main`, 문서 정리 전 HEAD `e11a9c0`, 작업 트리 깨끗함.
- GitHub origin: `https://github.com/choibaelife-hash/ivybloom-landing.git`.
- `/Users/km/Desktop/landing-system`은 위 실제 폴더를 가리키던 심볼릭 링크였으며, 사용자의 정리 요청에 따라 2026-10-13 링크만 삭제함. 별도 소스/하위 폴더를 가진 독립 폴더가 아니었음. 실제 폴더와 `.git`, 원격 연결 유지 확인.
- `.vercel/project.json`의 로컬 연결: 고객 프로젝트 `ivybloom-consulting`, projectId `prj_b9RLEMijquOz7c23AGRcBeDuD6Kc`, orgId `team_O2YpzE33oOOG0NmpRu8D8xMC`. 이 로컬 파일만으로 현재 운영 상태를 증명하지 않음.
- Codex 등록 프로젝트: 이름 `ivybloom`, projectId `ce44e1d5-ecf3-4c07-8e85-768ff46095fc`. 2026-10-13 사용자가 기존 프로젝트를 수정했고, 앱 `list_projects` 조회에서 기본 경로가 `/Users/km/Desktop/ivybloom`으로 바뀐 것을 확인함. 프로젝트 ID가 유지되어 새 프로젝트를 만든 것이 아님. 이후 사용자가 landing-system 연결을 제거했으며 저장된 `rootPaths`가 `['/Users/km/Desktop/ivybloom']`만 포함하는 것을 확인함. 프로젝트 기본/보조 폴더 정리 완료. 기존 프로젝트 ID와 기존 소속 대화가 유지됨. 실제 소스/Git 삭제나 '로컬 프로젝트 제거'는 수행하지 않음.
- 현재 대화 '고객 문의 내용 확인' (`01a12ea7-e486-7460-b3f3-b53558b0b0cc`)는 `projectId: null`이고 저장된 cwd가 여전히 삭제된 `/Users/km/Desktop/landing-system`임을 최종 조회에서 확인함. 프로젝트 수정이 이 기존 대화의 cwd까지 바꾸지는 않았음. 이 대화는 참고 기록으로 보존하고, 후속 작업은 경로가 정상인 기존 Ivy 대화 또는 수정한 ivybloom 프로젝트에서 시작한 대화에서 이 파일을 먼저 읽어 이어갈 것. 현재 대화 경로를 직접 변경할 지원 도구는 제공되지 않음.
- 경로 변경 전 기존 대화를 삭제/보관 처리하지 말 것. 새 프로젝트/대화 생성, 다른 대화에 메시지 보내기, 커밋·푸시·배포는 이번 문서 정리에서 수행하지 않음.

#### 기존 대화 찾아보기
기존 대화는 각각의 기록을 유지함. 새 대화가 모든 과거 내용을 자동으로 읽는다고 가정하지 말고, 이 요약부터 읽고 필요한 원문만 `read_thread`로 확인할 것. 아래는 실제 앱 조회에서 존재를 확인한 대화와 최근 결과임.

| 대화 제목 | 대화 ID | 이어볼 내용 |
|---|---|---|
| 고객 문의 내용 확인 | `01a12ea7-e486-7460-b3f3-b53558b0b0cc` | 이번 경로 정리, DNS 반영 확인, MX 질문, 아직 미확인인 HTTPS·접속·리디렉션 |
| Ivy Bloom 관리자 구축 문서 작성 | `01a1207a-5ae2-7710-910b-7eef47efbc9e` | 기존 공개 글은 '수정하고 발행' 흐름. 16:9 대표 이미지 생성/압축 변경은 당시 `abbafb4` 커밋·푸시·고객 Vercel 배포 완료 보고. 실제 유료 이미지 재생성은 미실행, 기존 정사각형 이미지 자동 변환 없음 |
| 아이비블룸 Sanity SEO 구조 분석 | `01a1209b-83e9-7612-b394-9f5a9a39d96f` | 실제 폴더는 ivybloom. 예전 등록 경로 문제 때문에 landing-system 링크를 복구했던 이력. 로컬 Studio 변경과 별도 호스팅 Studio 반영은 구분 |
| 모바일 여백과 프로세스 영역 줄이기 | `01a1293c-249b-79a2-ac1a-72ea35ae1e3e` | Services 모바일 여백 축소·상세 단계 숨김, WhyUs 모바일 로고 높이 350px. 당시 측정/타입 검사 결과는 원문 참조 |
| 성능 점수표와 완료 점검표 찾기 | `01a12980-dd5c-7441-aa4a-d8b02e9dd97f` | 고객 Vercel 배포·도메인 등록, Namecheap 설정 안내의 원문. 최종 고객 안내는 A 레코드 두 줄과 www CNAME 한 줄 |
| 도메인 적용 가이드라인 일반화 | `01a12087-7686-7e53-9ccb-5ae13693df75` | 기존 `Post_Development_Domain_SEO_AEO_GEO_Guide.md`는 재사용 절차 문서이며 실제 운영 검증 결과가 아님 |

#### 고객 도메인 — 확인된 것과 남은 것
- 도메인: `ivybloomconsulting.com`, `www.ivybloomconsulting.com`.
- 고객에게 안내했던 Namecheap 값은 기존 대화 원문에서 확인: A `@ → 216.150.1.1`, A `@ → 216.150.16.1`, CNAME `www → f549cf145ffe6b3c.vercel-dns-016.com.`. A가 두 개라는 이유만으로 오류라고 판단하거나 지우지 말 것.
- 고객 첨부 화면과 이번 Vercel DNS 조회에서 위 값의 반영 확인. DNS 조회는 `conflicts: []`, `misconfigured: false`이지만 동시에 `ipStatus: required-change`도 반환함. 일반 계정 조회의 추천 IP만으로 고객 프로젝트 DNS를 바꾸지 말고 해당 고객 프로젝트에서 요구하는 값과 상태를 확인할 것.
- 연결된 Vercel 커넥터 계정에서는 고객 프로젝트 조회가 되지 않았음. 사용자는 Chrome에 고객 Vercel 계정이 로그인돼 있다고 명시했으므로, 브라우저가 동작하면 그 계정/팀/프로젝트를 실제 확인할 것.
- 아직 미확인: 고객 프로젝트 Domains 화면 상태, 두 주소의 실제 홈페이지 표시, HTTPS 인증서 유효성, HTTP→HTTPS 및 기본/www 주소 이동, 실제 배포와 Git 연결 상태. 조회 도구 실패는 사이트 장애 증거가 아님.
- 브라우저 도구는 처음에 심볼릭 링크인 writable root 오류, 링크 삭제 후에는 `No such file or directory`로 시작 실패. 터미널 읽기/문서 쓰기는 `/private/tmp`를 cwd로 하고 승인된 실행으로 가능했음. 도구 장애와 고객 계정 인증 문제를 구분할 것.
- 고객의 TXT/MX 질문: 사진의 TXT는 이메일 SPF 설정이며 MX를 대신하지 않음. 홈페이지 A/CNAME 연결에는 MX가 필요 없지만 도메인 이메일 수신/전달에는 메일 서비스에 맞는 MX가 필요함. 사진의 'Email Forwarding' 표시만으로 실제 MX 부재나 전달 성공을 단정하지 말 것. 공개 MX 조회와 사용 중인 메일 서비스 확인이 남음. 기존 TXT/MX/Nameservers는 임의 변경하지 말 것.

#### 다음 대화 시작 순서
1. 실제 cwd가 `/Users/km/Desktop/ivybloom`인지, 기존 Codex 프로젝트 경로 변경이 반영됐는지 확인한다.
2. 이 파일의 이번 인수인계를 읽고 Git 상태를 확인한다. 과거 완료 보고와 현재 운영 검증을 구분한다.
3. 고객 Chrome의 Vercel `ivybloom-consulting` 프로젝트에서 Domains·Production·Git 연결을 읽기 전용 확인한다.
4. 두 도메인의 DNS·HTTPS·홈페이지 표시·리디렉션과 공개 MX를 실제 확인한다. 확인 실패/미완료를 명시하고, 설정 변경은 별도 요청 범위에서만 한다.
5. 아래 기존 미완성 목록은 과거 기록이다. 지금도 미완성인지 소스 확인 없이 단정하거나 이번 경로 정리 범위에서 코드를 수정하지 않는다.


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
- 2026-10-11: Pretendard를 로컬 가변 분할 글꼴로 제공하고 외부 CDN CSS 연결 제거. 홈 배경 사진을 반응형 `next/image`로 변경하고 즉시·우선 로딩 적용. 배포용 빌드와 모바일·PC 표시, 한글 글꼴 확인 완료. 운영 배포·PageSpeed 재검사 미실행.
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
- 폰트 — 본문: Pretendard 1.3.9 로컬 가변 분할 글꼴 (`app/fonts/pretendard/pretendard.css`, `app/globals.css`에서 가져옴). `unicode-range`로 필요한 문자 묶음만 다운로드하고 `font-display: swap` 적용. 라이선스는 같은 폴더의 `LICENSE.txt`.
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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
